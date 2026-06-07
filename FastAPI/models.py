from pydantic import BaseModel

class TrackInfo(BaseModel):
    id: str
    url: str
    title: str
    artist: str
    source: str