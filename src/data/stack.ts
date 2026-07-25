/** Stack técnico agrupado por categoría. */

export interface GrupoStack {
  categoria: string;
  items: string[];
}

export const stack: GrupoStack[] = [
  {
    categoria: 'Lenguajes',
    items: ['Python', 'Go', 'JavaScript'],
  },
  {
    categoria: 'Backend y APIs',
    items: ['FastAPI', 'Django', 'APIs REST'],
  },
  {
    categoria: 'Bases de datos',
    items: ['PostgreSQL', 'MariaDB', 'SQLite'],
  },
  {
    categoria: 'Fabricantes',
    items: ['Mikrotik', 'Cisco', 'Juniper'],
  },
  {
    categoria: 'Redes y operaciones',
    items: ['SSH masivo', 'OSPF', 'Firewalls', 'Routers y switches', 'Zabbix'],
  },
  {
    categoria: 'Frontend',
    items: ['HTML', 'CSS'],
  },
  {
    categoria: 'IA y herramientas',
    items: ['Claude Code', 'Opencode', 'Agentes de IA', 'Git'],
  },
];

/** Los tres bloques de especialidad del inicio de la página. */
export const especialidades = [
  {
    titulo: 'Automatización de redes',
    descripcion:
      'Conexión masiva por SSH, extracción de información, configuración reproducible sobre parques completos y monitoreo que se mantiene solo.',
    items: ['Python', 'SSH concurrente', 'Mikrotik', 'Cisco', 'Juniper', 'Zabbix'],
  },
  {
    titulo: 'Backend y APIs',
    descripcion:
      'Servicios y bases de datos que convierten información dispersa en algo consultable: del modelado del esquema al endpoint en producción.',
    items: ['FastAPI', 'Django', 'PostgreSQL', 'Go'],
  },
  {
    titulo: 'Agentes de IA',
    descripcion:
      'Integración de modelos de lenguaje en flujos de operación reales, con acceso a herramientas y datos internos en lugar de demos aisladas.',
    items: ['LLMs', 'Claude Code', 'Opencode', 'Automatización'],
  },
] as const;
