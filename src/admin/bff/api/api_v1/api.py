from api.api_v1.endpoints import interview
from fastapi import APIRouter

api_router = APIRouter()
api_router.include_router(interview.router, prefix="", tags=["interview"])
