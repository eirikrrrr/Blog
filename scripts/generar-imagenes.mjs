/**
 * Genera las imágenes estáticas del sitio a partir de la foto de perfil:
 *   - public/og-image.png        (1200×630, previsualización al compartir)
 *   - public/apple-touch-icon.png (180×180)
 *
 * Uso: node scripts/generar-imagenes.mjs
 *
 * Nota: el texto se compone con Liberation Sans, la grotesca disponible en el
 * sistema. El sitio usa Inter; si quieres que la imagen coincida exactamente,
 * instala Inter en el sistema antes de ejecutar este script.
 */
import sharp from 'sharp';
import { readFileSync } from 'node:fs';

const NEGRO = '#0a0a0a';
const AMARILLO = '#ffd400';
const SANS = 'Liberation Sans, DejaVu Sans, sans-serif';
const MONO = 'Liberation Mono, DejaVu Sans Mono, monospace';

const foto = 'public/profile-picture.jpg';

// ── Open Graph 1200×630 ───────────────────────────────────────────
const ANCHO = 1200;
const ALTO = 630;
const FOTO = 260;

const fotoRedonda = await sharp(foto)
  .resize(FOTO, FOTO, { fit: 'cover' })
  .composite([
    {
      input: Buffer.from(
        `<svg width="${FOTO}" height="${FOTO}"><rect width="${FOTO}" height="${FOTO}" rx="${FOTO / 2}"/></svg>`,
      ),
      blend: 'dest-in',
    },
  ])
  .png()
  .toBuffer();

const capaTexto = `
<svg width="${ANCHO}" height="${ALTO}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${ANCHO}" height="${ALTO}" fill="${NEGRO}"/>
  <rect x="0" y="0" width="14" height="${ALTO}" fill="${AMARILLO}"/>

  <text x="86" y="180" font-family="${MONO}" font-size="24" letter-spacing="3"
        fill="${AMARILLO}">NETWORK AUTOMATION &amp; AI ENGINEER</text>

  <text x="82" y="286" font-family="${SANS}" font-size="76" font-weight="bold"
        fill="#f5f5f5">Erick Alejandro</text>
  <text x="82" y="372" font-family="${SANS}" font-size="76" font-weight="bold"
        fill="#f5f5f5">Graterol</text>

  <text x="86" y="446" font-family="${SANS}" font-size="30" fill="#a3a3a3">Automatizo redes: +10.000 dispositivos</text>
  <text x="86" y="488" font-family="${SANS}" font-size="30" fill="#a3a3a3">gestionados por código.</text>

  <text x="86" y="562" font-family="${MONO}" font-size="24"
        fill="#6f6f6f">eirikrrrr.github.io</text>
</svg>`;

await sharp(Buffer.from(capaTexto))
  .composite([{ input: fotoRedonda, top: 150, left: ANCHO - FOTO - 90 }])
  .png({ compressionLevel: 9 })
  .toFile('public/og-image.png');

// ── Apple touch icon 180×180 ──────────────────────────────────────
const icono = readFileSync('public/favicon.svg');
await sharp(icono, { density: 400 })
  .resize(180, 180)
  .flatten({ background: NEGRO })
  .png({ compressionLevel: 9 })
  .toFile('public/apple-touch-icon.png');

console.log('Generadas: public/og-image.png y public/apple-touch-icon.png');
