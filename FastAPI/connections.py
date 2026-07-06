from dotenv import load_dotenv
from config import REDIS_OAUTH_STATE
import os, redis, secrets, requests, random
from hashlib import md5
load_dotenv()

redis_host = str(os.getenv("REDIS_HOST"))
redis_port = int(os.getenv("REDIS_PORT", "6379"))
gonic_host = str(os.getenv("GONIC_HOST"))
gonic_port = str(os.getenv("GONIC_PORT"))
gonic_user = str(os.getenv("GONIC_USER"))
gonic_pswd = str(os.getenv("GONIC_PASSWORD"))
twitch_client = str(os.getenv("TWITCH_CLIENT_ID"))
twitch_secret = str(os.getenv("TWITCH_CLIENT_SECRET"))
base_url = str(os.getenv("VITE_FASTAPI_URL"))


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

def get_new_state():
    state = str(random.getrandbits(32))
    with get_redis() as r:
        r.set(REDIS_OAUTH_STATE, state)
        r.close()
    return state
        
def get_state():
    with get_redis() as r:
        state = r.get(REDIS_OAUTH_STATE)
        r.close()
    return state