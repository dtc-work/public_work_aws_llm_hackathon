ARG DISTROLESS_VER

FROM python:3.11-slim AS builder

ARG FUNC_NAME

WORKDIR /app/src

COPY src/${FUNC_NAME}/bff/ ./

RUN set -x \
 && apt update -y \
 && apt upgrade -y \
 && \
 : "package install" \
 && pip --no-cache-dir install --upgrade pip \
 && mv requirements.txt ../ \
 && cd .. \
 && pip install --no-cache-dir --target py-packages -r requirements.txt \
 && \
 : "権限を変更" \
 && chown -R 1000:1000 /app

FROM gcr.io/distroless/python3:${DISTROLESS_VER}

WORKDIR /app/src
COPY --from=builder /app ../
ENV PYTHONPATH=/app/py-packages

EXPOSE 8000

CMD ["/app/py-packages/bin/uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
