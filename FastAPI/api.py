from fastapi import FastAPI
from fastapi.sse import EventSourceResponse
from pydantic import BaseModel

app = FastAPI()

@app.get("/")
async def root():
    return{"message": "lorem ipsum"}

@app.get("alert/stream")
async def stream_alert():
    yield 0

@app.get("chat/stream")
async def stream_chat():
    yield 0