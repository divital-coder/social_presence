from fastapi import APIRouter
from app.config import get_settings
from app.schemas import AuthVerifyRequest, AuthVerifyResponse

router = APIRouter(prefix="/api/auth", tags=["auth"])
settings = get_settings()


@router.post("/verify", response_model=AuthVerifyResponse)
async def verify_password(request: AuthVerifyRequest):
    """Verify if the provided password is correct."""
    is_valid = request.password == settings.edit_password
    return AuthVerifyResponse(valid=is_valid)
