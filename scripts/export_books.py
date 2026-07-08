"""Exporta data/books.db a assets/books.js (array JS con los enlaces ya hardcodeados).

La SPA carga assets/books.js, que define `window.__BOOKS__`.
Ejecutar:
    uv run python scripts/export_books.py
"""
from __future__ import annotations

import json
import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / "data" / "books.db"
OUT_PATH = ROOT / "assets" / "books.js"


def fetch_books() -> list[dict]:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        rows = conn.execute(
            """SELECT id, title, author, year, category, language, pages,
                      rating, featured, cover_url AS cover, link, description
               FROM books
               ORDER BY featured DESC, rating DESC, year ASC"""
        ).fetchall()
        return [
            {
                **dict(r),
                "rating": round(r["rating"], 2) if r["rating"] is not None else None,
                "featured": bool(r["featured"]),
            }
            for r in rows
        ]
    finally:
        conn.close()


def build() -> None:
    if not DB_PATH.exists():
        raise SystemExit(
            f"✘ No existe {DB_PATH}. Ejecuta primero: uv run python scripts/seed_books.py"
        )

    books = fetch_books()
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    # JSON válida embebida: ningún riesgo de cierre de <script>.
    payload = json.dumps(books, ensure_ascii=False, indent=2)
    header = "// Generado por scripts/export_books.py — NO EDITAR A MANO.\n"
    OUT_PATH.write_text(
        f"{header}// Edita data/books.db y vuelve a ejecutar el export.\n"
        f"window.__BOOKS__ = {payload};\n",
        encoding="utf-8",
    )
    print(f"✔ Exportados {len(books)} libros → {OUT_PATH}")


if __name__ == "__main__":
    build()