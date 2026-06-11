FROM python:3.11-slim
LABEL maintainer="Skye Jonczik <skye.jonczik@proton.me>"
WORKDIR /app
COPY Docker/API/requirements.txt .
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    g++ \
    && pip install --no-cache-dir -r requirements.txt \
    && apt-get purge -y --auto-remove build-essential gcc g++ \
    && rm -rf /var/lib/apt/lists/*
COPY FastAPI/ ./app/
CMD ["fastapi", "run", "./app/api.py"]