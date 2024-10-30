import asyncio
import os
import time
from typing import Optional

import requests
from core.config import settings
from fastapi import (APIRouter, HTTPException, Request, WebSocket)
from pydantic import BaseModel
from utils.llm import ask
from utils.storage import download_s3_file, list_s3_objects
from utils.transcribe import basic_transcribe
from utils.util import output_log_ws

router = APIRouter()

@router.get("/companies")
def get_companies(request: Request):
    companies = [
        {
            "id": "1",
            "name": "株式会社パソナ",
            "description": "パソナグループの“雇用創造”の歴史は、1976年に大阪・南森町のビルの一室から始まりました。「育児を終えてもう一度働きたいと願う家庭の主婦に、OL時代の能力や技能を活かすことのできる適切な仕事の場をつくりたい。」そんな思いから『人材派遣』が生まれ、現在では働きたいと願う方々のキャリアプラン、ライフプランに応じた多様な働き方を創出しています。またクライアントに人事組織戦略ならびに福利厚生サービスを提案しています。",
        }
    ]

    return {"companies": companies}

@router.websocket("/ws/simulation")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    conversation_history = []
    audio_queue = asyncio.Queue()  # Queue for incoming audio data

    try:
        output_log_ws(settings.LOG_LEVEL_INFO, websocket, "interview simulation started")

        # はじめのメッセージを受け取る
        data = await websocket.receive_json()

        # dataがkey company_idを持つことを確認
        if 'company_id' not in data or 'avatar_id' not in data:
            await websocket.send_text('{"error": "Invalid JSON format"}')
            output_log_ws(settings.LOG_LEVEL_ERROR, websocket, "cannot get company_id or avatar_id from request")

            return

        # {"company_id": "***"} の形式で company_id を取得
        company_id = data['company_id']
        avatar_id = data['avatar_id']

        prompt_rule = settings.PROMPT_RULE[avatar_id]
        prompt = prompt_rule + settings.PROMPT_EVALUATION_METHOD

        # メッセージの準備
        initial_messages = [
            {
                "role": "user",
                "content": [
                    {"text": prompt}
                ]
            }
        ]

        # TODO: 一時的にテスト用のファイルを使う
        # messages = append_documents_from_storage(company_id, initial_messages)
        messages = append_document("test_files/interview-techniques.pdf", initial_messages)
        messages = append_document(f"test_files/{company_id}/interview-question-list.txt", messages)
        messages = append_document(f"test_files/{company_id}/evaluation-logic.txt", messages)
        messages = append_document(f"test_files/{company_id}/job-posting.docx", messages)

        conversation_history = messages

        ai_response = ask(messages)
        await websocket.send_text(ai_response)
        conversation_history.append({"role": "assistant", "content": [{"text": ai_response}]})

        transcribe_task = None # 文字起こし処理を並列実行するための変数

        while True:
            message = await websocket.receive()
            if 'text' in message:
                # 録音終了のメッセージが送られてきたら、文字起こし結果の処理を行う
                if message['text'] == '{"stop": true}':
                    output_log_ws(settings.LOG_LEVEL_INFO, websocket, "recording stopped")

                    await audio_queue.put(None) # audio_queueにNoneを追加し、basic_transcribeを終了させる

                    if transcribe_task:
                        await transcribe_task  # タスクの完了を待つ

                        transcribe_result_list = transcribe_task.result()
                        output_log_ws(settings.LOG_LEVEL_INFO, websocket, f"transcribe_result_list: {transcribe_result_list}")

                        data = ''.join(transcribe_result_list) # 配列の要素を結合して1つの文字列にする
                        output_log_ws(settings.LOG_LEVEL_INFO, websocket, f"transcribe_result: {data}")

                        transcribe_task = None # 録音終了したため初期化する
                    else:
                        data = ""
                else:
                    data = message['text']

                output_log_ws(settings.LOG_LEVEL_INFO, websocket, f"data: {data}")
                conversation_history.append({"role": "user", "content": [{"text": data}]})

                ai_response = ask(conversation_history)
                await websocket.send_text(ai_response)
                conversation_history.append({"role": "assistant", "content": [{"text": ai_response}]})

                # 会話が完了したかチェック
                if "総合評価" in ai_response:
                    # TODO: RDBに会話履歴を保存

                    output_log_ws(settings.LOG_LEVEL_INFO, websocket, "evaluation completed")

                    break

            elif 'bytes' in message:
                await audio_queue.put(message['bytes'])

                # 録音開始時にtranscribe_taskを開始
                if transcribe_task is None:
                    transcribe_task = asyncio.create_task(basic_transcribe(audio_queue, websocket))
                    output_log_ws(settings.LOG_LEVEL_INFO, websocket, "transcribe started")

    # TODO: エラーハンドリング考える
    except Exception as e:
        output_log_ws(settings.LOG_LEVEL_ERROR, websocket, f"Error: {e}")
    finally:
        await websocket.close()
        output_log_ws(settings.LOG_LEVEL_INFO, websocket, "interview simulation finished")


def append_documents_from_storage(company_id, messages):
    # TODO: bucket名の指定方法を決める
    # company_idを元にS3にアクセスし、ファイル群を取得
    object_list = list_s3_objects(company_id)

    # TODO: ファイルの容量制限

    # ファイルの処理
    for object in object_list:
        temp_file_path = download_s3_file(object)

        messages = append_document(temp_file_path, messages)

        # TODO: このタイミングで良いか
        # 一時ファイルを削除
        os.remove(temp_file_path)

    return messages


def append_document(file_path, messages):
    with open(file_path, "rb") as f:
        file = f.read()
        file_type = file_path.split('.')[-1]
        file_name = file_path.split('/')[-1].split('.')[0] # 拡張子の前の部分まで

    # TODO: 'pdf'|'csv'|'doc'|'docx'|'xls'|'xlsx'|'html'|'txt'|'md' に限定する
    # https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/bedrock-runtime/client/converse.html#

    messages[0]["content"].append({
        "document": {
            "format": file_type,
            "name": file_name,
            "source": {
                "bytes": file
            }
        }
    })

    return messages

# VideoRequest
class VideoRequest(BaseModel):
    text: str  # 動画生成に使用するテキスト
    avatar_id: Optional[int] = None  # アバターIDを受け取る
    image_path: Optional[str] = None  # フロントから渡される画像のパス

# 画像をアップロードし、URLを取得する関数
def upload_image(image_path: str):
    url = settings.AVATAR_IMAGE_URL
    headers = {
        "accept": "application/json",
        "authorization": settings.AVATAR_API_KEY
    }
    full_path = f"public/{image_path}"
    # 画像ファイルを開いてアップロード
    with open(full_path, "rb") as image_file:
        files = {"image": (full_path.split("/")[-1], image_file, "image/jpeg")}
        response = requests.post(url, files=files, headers=headers)

        return response.json().get("url")

# avatar_id に基づいて voice_id を取得する関数
def get_voice_id(avatar_id: int) -> str:
    voice_map = {
        1: "ja-JP-NaokiNeural",
        2: "ja-JP-ShioriNeural",
        3: "ja-JP-NanamiNeural",
        4: "ja-JP-DaichiNeural",
    }
    return voice_map.get(avatar_id, "ja-JP-NaokiNeural")  # デフォルトは Naoki

# 動画生成APIのエンドポイント
@router.post("/generate-video")
async def generate_video(request: VideoRequest):
    # 画像をアップロードし、取得したURLを使用
    if request.image_path:
        image_url = upload_image(request.image_path)
    else:
        raise HTTPException(status_code=400, detail="画像パスが提供されていません")

    # avatar_id に基づいて voice_id を取得
    voice_id = get_voice_id(request.avatar_id)

    # D-IDのAPIエンドポイント
    url = settings.AVATAR_TALK_URL
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "authorization": settings.AVATAR_API_KEY,
    }

    payload = {
        "source_url": image_url,
        "script": {
            "type": "text",
            "subtitles": "false",
            "provider": {
                "type": "microsoft",
                "voice_id": voice_id
            },
            "input": request.text
        },
        "config": {"fluent": "false", "pad_audio": "0.0"}
    }

    # 動画生成リクエストを送信
    response = requests.post(url, json=payload, headers=headers)
    result = response.json()
    talk_id = result.get("id")

    if not talk_id:
        raise HTTPException(status_code=500, detail="動画生成リクエストが失敗しました")

    # 動画生成が完了するまで待機する関数
    def poll_for_video_completion(talk_id):
        poll_url = settings.AVATAR_TALK_URL + talk_id
        while True:
            poll_response = requests.get(poll_url, headers=headers)
            data = poll_response.json()
            status = data.get("status")

            if status == "done":
                return data.get("result_url")  # 動画URLを返す
            elif status == "error":
                raise HTTPException(status_code=500, detail="動画生成中にエラーが発生しました")

            time.sleep(1)  # 1秒待機して再確認

    video_url = poll_for_video_completion(talk_id)
    return {"video_url": video_url}


