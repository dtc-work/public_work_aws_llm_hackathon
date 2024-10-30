from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    question: str = Field("", description="質問")


class ChatResponse(BaseModel):
    answer: str = Field("", description="回答")
