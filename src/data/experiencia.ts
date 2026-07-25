/**
 * Trayectoria profesional, de más reciente a más antigua.
 *
 * ⚠️ REVISAR: los años son una inferencia a partir de las duraciones que
 * indicaste (2 años configurando + 2 años programando). Ajusta `periodo` y
 * `desde`/`hasta` a las fechas reales; es el único sitio donde hay que tocarlos.
 */

export interface Puesto {
  cargo: string;
  empresa: string;
  ubicacion: string;
  periodo: string;
  desde: string; // ISO, para el JSON-LD
  hasta: string | null; // null = actualidad
  resumen: string;
  logros: string[];
  tecnologias: string[];
}

export const experiencia: Puesto[] = [
  {
    cargo: 'Desarrollador de Automatizaciones Internas',
    empresa: 'Somos Networking S.A',
    ubicacion: 'Remoto',
    periodo: '2025 — Actualidad',
    desde: '2025-01',
    hasta: null,
    resumen:
      'Construir el tooling que automatiza el trabajo que antes hacía a mano el equipo de red.',
    logros: [
      'Desarrollo de un motor de conexión concurrente capaz de operar sobre más de 10.000 dispositivos de red por SSH en una sola ejecución.',
      'Diseño e implementación de la base de datos y la API de inventario de red, convirtiendo información dispersa en una fuente única consultable.',
      'Automatización de la generación de mapas topológicos en Zabbix, eliminando el dibujado manual del canvas.',
      'Scripts de configuración masiva que aplican cambios sobre parques completos de equipos de forma reproducible.',
    ],
    tecnologias: ['Python', 'SSH', 'FastAPI', 'PostgreSQL', 'Zabbix', 'Go'],
  },
  {
    cargo: 'Desarrollador Freelance',
    empresa: 'Clientes independientes',
    ubicacion: 'Colombia · Remoto',
    periodo: '2024 — 2025 · 1 año',
    desde: '2024-01',
    hasta: '2025-01',
    resumen:
      'Desarrollo de herramientas internas, bots y servicios backend para clientes del sector de telecomunicaciones y redes.',
    logros: [
      'Construcción de APIs y servicios de datos a medida, desde el modelado de la base hasta el despliegue.',
      'Desarrollo de bots de Slack y Discord conectados a sistemas internos de los clientes.',
      'Automatización de tareas de operación que antes se hacían dispositivo por dispositivo.',
      'Trato directo con el cliente: levantamiento de requisitos, entrega e iteración sin intermediarios.',
    ],
    tecnologias: ['Python', 'FastAPI', 'PostgreSQL', 'Go', 'Slack API', 'Discord API'],
  },
  {
    cargo: 'Configurador de dispositivos de red',
    empresa: 'Somos Networking S.A',
    ubicacion: 'Presencial',
    periodo: '2022 — 2024 · 2 años',
    desde: '2022-01',
    hasta: '2024-01',
    resumen:
      'Configuración y administración de infraestructura de red: routers, switches, servidores y equipos de cliente.',
    logros: [
      'Configuración y puesta en marcha de routers, switches, servidores y estaciones de trabajo sobre equipos Mikrotik, Cisco y Juniper.',
      'Implementación y mantenimiento de servicios de firewall y enrutamiento dinámico con OSPF.',
      'Administración y diagnóstico de dispositivos de red en operación.',
      'De esta etapa salió el criterio que hoy aplico al automatizar: sé exactamente qué duele porque lo hice a mano.',
    ],
    tecnologias: ['Mikrotik', 'Cisco', 'Juniper', 'OSPF', 'Firewalls', 'Servidores'],
  },
];

/** Métricas del hero. Ajusta los números si no cuadran. */
export const metricas = [
  { valor: '2', unidad: 'años', etiqueta: 'programando automatización de red' },
  { valor: '+10K', unidad: 'dispositivos', etiqueta: 'gestionados por código' },
  { valor: '+10', unidad: 'servicios', etiqueta: 'en producción' },
] as const;
