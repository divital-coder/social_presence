from fastapi import Header, HTTPException, status
from app.config import get_settings

settings = get_settings()


async def verify_edit_password(x_edit_password: str = Header(..., alias="X-Edit-Password")):
    """Dependency to verify edit password from header."""
    if not settings.edit_password:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Edit password not configured on server",
        )

    if x_edit_password != settings.edit_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid edit password",
        )

    return True
