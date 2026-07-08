"""Añade un libro a data/books.db y regenera assets/books.js.

Flujo interactivo:
    uv run python scripts/add_book.py

También acepta argumentos directos:
    uv run python scripts/add_book.py "Título del libro" --isbn 8495720124 \
        --link https://drive.google.com/file/d/XXXX --category "Manual práctico"

Reglas del título:
    - Si --isbn es omitido o "Anonimo" se marca como anónimo (autor=Anónimo).
    - Si se pasa un ISBN numérico, se enriquece desde Open Library
      (autor, año, páginas, portada). Lo que falte se rellena con lo provisto.
"""
from __future__ import annotations

import argparse
import json
import re
import sqlite3
import sys
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / "data" / "books.db"

CATEGORIES = ["Clásico", "Manual práctico", "Investigación", "Místico"]


# ── Google Drive helpers ───────────────────────────────────
def drive_file_id(url: str) -> str | None:
    """Extrae el FILE_ID de un link de Google Drive (file/d/ o document/d/)."""
    m = re.search(r"/(?:file|document|presentation|spreadsheets?)/d/([A-Za-z0-9_-]{10,})", url)
    if m:
        return m.group(1)
    m = re.search(r"[?&]id=([A-Za-z0-9_-]{10,})", url)
    if m:
        return m.group(1)
    return None


def drive_thumbnail(file_id: str, sz: str = "w800") -> str:
    """URL del thumbnail que Drive genera de la primera página del archivo."""
    return f"https://drive.google.com/thumbnail?id={file_id}&sz={sz}"


def resolve_cover(*, explicit: str | None, isbn_cover: str | None,
                  link: str, allow_drive_thumb: bool = True) -> str | None:
    """Decide la URL de portada con prioridad:
    1) explícita (--cover);
    2) Open Library (ISBN);
    3) thumbnail de Google Drive (primera página del archivo);
    4) None → la SPA renderiza una portada procedural.
    """
    if explicit:
        return explicit
    if isbn_cover:
        return isbn_cover
    if allow_drive_thumb:
        fid = drive_file_id(link)
        if fid:
            return drive_thumbnail(fid)
    return None


# ── Utilidades ─────────────────────────────────────────────
def prompt(msg: str, default: str | None = None) -> str:
    suffix = f" [{default}]" if default else ""
    raw = input(f"{msg}{suffix}: ").strip()
    return raw or (default or "")


def fetch(url: str, timeout: int = 15) -> dict:
    req = urllib.request.Request(url, headers={"User-Agent": "astral-lib/1.0"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode("utf-8"))


def enrich_isbn(isbn: str) -> dict:
    """Devuelve un dict con los metadatos disponibles vía Open Library."""
    data = fetch(
        f"https://openlibrary.org/api/books?bibkeys=ISBN:{isbn}&format=json&jscmd=data"
    )
    rec = data.get(f"ISBN:{isbn}")
    if not rec:
        return {}

    author = rec.get("authors", [{}])[0].get("name")
    year = rec.get("publish_date")
    if year:
        digits = "".join(c for c in year if c.isdigit())
        year = int(digits[:4]) if len(digits) >= 4 else None
    pages = rec.get("pagination")
    if pages:
        digits = "".join(c for c in pages if c.isdigit())
        pages = int(digits) if digits else None
    cover = None
    if rec.get("cover"):
        cover = rec["cover"].get("medium") or rec["cover"].get("large")

    return {
        "author": author,
        "year": year,
        "pages": pages,
        "cover": cover,
        "link_openlibrary": rec.get("url"),
    }


# ── DB ─────────────────────────────────────────────────────
def insert(conn: sqlite3.Connection, book: dict) -> int:
    cur = conn.execute(
        """INSERT INTO books
           (title, author, year, category, language, pages, rating,
            featured, cover_url, link, description)
           VALUES (:title, :author, :year, :category, :language, :pages, :rating,
                   :featured, :cover, :link, :description)""",
        book,
    )
    conn.commit()
    return cur.lastrowid


# ── Export ─────────────────────────────────────────────────
def reexport() -> None:
    export_path = ROOT / "scripts" / "export_books.py"
    import subprocess
    subprocess.run([sys.executable, str(export_path)], check=True)


# ── Main interactivo ───────────────────────────────────────
def interactive() -> dict:
    print("╭─ Añadir un libro a Astral ──────────────╮")
    print("╰──────────────────────────────────────────╯")

    title = prompt("Título del libro")
    if not title:
        sys.exit("✘ El título es obligatorio.")

    raw_isbn = prompt("ISBN (o 'Anonimo' si no tiene)", "Anonimo").strip()
    is_anon = raw_isbn.lower() in {"", "anonimo", "anónimo"}

    link = prompt("Enlace de Drive del archivo")
    if not link:
        sys.exit("✘ El enlace es obligatorio (link individual del archivo).")

    cat = prompt(f"Categoría [{' | '.join(CATEGORIES)}]", "Manual práctico")
    cat = cat if cat in CATEGORIES else "Manual práctico"

    author = year = pages = cover = isbn_cover = None
    description = prompt(
        "Descripción breve (opcional)",
        "Obra sobre viajes astrales y cómo realizarlos.",
    )
    raw_rating = prompt("Valoración 0-5 (opcional)", "0") or "0"
    try:
        rating = float(raw_rating) or None
    except ValueError:
        rating = None
    featured = prompt("¿Destacado? s/N", "N").lower() in {"s", "si", "sí", "y"}

    if is_anon:
        author = "Anónimo"
    else:
        print(f"→ Enriqueciendo ISBN {raw_isbn} desde Open Library…")
        meta = enrich_isbn(raw_isbn)
        isbn_cover = None
        if meta:
            author = meta.get("author")
            year = meta.get("year")
            pages = meta.get("pages")
            isbn_cover = meta.get("cover")
            print(f"  ✓ autor={author} año={year} págs={pages}")
        else:
            isbn_cover = f"https://covers.openlibrary.org/b/isbn/{raw_isbn}-M.jpg"
        author = author or prompt("Autor (no encontrado en OL)")
        year = int(prompt("Año (no encontrado en OL)", "0") or 0) or None
        pages = int(prompt("Páginas (no encontrado en OL)", "0") or 0) or None

    cover = resolve_cover(explicit=None, isbn_cover=isbn_cover, link=link,
                         allow_drive_thumb=True)
    if cover and "drive.google.com/thumbnail" in cover:
        print(f"  ✓ Portada derivada del thumbnail de Drive (primera página del archivo)")
    elif cover:
        print(f"  ✓ Portada desde Open Library")

    return {
        "title": title,
        "author": author,
        "year": year,
        "category": cat,
        "language": "es",
        "pages": pages,
        "rating": rating,
        "featured": 1 if featured else 0,
        "cover": cover,
        "link": link,
        "description": description,
    }


def main() -> None:
    ap = argparse.ArgumentParser(description="Añadir un libro a Astral.")
    ap.add_argument("title", nargs="?", help="Título del libro")
    ap.add_argument("--isbn", default="Anonimo", help="ISBN o 'Anonimo'")
    ap.add_argument("--link", help="Enlace de Drive del archivo")
    ap.add_argument("--category", default="Manual práctico", choices=CATEGORIES)
    ap.add_argument("--author", help="Autor (sobreescribe)")
    ap.add_argument("--year", type=int, help="Año (sobreescribe)")
    ap.add_argument("--pages", type=int, help="Páginas (sobreescribe)")
    ap.add_argument("--description", default="Obra sobre viajes astrales y cómo realizarlos.")
    ap.add_argument("--rating", type=float, default=None)
    ap.add_argument("--featured", action="store_true")
    ap.add_argument("--no-export", action="store_true", help="No regenerar books.js")
    ap.add_argument("--cover", help="URL de portada explícita (sobreescribe autodetección)")
    ap.add_argument("--no-drive-thumbnail", action="store_true",
                    help="No derivar portada del thumbnail de Drive")
    args = ap.parse_args()

    if args.title and args.link:
        is_anon = args.isbn.lower() in {"", "anonimo", "anónimo"}
        isbn_cover = None
        author = args.author or ("Anónimo" if is_anon else None)
        year = args.year
        pages = args.pages
        if not is_anon:
            meta = enrich_isbn(args.isbn)
            author = author or meta.get("author")
            year = year or meta.get("year")
            pages = pages or meta.get("pages")
            isbn_cover = meta.get("cover") or \
                f"https://covers.openlibrary.org/b/isbn/{args.isbn}-M.jpg"
        cover = resolve_cover(
            explicit=args.cover, isbn_cover=isbn_cover, link=args.link,
            allow_drive_thumb=not args.no_drive_thumbnail,
        )
        book = {
            "title": args.title,
            "author": author or "Desconocido",
            "year": year,
            "category": args.category,
            "language": "es",
            "pages": pages,
            "rating": args.rating,
            "featured": 1 if args.featured else 0,
            "cover": cover,
            "link": args.link,
            "description": args.description,
        }
    else:
        book = interactive()

    if not DB_PATH.exists():
        sys.exit(
            f"✘ No existe {DB_PATH}. Ejecuta primero: uv run python scripts/seed_books.py"
        )
    conn = sqlite3.connect(DB_PATH)
    try:
        rid = insert(conn, book)
        print(f"✔ Insertado id={rid}: {book['title']} — {book['author']}")
    finally:
        conn.close()

    if not args.no_export:
        reexport()


if __name__ == "__main__":
    main()