/**
 * Juegos más jugados en Steam.
 *
 * Para añadir uno: abre su ficha en Steam y coge el número de la URL —
 * https://store.steampowered.com/app/730/CounterStrike_2/  →  appid 730.
 * La portada se descarga sola desde el CDN de Steam a partir del appid.
 *
 * `horas` es opcional y de texto libre ('1.240 h', '+500 h'). Si se omite,
 * simplemente no se muestra. Si el array queda vacío, la sección desaparece.
 */

export interface Juego {
  appid: number;
  nombre: string;
  horas?: string;
}

export const juegos: Juego[] = [
  { appid: 730, nombre: 'Counter-Strike 2' },
  { appid: 2073850, nombre: 'THE FINALS' },
  { appid: 633230, nombre: 'Naruto to Boruto: Shinobi Striker' },
];

/** Portada vertical del juego, servida por el CDN de Steam. */
export function portada(appid: number): string {
  return `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/library_600x900.jpg`;
}

export function fichaSteam(appid: number): string {
  return `https://store.steampowered.com/app/${appid}/`;
}
