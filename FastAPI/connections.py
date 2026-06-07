from dotenv import load_dotenv
import os, redis, secrets
from hashlib import md5
load_dotenv()

redis_host = os.getenv("REDIS_HOST")
redis_port = os.getenv("REDIS_PORT")
gonic_host = os.getenv("GONIC_HOST")
gonic_port = os.getenv("GONIC_PORT")
gonic_user = os.getenv("GONIC_USER")
gonic_pswd = os.getenv("GONIC_PASSWORD")


def get_redis():
    r = redis.Redis(redis_host, redis_port, decode_responses=True)
    return r


def get_gonic_url(endpoint: str, id: str):
    salt = secrets.token_urlsafe(16)
    token = md5((gonic_pswd + salt).encode()).hexdigest()
    url = f"{gonic_host}:{gonic_port}/rest/{endpoint}?u={gonic_user}&t={token}&s={salt}&c=overlayforge&id={id}"
    return url