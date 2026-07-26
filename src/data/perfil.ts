/**
 * Datos personales y de contacto.
 * Este archivo es la única fuente de verdad: lo consumen la landing,
 * el CV y los datos estructurados JSON-LD.
 */

export const perfil = {
  nombre: 'Erick Alejandro Graterol',
  nombreCorto: 'Erick Graterol',
  rol: 'Network Automation & AI Engineer',
  // Aparece bajo el nombre en el hero y en la cabecera del CV.
  subtitulo: 'Automatización de redes · Python · Go · APIs',

  // Una línea. Es lo primero que lee un reclutador.
  claim:
    'Escribo el código que configura, inventaría y monitorea miles de dispositivos de red sin que nadie toque una consola.',

  // Párrafo de presentación (sección «Sobre mí» y resumen del CV).
  presentacion: [
    'Empecé configurando routers, switches y servidores a mano, uno por uno, levantando firewalls y OSPF en una operadora. Después de dos años haciendo eso identifiqué que gran parte del trabajo era repetitivo y aprendí a programar para automatizarlo.',
    'Desde entonces me dedico a eso: construir las herramientas que hacen ese trabajo solas. Código que se conecta a más de diez mil dispositivos a la vez, saca la información que hace falta, la guarda en una base de datos consultable por API y deja la topología dibujada en el monitoreo sin intervención manual. Trabajo sobre todo con Python y Go, y últimamente en agentes de IA aplicados a operaciones de red.',
    'No vengo de la universidad. Todo lo que sé lo aprendí resolviendo problemas de red reales, en producción, con equipos que no podían estar caídos.',
  ],

  // Resumen del CV. Tiene que sostenerse solo, sin el contexto de la web.
  resumenCv: [
    'Desarrollador de automatización de redes. Dos años configurando y administrando routers, switches, servidores, firewalls y OSPF sobre equipos Mikrotik, Cisco y Juniper, y dos años construyendo el software que hace ese trabajo automáticamente.',
    'Especializado en herramientas de operación a gran escala: conexión concurrente por SSH a más de diez mil dispositivos, inventarios de red alimentados desde los propios equipos y expuestos por API, y generación automática de topología en el sistema de monitoreo. Trabajo sobre todo con Python y Go. Autodidacta: todo aprendido resolviendo problemas en producción.',
  ],

  // ── Datos personales ──────────────────────────────────────────
  edad: 23, // ← actualizar cada año
  nacionalidad: 'Venezolana',
  permiso: 'Permiso de residencia y trabajo en España (TIE/NIE)',

  // ── Ubicación y disponibilidad ────────────────────────────────
  ubicacion: 'Alicante, España',
  ubicacionCorta: 'Alicante',
  pais: 'ES',
  disponibilidad: 'Disponible para incorporación',
  modalidad: 'Remoto o híbrido',
  idiomas: [
    { idioma: 'Español', nivel: 'Nativo' },
    { idioma: 'Inglés', nivel: 'B1 — intermedio' },
  ],

  // ── Contacto ──────────────────────────────────────────────────
  email: 'erickgraterolbarico@gmail.com',
  linkedin: 'https://www.linkedin.com/in/erick-alejandro-graterol-14a962266/',
  github: 'https://github.com/eirikrrrr',

  // ── SEO ───────────────────────────────────────────────────────
  sitio: 'https://eirikrrrr.github.io',
  cvPdf: '/cv-erick-graterol.pdf',
  descripcion:
    'Erick Graterol, Network Automation & AI Engineer en Alicante. Automatizo infraestructura de red con Python y Go: SSH masivo, inventarios, APIs y monitoreo sobre Mikrotik, Cisco y Juniper.',

  // Alimenta `knowsAbout` en el JSON-LD: le dice a Google de qué eres experto.
  temas: [
    'Automatización de redes',
    'Python',
    'Go',
    'SSH',
    'FastAPI',
    'Django',
    'PostgreSQL',
    'Zabbix',
    'OSPF',
    'Firewalls',
    'Mikrotik',
    'Cisco',
    'Juniper',
    'APIs REST',
    'Agentes de IA',
  ],
} as const;

export const navegacion = [
  { href: '/#experiencia', texto: 'Experiencia' },
  { href: '/#proyectos', texto: 'Proyectos' },
  { href: '/#stack', texto: 'Stack' },
  { href: '/#sobre-mi', texto: 'Sobre mí' },
  { href: '/#perfiles', texto: 'Perfiles' },
  { href: '/cv', texto: 'CV' },
] as const;
