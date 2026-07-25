/**
 * Genera el CV en PDF a partir de la página /cv ya construida.
 *
 * El PDF y la web salen de la misma fuente de datos, así que no pueden
 * desincronizarse: al cambiar src/data/experiencia.ts, ambos se actualizan.
 *
 * Uso: node scripts/generar-pdf.mjs   (requiere `npm run build` antes)
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright';

const DIST = 'dist';
const PUERTO = 8099;
const SALIDA = 'dist/cv-erick-graterol.pdf';

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.woff2': 'font/woff2',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

// Servidor estático mínimo: solo tiene que vivir lo que dura la impresión.
const servidor = createServer(async (req, res) => {
  try {
    let ruta = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (ruta.endsWith('/')) ruta += 'index.html';
    const archivo = join(DIST, ruta);
    const contenido = await readFile(archivo);
    res.writeHead(200, { 'content-type': TIPOS[extname(archivo)] ?? 'application/octet-stream' });
    res.end(contenido);
  } catch {
    res.writeHead(404).end('no encontrado');
  }
});

await new Promise((listo) => servidor.listen(PUERTO, '127.0.0.1', listo));

const navegador = await chromium.launch();
try {
  const pagina = await navegador.newPage();
  await pagina.goto(`http://127.0.0.1:${PUERTO}/cv.html`, { waitUntil: 'networkidle' });
  // Sin esto se imprime la hoja de pantalla en lugar de la de impresión.
  await pagina.emulateMedia({ media: 'print' });
  await pagina.evaluate(() => document.fonts.ready);

  await pagina.pdf({
    path: SALIDA,
    printBackground: true,
    // Respeta el @page (A4 y márgenes) definido en global.css.
    preferCSSPageSize: true,
    tagged: true, // PDF accesible, legible por lectores de pantalla y ATS
  });
} finally {
  await navegador.close();
  servidor.close();
}

console.log(`Generado: ${SALIDA}`);
