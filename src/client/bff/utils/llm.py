import json
import os

import boto3
from core.config import settings


def ask(messages):
    # AWS Bedrockクライアントの初期化
    bedrock = boto3.client(
        'bedrock-runtime',
        region_name=settings.AWS_REGION
    )

    # Bedrockへのリクエスト
    response = bedrock.converse(
        modelId=settings.LLM_MODEL_ID,
        messages=messages
    )

    return response["output"]["message"]["content"][0]["text"]
