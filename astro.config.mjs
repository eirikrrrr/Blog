// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Sitio de usuario de GitHub Pages: se sirve desde la raíz del dominio.
export default defineConfig({
  site: 'https://eirikrrrr.github.io',
  base: '/',
  trailingSlash: 'never',
  integrations: [sitemap()],
  build: {
    // `file` genera /cv.html en vez de /cv/index.html: GitHub Pages sirve
    // /cv directamente, sin la redirección 301 a /cv/ que introduce el
    // formato por directorios. Así la URL real coincide con el canonical.
    format: 'file',
    inlineStylesheets: 'always',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
