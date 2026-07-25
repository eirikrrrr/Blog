/**
 * Casos técnicos. Cada uno genera su propia página en /proyectos/[slug],
 * que es donde vive el contenido indexable del sitio.
 *
 * ⚠️ REVISAR: la narrativa está construida a partir de lo que me contaste,
 * pero los detalles de implementación son un borrador razonable, no un
 * dictado tuyo. Corrige lo que no coincida con lo que hiciste de verdad:
 * un hiring manager técnico va a preguntar por esto en la entrevista.
 */

export interface Proyecto {
  slug: string;
  titulo: string;
  tituloCorto: string;
  /** Frase de una línea para la tarjeta de la landing. */
  gancho: string;
  metrica: { valor: string; etiqueta: string };
  problema: string;
  solucion: string[];
  resultado: string[];
  tecnologias: string[];
  /** Meta description propia de la página del proyecto. */
  descripcion: string;
}

export const proyectos: Proyecto[] = [
  {
    slug: 'motor-ssh-masivo',
    titulo: 'Motor de conexión concurrente a más de 10.000 dispositivos de red',
    tituloCorto: 'Motor SSH masivo',
    gancho:
      'Una herramienta que abre miles de sesiones SSH en paralelo, extrae información de cada equipo y aplica configuración de forma reproducible.',
    metrica: { valor: '+10.000', etiqueta: 'dispositivos por ejecución' },
    problema:
      'Consultar el estado de un parque de red grande significaba entrar equipo por equipo. Cualquier pregunta sencilla — qué versión de firmware corre cada router, qué interfaces están caídas, qué equipos siguen con una configuración vieja — se convertía en días de trabajo manual de varias personas. Y cuando la respuesta llegaba, ya estaba desactualizada.',
    solucion: [
      'Construí un motor en Python que abre sesiones SSH concurrentes contra todo el parque en una sola ejecución. El núcleo es un pool de conexiones con un límite de concurrencia configurable: sin ese techo, lanzar diez mil conexiones simultáneas tumba tanto la máquina que ejecuta como los equipos que reciben, así que el paralelismo se ajusta a lo que la red aguanta en vez de a lo que la máquina permite.',
      'La parte que más trabajo dio no fue conectarse, sino fallar bien. En un parque de ese tamaño siempre hay equipos apagados, con credenciales rotadas, detrás de un enlace saturado o que simplemente tardan en responder. Cada conexión tiene su propio timeout y su política de reintentos, y un fallo individual nunca aborta la ejecución completa: el resultado final distingue entre lo que se ejecutó bien, lo que falló y por qué motivo falló cada caso.',
      'Sobre esa capa de transporte monté la extracción de información. La salida de un comando en un equipo de red es texto pensado para que lo lea una persona, no un programa, así que hay una etapa de parseo que la convierte en estructuras de datos consistentes, independientemente del fabricante o de la versión del sistema operativo del equipo.',
      'La misma base sirve para el camino inverso: aplicar configuración. Los scripts de configuración masiva reutilizan el motor para empujar cambios sobre parques completos con plantillas, de forma que el mismo cambio se aplica igual en todas partes y queda registro de dónde se aplicó y dónde no.',
    ],
    resultado: [
      'Consultas que tomaban días de trabajo manual pasaron a resolverse en una sola ejecución desatendida.',
      'Un mismo cambio de configuración se aplica de forma idéntica y reproducible sobre todo el parque.',
      'Cada ejecución deja un informe de éxitos y fallos con la causa, en vez de un «no sé qué pasó con esos equipos».',
      'Se convirtió en la capa base sobre la que se construyeron el inventario y el mapeo de topología.',
    ],
    tecnologias: ['Python', 'SSH', 'Concurrencia', 'Parseo de texto', 'Plantillas de configuración'],
    descripcion:
      'Motor en Python que se conecta por SSH a más de 10.000 dispositivos de red en paralelo para extraer información y aplicar configuración de forma reproducible.',
  },
  {
    slug: 'inventario-red-api',
    titulo: 'Base de datos y API de inventario de red',
    tituloCorto: 'Inventario de red',
    gancho:
      'Convertir el estado real de la red en una base de datos consultable por API, en lugar de hojas de cálculo que nadie actualiza.',
    metrica: { valor: '1', etiqueta: 'fuente de verdad' },
    problema:
      'La información del parque estaba repartida entre hojas de cálculo, documentos y la memoria de quien llevaba más tiempo en el equipo. Cada fuente decía algo distinto y ninguna coincidía del todo con lo que había realmente conectado. Sin un inventario fiable, cualquier automatización que se construyera encima heredaba el error: no puedes automatizar sobre una lista de equipos que no sabes si es correcta.',
    solucion: [
      'Diseñé el modelo de datos partiendo de lo que la red podía responder por sí misma. En vez de un inventario que alguien debe mantener a mano, el esquema recoge lo que el motor de conexión masiva extrae directamente de los equipos: identificación, modelo, versión, interfaces, direccionamiento y relaciones entre dispositivos.',
      'El punto delicado del modelado fue el histórico. Un inventario que solo guarda el estado actual responde «qué hay ahora», pero no «qué cambió desde la semana pasada», que suele ser la pregunta útil cuando algo se rompe. El esquema conserva la evolución de cada equipo en el tiempo en lugar de sobrescribir el estado anterior.',
      'Encima monté una API REST que expone el inventario al resto de herramientas y del equipo. Eso cambió la forma de trabajar: quien necesita saber algo de la red hace una petición en vez de pedirle el archivo a un compañero, y los sistemas que consumen el inventario dejan de depender de exportaciones manuales.',
      'La API se convirtió en la pieza central: el mapeo de topología, los scripts de configuración y las consultas del día a día leen todos del mismo sitio, así que dejaron de existir dos versiones de la verdad.',
    ],
    resultado: [
      'Un inventario que se actualiza desde la propia red, no desde la buena voluntad de quien recuerda editarlo.',
      'Histórico de cambios por equipo, útil para diagnosticar qué se modificó antes de una incidencia.',
      'Acceso programático para el resto de herramientas, que dejaron de mantener sus propias copias.',
      'Base sobre la que se apoyan el resto de automatizaciones del equipo.',
    ],
    tecnologias: ['Python', 'FastAPI', 'PostgreSQL', 'API REST', 'Modelado de datos'],
    descripcion:
      'Diseño de la base de datos y la API REST de inventario de red: una fuente única de verdad alimentada automáticamente desde los propios dispositivos.',
  },
  {
    slug: 'topologia-zabbix',
    titulo: 'Generación automática de mapas topológicos en Zabbix',
    tituloCorto: 'Topología automática en Zabbix',
    gancho:
      'Los mapas de red se dibujaban a mano en el canvas de Zabbix. Ahora se generan solos, ordenados y al día.',
    metrica: { valor: '0', etiqueta: 'dibujado manual' },
    problema:
      'Los mapas de topología de Zabbix se construían arrastrando iconos en el canvas, uno por uno. El proceso era lento, y el problema de fondo era peor: en cuanto la red cambiaba, el mapa quedaba mentiroso. Un mapa desactualizado durante una incidencia no solo no ayuda, hace perder tiempo mirando enlaces que ya no existen.',
    solucion: [
      'Escribí una herramienta que construye los mapas directamente desde el estado real de la red. Toma las relaciones entre dispositivos que ya estaban en el inventario y las traduce a los elementos y enlaces que Zabbix entiende, creando el mapa mediante su API en vez de a mano.',
      'La parte interesante fue la disposición. Volcar los nodos en el canvas sin más produce una maraña ilegible: los mapas de red solo sirven si se entienden de un vistazo. Implementé un posicionamiento que ordena los nodos según la jerarquía de la red, de forma que el resultado se lee de arriba abajo siguiendo la estructura real del parque y no la casualidad del orden de inserción.',
      'Como la generación es automática y reproducible, regenerar el mapa cuesta lo mismo que consultarlo. Eso cambia la naturaleza del artefacto: el mapa deja de ser un documento que se mantiene y pasa a ser una vista derivada del inventario, que por definición nunca se desincroniza.',
    ],
    resultado: [
      'Eliminado el dibujado manual del canvas de Zabbix.',
      'Mapas legibles, con los nodos ordenados según la jerarquía real de la red.',
      'La topología deja de desactualizarse: se regenera desde el inventario cuando hace falta.',
      'Durante una incidencia, el mapa que se mira refleja la red que existe.',
    ],
    tecnologias: ['Python', 'API de Zabbix', 'Algoritmos de disposición', 'Grafos'],
    descripcion:
      'Herramienta que genera automáticamente los mapas topológicos de red en Zabbix, ordenados por jerarquía y siempre sincronizados con el inventario.',
  },
  {
    slug: 'bots-slack-discord',
    titulo: 'Bots de Slack y Discord conectados a sistemas internos',
    tituloCorto: 'Bots de Slack y Discord',
    gancho:
      'Llevar la información y las acciones que vivían en scripts y paneles internos al sitio donde el equipo ya está hablando.',
    metrica: { valor: '2', etiqueta: 'plataformas de chat' },
    problema:
      'Las herramientas internas resolvían el problema técnico pero no el humano: para saber algo había que abrir una terminal, recordar el comando o entrar a un panel que solo unos pocos sabían usar. La información existía pero no circulaba, y las mismas preguntas acababan siempre en las mismas dos o tres personas.',
    solucion: [
      'Construí bots para Slack y para Discord que exponen esas herramientas como comandos de chat. El equipo pregunta en el canal y el bot responde con el dato ya formateado, sin que nadie tenga que aprender la herramienta que hay detrás.',
      'La lógica de negocio no vive en el bot. Los bots son una capa de presentación fina sobre las mismas APIs internas que consume el resto de sistemas: eso evita duplicar reglas en dos sitios y hace que añadir una plataforma de chat nueva sea escribir un adaptador, no reimplementarlo todo.',
      'Las dos plataformas se parecen menos de lo que aparenta. Slack y Discord difieren en el modelo de comandos, en el formato de los mensajes enriquecidos y en los límites de tamaño de respuesta, así que la capa común produce un resultado neutro y cada adaptador lo traduce a lo que su plataforma entiende.',
      'La parte que hay que cuidar es el control de acceso: un bot que ejecuta acciones sobre sistemas internos desde un canal de chat es una superficie de ataque nueva. Las operaciones que solo consultan y las que modifican algo están separadas, y las segundas verifican quién las pide antes de hacer nada.',
    ],
    resultado: [
      'La información interna dejó de estar encerrada en herramientas que solo usaban unas pocas personas.',
      'Consultas rutinarias resueltas en el canal, sin interrumpir a nadie del equipo.',
      'Una sola base de lógica para las dos plataformas: añadir un comando lo añade en ambas.',
      'Acciones sensibles separadas de las consultas y con verificación de quién las solicita.',
    ],
    tecnologias: ['Python', 'Slack API', 'Discord API', 'APIs REST', 'Webhooks'],
    descripcion:
      'Bots de Slack y Discord que exponen herramientas y datos internos como comandos de chat, sobre una capa común de lógica y con control de acceso en las acciones sensibles.',
  },
];

export const proyectosPorSlug = new Map(proyectos.map((p) => [p.slug, p]));
