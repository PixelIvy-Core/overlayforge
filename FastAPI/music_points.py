from fastapi import APIRouter, HTTPException
from collections.abc import AsyncIterable
from fastapi.sse import EventSourceResponse, ServerSentEvent
from connections import get_redis, get_gonic_url
from models import TrackInfo
from config import *
import asyncio as asc
import requests as req

router = APIRouter(prefix="/music", tags=["music"])

def setTrackInfo(id: str, title: str, artist: str, source: str):
    track = {"id": id, "title": title, "artist": artist, "source": source, "url":  get_gonic_url("stream", id)}
    with get_redis() as r:
        if not r:
            raise HTTPException(503, "Redis not reachable")
        r.hset(REDIS_INFO, mapping=track)
        r.set(REDIS_ID, id)
        r.close()
        
@router.post("/addToQueue")
async def add_track_at_end_of_queue(id: str):
    with get_redis() as r:
        if not r:
            raise HTTPException(503, "Redis not reachable")
        r.rpush(REDIS_QUEUE, id)
        r.close()
    return {"status": 200, "message": "track added to Queue"}

@router.get("/getQueue")
async def get_playing_queue():
    with get_redis() as r:
        if not r:
            raise HTTPException(503, "Redis not reachable")
        queue = r.lrange(REDIS_QUEUE,0,-1)
        r.close()
    return queue

@router.post("/clearQueue")
async def clear_current_queue():
    with get_redis() as r:
        if not r:
            raise HTTPException(503, "Redis not reachable")
        r.ltrim(REDIS_QUEUE, 1, 0)
        r.close()
    return {"status": 200, "message": "Queue cleared"}

@router.post("/next")
async def next_track():
    with get_redis() as r:
        if not r:
            raise HTTPException(503, "Redis not reachable")
        next_id = r.lpop(REDIS_QUEUE)
        r.close()
    if next_id:
        url = get_gonic_url("getSong", next_id)
        response = req.request("GET", url, params={"f": "json"})
        payload = response.json()["subsonic-response"]
        metadata = payload["song"]
        setTrackInfo(metadata["id"], str.replace(metadata['title'], ".mp3", ""), metadata['artist'], metadata['album'])
    else:
        raise HTTPException(204, "no more songs in Queue")
        
    return {"status": 200, "message": "next track set"}

@router.get("/nowPlaying")
async def get_current_track_informations():
    with get_redis() as r:
        if not r:
            raise HTTPException(503, "Redis not reachable")
        info = r.hgetall(REDIS_INFO)
    return info

@router.post("/setState")
async def set_play_state(new_state: bool):
    with get_redis() as r:
        if not r:
            raise HTTPException(503, "Redis not reachable")
        r.set(REDIS_STATE, str(new_state))
        r.close()
    return {"status": 200, "message": "Play State set succesfully"}

@router.get("/getState", response_class=EventSourceResponse)
async def get_play_state():
    last_state = None
    while True:
        await asc.sleep(3)
        with get_redis() as r:
            if not r:
                yield ServerSentEvent(comment="Redis not reachable")
                continue
            state = r.get(REDIS_STATE)
            r.close()
        if state != last_state:
            yield ServerSentEvent(data=str(state))
            last_state = state


@router.get("/getTrackInfo",response_class=EventSourceResponse, response_model=TrackInfo)
async def get_track_info(curr_id: str) -> AsyncIterable[TrackInfo]:
    last_track_id = curr_id
    with get_redis() as r:
        if r:
            track = r.hgetall(REDIS_INFO)
            if track:
                current_id = track["id"]
                if current_id != last_track_id:
                    yield ServerSentEvent(data=track)
                    last_track_id = current_id
    while True:
        await asc.sleep(2)
        with get_redis() as r:
            if not r:
                yield ServerSentEvent(comment="redis unreachable")
                continue
            track = r.hgetall(REDIS_INFO)
        if track:
            current_id = track["id"]
            if current_id != last_track_id:
                yield ServerSentEvent(data=track)
                last_track_id = current_id