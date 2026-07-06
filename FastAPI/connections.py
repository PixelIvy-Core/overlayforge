from dotenv import load_dotenv
import os, redis, secrets, requests
from hashlib import md5
load_dotenv()

redis_host = str(os.getenv("REDIS_HOST"))
redis_port = int(os.getenv("REDIS_PORT", "6379"))
gonic_host = str(os.getenv("GONIC_HOST"))
gonic_port = str(os.getenv("GONIC_PORT"))
gonic_user = str(os.getenv("GONIC_USER"))
gonic_pswd = str(os.getenv("GONIC_PASSWORD"))


def get_redis():
    r = redis.Redis(redis_host, redis_port, decode_responses=True)
    return r


def get_gonic_url(endpoint: str, id: str = "None"):
    salt = secrets.token_urlsafe(16)
    token = md5((gonic_pswd + salt).encode()).hexdigest()
    url = f"{gonic_host}:{gonic_port}/rest/{endpoint}?u={gonic_user}&t={token}&s={salt}&c=overlayforge"
    if id != "None":
        url = f"{url}&id={id}"
    return url

def get_gonic_info(url: str, tag: str):
    response = requests.request("GET", url, params={"f": "json"})
    payload = response.json()["subsonic-response"]
    metadata = payload[tag]
    return metadata