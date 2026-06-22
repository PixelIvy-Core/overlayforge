from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from music_points import router as music

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return{"status": 200, "message": "API working"}

app.include_router(music)