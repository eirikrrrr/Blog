"""Crea data/books.db y la siembra con los 3 libros de la carpeta de Drive del usuario.

Ejecutar:
    uv run python scripts/seed_books.py
"""
from __future__ import annotations

import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent.parent / "data" / "books.db"

SCHEMA = """
DROP TABLE IF EXISTS books;

CREATE TABLE books (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT    NOT NULL,
    author      TEXT    NOT NULL,
    year        INTEGER,
    category    TEXT    NOT NULL,          -- Clásico | Manual práctico | Investigación | Místico
    language    TEXT    NOT NULL DEFAULT 'es',
    pages       INTEGER,
    rating      REAL,                        -- 0.0 - 5.0
    featured    INTEGER NOT NULL DEFAULT 0,  -- 0 | 1
    cover_url   TEXT,                        -- URL de portada (thumbnail de Drive, Open Library, etc.)
    link        TEXT    NOT NULL,            -- dónde conseguirlo
    description TEXT    NOT NULL
);
"""

# Links individuales de Google Drive (uno por archivo).
DOC_LINK     = "https://docs.google.com/document/d/12fm8V5_LGHfSl95ELPaUR9P2WAFM0r1c/edit?usp=drive_link"
DESDOB_LINK  = "https://drive.google.com/file/d/1xnEGXiTa19MXPtow7s6-Bak8fXhlFNkS/view?usp=drive_link"
ELAM_LINK    = "https://drive.google.com/file/d/1NP0B_hWW8tSeD6VwixgTaTRKEr180qS6/view?usp=drive_link"

# File IDs para generar los thumbnails de portada automáticamente.
DOC_ID    = "12fm8V5_LGHfSl95ELPaUR9P2WAFM0r1c"
DESDOB_ID = "1xnEGXiTa19MXPtow7s6-Bak8fXhlFNkS"
ELAM_ID   = "1NP0B_hWW8tSeD6VwixgTaTRKEr180qS6"

def thumb(fid: str, sz: str = "w800") -> str:
    return f"https://drive.google.com/thumbnail?id={fid}&sz={sz}"

BOOKS = [
    # (title, author, year, category, language, pages, rating, featured, cover_url, link, description)
    (
        "Como Hacer Un Viaje Astral",
        "Anónimo",
        None,
        "Manual práctico",
        "es",
        None,
        None,
        0,
        thumb(DOC_ID),
        DOC_LINK,
        "Guía anónima sobre cómo realizar un viaje astral paso a paso.",
    ),
    (
        "El desdoblamiento astral",
        "Desconocido",
        None,
        "Clásico",
        "es",
        None,
        None,
        0,
        thumb(DESDOB_ID),
        DESDOB_LINK,
        "Obra sobre el desdoblamiento astral. ISBN 8495720124.",
    ),
    (
        "La otra realidad Conversaciones con Elam",
        "Iván Guevara",
        2020,
        "Investigación",
        "es",
        154,
        None,
        1,
        thumb(ELAM_ID),
        ELAM_LINK,
        "Conversaciones con Elam sobre el desdoblamiento astral y la otra realidad. "
        "Independient published, 2020.",
    ),
]


def build() -> None:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    try:
        conn.executescript(SCHEMA)
        conn.executemany(
            """INSERT INTO books
               (title, author, year, category, language, pages, rating,
                featured, cover_url, link, description)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            BOOKS,
        )
        conn.commit()
        print(f"✔ Base de datos creada: {DB_PATH}")
        print(f"  Libros insertados: {conn.execute('SELECT COUNT(*) FROM books').fetchone()[0]}")
    finally:
        conn.close()


if __name__ == "__main__":
    build()