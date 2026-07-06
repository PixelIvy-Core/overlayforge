from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
from connections import twitch_client, twitch_secret, base_url, get_new_state, get_state
from config import TWITCH_SCOPES

router = APIRouter(prefix="/twitch", tags=["twitch"])

@router.post("/authorize")
async def Authorize_twitch_app():
    uri = f"{base_url}/twitch/redirect"
    state = get_new_state()
    return RedirectResponse(f"?response_type=code&client_id={twitch_client}&redirect_uri={uri}&scope={TWITCH_SCOPES}&state={state}")

#TODO: finish auth token saving
@router.post("/redirect")
async def Twitch_redirect_endpoint(code: str, scope: str, state: str, error: str, error_description: str):
    if error:
        return HTTPException(401, error_description)
    
    if scope != TWITCH_SCOPES:
        return HTTPException(400, "scopes do not match")
    
    expected_state = get_state()
    
    if expected_state != state:
        return HTTPException(400, "state is unexpected")
    
