#!/usr/bin/env python3
"""
Ingest existing markdown and text files into the database.
Run from the backend directory: uv run python scripts/ingest.py
"""

import os
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import select
from app.database import SessionLocal, init_db
from app.models import ContentFile

# Project root is two directories up from backend/scripts
PROJECT_ROOT = Path(__file__).parent.parent.parent

# Category mapping from the original frontend
CATEGORY_MAP = {
    "main.md": {"category": "Social Presence", "icon": "globe"},
    "deadlines.md": {"category": "Planning", "icon": "calendar"},
    "ai_sorcery.md": {"category": "AI & Tech", "icon": "sparkles"},
    "tools.txt": {"category": "AI & Tech", "icon": "wrench"},
    "URGENT.md": {"category": "Planning", "icon": "alert-triangle"},
    "dream_companies.txt": {"category": "Career", "icon": "briefcase"},
    "dream_companies_new.txt": {"category": "Career", "icon": "briefcase"},
    "companies.txt": {"category": "Career", "icon": "building"},
    "companies.md": {"category": "Career", "icon": "building"},
    "to_learn.md": {"category": "Learning", "icon": "book-open"},
    "research.md": {"category": "Research", "icon": "microscope"},
    "hpc_resources.md": {"category": "Resources", "icon": "folder"},
    "grants_to_apply.md": {"category": "Career", "icon": "trending-up"},
    "to_dos.md": {"category": "Planning", "icon": "check-square"},
    "todos.md": {"category": "Planning", "icon": "check-square"},
    "projects.md": {"category": "Projects", "icon": "folder"},
    "projects.txt": {"category": "Projects", "icon": "folder"},
}

# Featured files
FEATURED_SLUGS = ["main", "deadlines", "ai_sorcery", "URGENT"]


def format_title(filename: str) -> str:
    """Convert filename to title format."""
    name = filename.rsplit(".", 1)[0]  # Remove extension
    # Replace underscores and hyphens with spaces
    name = name.replace("_", " ").replace("-", " ")
    # Title case
    return name.title()


def ingest_files():
    """Read all markdown and text files and insert into database."""
    # Initialize database tables
    print("Initializing database...")
    init_db()

    db = SessionLocal()

    try:
        # Find all .md and .txt files in project root
        content_files = []
        for entry in PROJECT_ROOT.iterdir():
            if entry.is_file() and entry.suffix in [".md", ".txt"]:
                # Skip hidden files and backup files
                if entry.name.startswith(".") or "~" in entry.name:
                    continue
                content_files.append(entry)

        print(f"Found {len(content_files)} content files")

        for file_path in content_files:
            filename = file_path.name
            slug = file_path.stem  # Filename without extension
            extension = file_path.suffix[1:]  # Remove the dot

            # Read content
            try:
                content = file_path.read_text(encoding="utf-8")
            except Exception as e:
                print(f"Error reading {filename}: {e}")
                continue

            # Get category and icon
            meta = CATEGORY_MAP.get(filename, {"category": "Other", "icon": "file"})
            title = format_title(filename)
            is_featured = slug in FEATURED_SLUGS

            # Check if already exists
            stmt = select(ContentFile).where(ContentFile.slug == slug)
            existing = db.execute(stmt).scalar_one_or_none()

            if existing:
                # Update existing
                existing.content = content
                existing.title = title
                existing.category = meta["category"]
                existing.icon = meta["icon"]
                existing.is_featured = is_featured
                print(f"Updated: {filename}")
            else:
                # Create new
                new_file = ContentFile(
                    slug=slug,
                    title=title,
                    content=content,
                    category=meta["category"],
                    icon=meta["icon"],
                    file_extension=extension,
                    is_featured=is_featured,
                )
                db.add(new_file)
                print(f"Created: {filename}")

        db.commit()
        print("\nIngest completed successfully!")

        # Print summary
        stmt = select(ContentFile)
        all_files = db.execute(stmt).scalars().all()
        print(f"\nTotal files in database: {len(all_files)}")

        # Group by category
        categories = {}
        for f in all_files:
            if f.category not in categories:
                categories[f.category] = []
            categories[f.category].append(f.slug)

        print("\nBy category:")
        for cat, slugs in sorted(categories.items()):
            print(f"  {cat}: {len(slugs)} files")

    except Exception as e:
        print(f"Error during ingest: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    ingest_files()
