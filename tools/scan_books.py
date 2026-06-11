"""
Scan books/ for PDFs and generate/update books/metadata.json.

Usage:
    python3 tools/scan_books.py

Extracts title and author from filenames like:
    "Title -- Author. -- (source).pdf"
    "Title -- Author.pdf"
    "Title.pdf"

Preserves existing metadata fields (description, cover, year, language, pages)
when re-scanning so you don't lose manual edits.
"""

import json
import os
import re
from pathlib import Path

BOOKS_DIR = Path("books")
METADATA_FILE = BOOKS_DIR / "metadata.json"


def slugify(text):
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    return text


def parse_filename(stem):
    """Parse a PDF filename to extract title and author."""
    parts = [p.strip() for p in stem.split("--")]

    if len(parts) >= 2:
        title = parts[0]
        author = parts[1]
        author = re.sub(r"[\(\[].*?[\)\]]", "", author).strip()
        author = re.sub(r"\s+", " ", author).strip()
    else:
        title = stem
        author = "Autor desconocido"

    return title, author


def load_existing_metadata():
    """Load existing metadata.json if it exists."""
    if METADATA_FILE.exists():
        with open(METADATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


def build_metadata_map(entries):
    """Build a lookup map keyed by PDF path."""
    m = {}
    for entry in entries:
        pdf_path = entry.get("pdf", "")
        if pdf_path:
            m[pdf_path] = entry
    return m


def scan_pdfs():
    """Scan books/ for PDF files and generate metadata entries."""
    existing = load_existing_metadata()
    existing_map = build_metadata_map(existing)

    pdf_files = sorted(BOOKS_DIR.glob("*.pdf"))
    new_metadata = []

    for pdf_path in pdf_files:
        rel_path = str(pdf_path)

        if rel_path in existing_map:
            entry = existing_map[rel_path]
        else:
            stem = pdf_path.stem
            title, author = parse_filename(stem)
            entry = {
                "id": slugify(title),
                "title": title,
                "author": author,
                "year": "",
                "description": "",
                "cover": "",
                "pdf": rel_path,
                "pages": 0,
                "language": "",
            }

        # Ensure all keys exist
        for key in ["id", "title", "author", "year", "description", "cover", "pdf", "pages", "language"]:
            entry.setdefault(key, "" if key != "pages" else 0)

        new_metadata.append(entry)

    return new_metadata


def main():
    metadata = scan_pdfs()

    with open(METADATA_FILE, "w", encoding="utf-8") as f:
        json.dump(metadata, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"✅ Scanned {len(metadata)} PDF(s)")
    print(f"📄 Updated: {METADATA_FILE}")
    print("\nEdit the file to add descriptions, year, cover URLs, etc.")


if __name__ == "__main__":
    main()
