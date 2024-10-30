import os
import tempfile

import boto3


# TODO: ロジック見直し
# S3のバケットからオブジェクトのリストを取得する関数
def list_s3_objects(bucket_name):
    # S3クライアントの初期化
    s3_client = boto3.client('s3')

    try:
        # バケット内のオブジェクト一覧を取得
        response = s3_client.list_objects_v2(Bucket=bucket_name)

        # オブジェクト一覧を返す
        return response.get('Contents', [])

    except Exception as e:
        print(f"オブジェクト一覧の取得中にエラーが発生しました: {str(e)}")
        return []

# TODO: ロジック見直し
def download_s3_file(bucket_name, object_key):
    # S3クライアントの初期化
    s3_client = boto3.client('s3')

    # 一時ファイルの作成
    with tempfile.NamedTemporaryFile(delete=False) as temp_file:
        try:
            # S3からファイルをダウンロードし、一時ファイルに書き込む
            s3_client.download_fileobj(bucket_name, object_key, temp_file)

            # 一時ファイルのパスを取得
            temp_file_path = temp_file.name
            print(f"ファイルが正常にダウンロードされました: {temp_file_path}")

            return temp_file_path

        except Exception as e:
            print(f"ファイルのダウンロード中にエラーが発生しました: {str(e)}")
            os.unlink(temp_file.name)
            return None
