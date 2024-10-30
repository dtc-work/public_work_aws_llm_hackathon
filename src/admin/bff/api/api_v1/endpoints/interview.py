import uuid
from datetime import date
from time import time

import schemas.interview as interview_schema
import utils.llm as llm_util
from core.config import settings
from fastapi import APIRouter, HTTPException, Request
from utils.util import get_source_ip, output_log, timestamp_to_strjst
from typing import List, Dict 

router = APIRouter()


@router.post("/chat", response_model=interview_schema.ChatResponse)
def call_llm(chat_request: interview_schema.ChatRequest, request: Request):
    response = llm_util.ask(chat_request.question)

    # ログの登録
    log_id = str(uuid.uuid4())
    partition = date.today().strftime("%Y%m")
    origin = request.headers.get("origin")
    if origin is None or "localhost" in origin:
        partition = "demo"

    item_body = {
        "id": log_id,
        "partition": partition,
        "q": chat_request.question,
        "a": response,
        "ip_address": get_source_ip(request),
        "created_at": timestamp_to_strjst(time()),
    }

    return {"answer": response}
