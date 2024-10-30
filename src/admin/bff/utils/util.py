from datetime import datetime
from time import time

import pytz
from fastapi import Request


# タイムスタンプをJSTの文字列に変換
def timestamp_to_strjst(timestamp: int):
    dt = datetime.fromtimestamp(timestamp, pytz.timezone("Asia/Tokyo"))
    str_jst = dt.strftime("%Y/%m/%d %H:%M:%S")

    return str_jst


# JSTの文字列をタイムスタンプに変換
def strjst_to_timestamp(jst: str):
    date_format = "%Y%m%d%H%M%S%z"
    ts_jst = datetime.strptime(jst + "+0900", date_format).timestamp()

    return ts_jst


# CSV利用文字をエスケープする
def csv_escape(data: str):
    return data.replace('"', '""')


# 接続元IPアドレス取得
def get_source_ip(request: Request):
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded is None:
        return request.client.host
    else:
        return forwarded.split(",")[0]


# ログ出力
def output_log(level: str, request: Request, msg: str):
    dt = timestamp_to_strjst(time())
    print(f"{level}: {dt} {get_source_ip(request)} {request.url.path} {msg}")
