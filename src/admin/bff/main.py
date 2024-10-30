from api.api_v1.api import api_router
from core.config import settings
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware
from utils.util import output_log
import logging

app = FastAPI()

access_logger = logging.getLogger("uvicorn.access")

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 初期処理ミドルウェア
@app.middleware("http")
async def initial_middleware(request: Request, call_next):
    response = await call_next(request)
    access_logger.disabled = False

    # ヘルスチェックの場合はアクセスログを出力しない
    if request.url.path == settings.HEALTH_CHECK_PATH:
        access_logger.disabled = True
        return response

    # access log
    headers = ", ".join(
        f'"{key}": "{value}"' for key, value in dict(request.headers).items()
    )
    output_log(settings.LOG_LEVEL_INFO, request, "access: { " + headers + " }")

    # curlアクセス制限
    referer = request.headers.get("Referer")
    ua = request.headers.get("User-Agent")
    if settings.API_V1_STR in request.url.path and (
        referer is None or (ua is not None and "curl" in ua.lower())
    ):
        return JSONResponse(status_code=403, content={"detail": "Forbidden"})

    return response


@app.get(settings.HEALTH_CHECK_PATH)
async def health_check():
    # ヘルスチェックに対して200 OKを返す
    return {"status": "ok"}


app.include_router(api_router, prefix=settings.API_V1_STR)
app.mount("/", StaticFiles(directory="public", html=True), name="static")
