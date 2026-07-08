# Astral · Biblioteca esotérica

Una página web estática (SPA en JavaScript vanilla) que expone una colección curada de libros sobre **viajes astrales y cómo realizarlos**. Diseño editorial esotérico (indigo + oro, starfield animado, portadas procedurales) servido desde GitHub Pages.

🌐 **Sitio**: [eirikrrrr.github.io](https://eirikrrrr.github.io)

## Stack

- **Frontend**: HTML + CSS + JavaScript vanilla (sin frameworks, sin build step).
- **Datos**: SQLite (`data/books.db`) gestionado con `scripts/seed_books.py`.
- **Export**: `scripts/export_books.py` genera `assets/books.js` (array con los enlaces ya hardcodeados) que la SPA carga.
- **Deploy**: GitHub Actions publica `index.html` + `assets/` en GitHub Pages.

## Flujo de edición de libros

### Añadir un libro (recomendado)

```bash
# Modo interactivo: te pregunta título, ISBN, link de Drive, categoría, etc.
uv run python scripts/add_book.py
```

```bash
# Modo directo (un solo comando). Enriquece metadatos desde Open Library con el ISBN:
uv run python scripts/add_book.py "Título del libro" \
    --isbn 1660008069 \
    --link https://drive.google.com/file/d/XXXX/preview \
    --category "Manual práctico"
```

`add_book.py` inserta en `data/books.db` y regenera `assets/books.js` automáticamente.
Si el ISBN no existe en Open Library te pedirá autor/año/páginas a mano.
Si no tiene ISBN, usa `--isbn Anonimo` y se marca como anónimo.

### Regenerar desde cero la semilla

```bash
# Solo si quieres resetear la DB a los 10 libros iniciales:
uv run python scripts/seed_books.py

# Reexportar books.js sin añadir libros:
uv run python scripts/export_books.py
```

> El esquema de la tabla `books` está en `scripts/seed_books.py`.
> Commit `data/books.db` y `assets/books.js`; esta última se regenera en CI antes del deploy.

## Desarrollo local

Simplemente abre `index.html` en tu navegador, o sirve el directorio con cualquier servidor estático (la web no necesita compilación).

```bash
python3 -m http.server 8000
```

## Estructura

```
index.html              # SPA shell
assets/
  styles.css            # Diseño (paleta celestial)
  app.js                # Render, búsqueda, filtros, modal, starfield
  books.js              # Generado — NO editar a mano
data/
  books.db              # SQLite (fuente de verdad)
scripts/
  seed_books.py         # Crea + siembra la DB (reset a los 10 iniciales)
  add_book.py           # CLI/interactivo para añadir libros (enriquece con ISBN)
  export_books.py       # DB → books.js
.github/workflows/
  deploy.yml            # Deploy a GitHub Pages
.mkdocs.yml, docs/      # Blog MkDocs previo (conservado, sin desplegar)
```

## Notas

- Los enlaces dirigen a fuentes públicas (Open Library u otros). Apoya a los autores y a tu librería de confianza.
- El blog MkDocs previo (`docs/`, `mkdocs.yml`) se conserva en el repo pero ya no se despliega.

Hecho con ✦ por eirikrrrr