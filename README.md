# eirikrrrr.github.io

Sitio personal de **Erick Alejandro Graterol** — Network Automation & AI Engineer.
Landing, currículum en HTML y PDF, y fichas técnicas de proyectos.

🌐 https://eirikrrrr.github.io

## Stack

- **[Astro 7](https://astro.build)** — sitio estático, cero JavaScript en el cliente.
- **[Tailwind CSS 4](https://tailwindcss.com)** — vía `@tailwindcss/vite`.
- **TypeScript** — todo el contenido está tipado en `src/data/`.
- **Playwright** — imprime el CV en PDF durante el despliegue.

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:4321
```

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Genera el sitio estático en `dist/` |
| `npm run pdf` | Imprime `dist/cv-erick-graterol.pdf` desde la página `/cv` |
| `npm run sitio` | `build` + `pdf` — la cadena completa, igual que en CI |
| `npm run check` | Comprobación de tipos y plantillas |
| `npm run imagenes` | Regenera `og-image.png` y `apple-touch-icon.png` |

Para `npm run pdf` en local hace falta el navegador de Playwright una única vez:

```bash
npx playwright install chromium
```

## Editar el contenido

Todo el texto vive en `src/data/`. No hace falta tocar los componentes:

| Archivo | Contenido |
|---|---|
| `perfil.ts` | Nombre, rol, presentación, contacto, ubicación, SEO |
| `experiencia.ts` | Puestos, fechas, logros y métricas del hero |
| `proyectos.ts` | Casos técnicos — cada uno genera su página en `/proyectos/[slug]` |
| `stack.ts` | Stack técnico y los tres bloques de especialidad |
| `intereses.ts` | Aficiones y perfiles públicos (Steam, Discord, Spotify…) |

La web y el PDF leen de los mismos archivos, así que **no pueden desincronizarse**.

## Estructura

```
src/
  assets/       Imágenes procesadas por Astro (optimización automática)
  components/   Componentes .astro de cada sección
  data/         El contenido (ver tabla de arriba)
  layouts/      Base.astro — SEO, Open Graph y JSON-LD
  lib/          jsonld.ts — datos estructurados schema.org
  pages/        index · cv · 404 · proyectos/[slug]
  styles/       global.css — tokens de diseño y hoja de impresión
public/         Fuentes, favicon, robots.txt, llms.txt, foto, imagen OG
scripts/        Generación del PDF y de las imágenes
```

## SEO

- Datos estructurados `Person`, `WebSite`, `ProfilePage`, `CreativeWork` y `BreadcrumbList`.
- `sitemap-index.xml` generado en cada build, `robots.txt`, canonicals y `llms.txt`.
- Open Graph y Twitter Card con imagen propia de 1200×630.
- Sin JavaScript en el cliente, CSS crítico incrustado y tipografías autoalojadas.

Tras el primer despliegue, dar de alta el sitio en
[Google Search Console](https://search.google.com/search-console) y
[Bing Webmaster Tools](https://www.bing.com/webmasters), y enviar el sitemap.

## Despliegue

Automático en cada `push` a `main` mediante GitHub Actions
(`.github/workflows/deploy.yml`): comprueba tipos, construye, imprime el PDF y publica.

Requisito único en el repositorio: **Settings → Pages → Source: GitHub Actions**.

## Notas

- Las tipografías (`public/fonts/`) son el subconjunto latino de
  [Fontsource](https://fontsource.org) — Inter Variable y JetBrains Mono Variable —
  copiadas al repositorio para servirlas desde el propio dominio.
- La imagen Open Graph se compone con Liberation Sans, la grotesca disponible en el
  sistema. Si se instala Inter en el sistema, `npm run imagenes` la usará.
