from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.database import get_db
from app.models import ContentFile
from app.schemas import (
    ContentFileCreate,
    ContentFileUpdate,
    ContentFileResponse,
    ContentFilesListResponse,
    ContentFileListItem,
    MessageResponse,
)
from app.middleware.auth import verify_edit_password

router = APIRouter(prefix="/api/files", tags=["files"])


@router.get("", response_model=ContentFilesListResponse)
async def list_files(db: Session = Depends(get_db)):
    """List all content files (metadata only)."""
    stmt = select(ContentFile).order_by(ContentFile.category, ContentFile.title)
    result = db.execute(stmt)
    files = result.scalars().all()

    return ContentFilesListResponse(
        files=[
            ContentFileListItem(
                slug=f.slug,
                title=f.title,
                category=f.category,
                icon=f.icon,
                is_featured=f.is_featured,
                updated_at=f.updated_at,
            )
            for f in files
        ]
    )


@router.get("/{slug}", response_model=ContentFileResponse)
async def get_file(slug: str, db: Session = Depends(get_db)):
    """Get a single file by slug."""
    stmt = select(ContentFile).where(ContentFile.slug == slug)
    result = db.execute(stmt)
    file = result.scalar_one_or_none()

    if not file:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"File with slug '{slug}' not found",
        )

    return file


@router.post("", response_model=ContentFileResponse, status_code=status.HTTP_201_CREATED)
async def create_file(
    file_data: ContentFileCreate,
    db: Session = Depends(get_db),
    _: bool = Depends(verify_edit_password),
):
    """Create a new content file."""
    # Check if slug already exists
    stmt = select(ContentFile).where(ContentFile.slug == file_data.slug)
    existing = db.execute(stmt).scalar_one_or_none()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"File with slug '{file_data.slug}' already exists",
        )

    file = ContentFile(
        slug=file_data.slug,
        title=file_data.title,
        content=file_data.content,
        category=file_data.category,
        icon=file_data.icon,
        file_extension=file_data.file_extension,
        is_featured=file_data.is_featured,
    )

    db.add(file)
    db.commit()
    db.refresh(file)

    return file


@router.put("/{slug}", response_model=ContentFileResponse)
async def update_file(
    slug: str,
    file_data: ContentFileUpdate,
    db: Session = Depends(get_db),
    _: bool = Depends(verify_edit_password),
):
    """Update an existing content file."""
    stmt = select(ContentFile).where(ContentFile.slug == slug)
    result = db.execute(stmt)
    file = result.scalar_one_or_none()

    if not file:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"File with slug '{slug}' not found",
        )

    # Update only provided fields
    update_data = file_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(file, field, value)

    file.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(file)

    return file


@router.delete("/{slug}", response_model=MessageResponse)
async def delete_file(
    slug: str,
    db: Session = Depends(get_db),
    _: bool = Depends(verify_edit_password),
):
    """Delete a content file."""
    stmt = select(ContentFile).where(ContentFile.slug == slug)
    result = db.execute(stmt)
    file = result.scalar_one_or_none()

    if not file:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"File with slug '{slug}' not found",
        )

    db.delete(file)
    db.commit()

    return MessageResponse(message=f"File '{slug}' deleted successfully")
