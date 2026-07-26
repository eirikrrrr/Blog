/**
 * Sección «Fuera del trabajo»: aficiones y rastro público en internet.
 *
 * Los perfiles con `url: null` NO se renderizan, así que el sitio nunca
 * publica un enlace roto. Rellena la URL y la tarjeta aparece sola.
 */

export interface Perfil {
  red: string;
  /** Lo que se ve en pantalla: usuario, nombre de perfil, etc. */
  handle: string;
  url: string | null;
  /** `false` para mostrar el dato sin convertirlo en enlace (p. ej. Discord). */
  enlazable?: boolean;
}

export const aficiones: string[] = [
  'Videojuegos',
  'Música',
  'Cacharrear con hardware',
  'Leer sobre arquitectura de computadores',
];

export const perfiles: Perfil[] = [
  {
    red: 'GitHub',
    handle: 'eirikrrrr',
    url: 'https://github.com/eirikrrrr',
  },
  {
    red: 'LinkedIn',
    handle: 'Erick Alejandro Graterol',
    url: 'https://www.linkedin.com/in/erick-alejandro-graterol-14a962266/',
  },
  {
    red: 'Steam',
    handle: 'ErickOfRebellion',
    url: 'https://steamcommunity.com/id/ErickOfRebellion/',
  },
  {
    red: 'Discord',
    handle: 'ErickOfRebellion',
    url: 'https://discord.com/users/1094633842020716635',
  },
  {
    red: 'Spotify',
    handle: 'eirikrrrr',
    url: 'https://open.spotify.com/user/31tiue63gkbniknuiaukiubtncdy',
  },
];

export const introIntereses =
  'Contratar a alguien que no conoces es un acto de fe. Aquí está el resto de mi rastro público, por si ayuda a que sea un poco menos así.';
