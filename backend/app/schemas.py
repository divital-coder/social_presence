from datetime import datetime
from pydantic import BaseModel, Field


class ContentFileBase(BaseModel):
    slug: str = Field(..., min_length=1, max_length=255)
    title: str = Field(..., min_length=1, max_length=255)
    content: str
    category: str = Field(..., min_length=1, max_length=100)
    icon: str = Field(default="file", max_length=50)
    is_featured: bool = False


class ContentFileCreate(ContentFileBase):
    file_extension: str = Field(default="md", max_length=10)


class ContentFileUpdate(BaseModel):
    title: str | None = None
    content: str | None = None
    category: str | None = None
    icon: str | None = None
    is_featured: bool | None = None


class ContentFileResponse(ContentFileBase):
    id: int
    file_extension: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ContentFileListItem(BaseModel):
    slug: str
    title: str
    category: str
    icon: str
    is_featured: bool
    updated_at: datetime

    class Config:
        from_attributes = True


class ContentFilesListResponse(BaseModel):
    files: list[ContentFileListItem]


class MessageResponse(BaseModel):
    message: str


class ErrorResponse(BaseModel):
    detail: str


class AuthVerifyRequest(BaseModel):
    password: str


class AuthVerifyResponse(BaseModel):
    valid: bool
