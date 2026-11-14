/** Proyección ortográfica de una esfera vista desde lejos (Snyder 1987, sección 20). */

export interface View {
  /** Latitud del centro de la vista, en grados. */
  lat: number;
  /** Longitud del centro de la vista, en grados. */
  lon: number;
}

/** Punto en el disco unitario: x a la derecha, y hacia arriba. */
export interface DiskPoint {
  x: number;
  y: number;
}

const RAD = Math.PI / 180;

/** Longitud llevada al intervalo [-180, 180). Acepta longitudes de 0 a 360. */
export function wrapLon(lon: number): number {
  return ((((lon + 180) % 360) + 360) % 360) - 180;
}

/** Latitud limitada a [-90, 90]. */
export function clampLat(lat: number): number {
  return Math.max(-90, Math.min(90, lat));
}

/** Proyecta (lat, lon) al disco; `null` si el punto queda del otro lado de la esfera. */
export function project(lat: number, lon: number, view: View): DiskPoint | null {
  const phi = lat * RAD;
  const phi0 = view.lat * RAD;
  const dLambda = (lon - view.lon) * RAD;
  const cosC = Math.sin(phi0) * Math.sin(phi) + Math.cos(phi0) * Math.cos(phi) * Math.cos(dLambda);
  if (cosC < 0) return null;
  return {
    x: Math.cos(phi) * Math.sin(dLambda),
    y: Math.cos(phi0) * Math.sin(phi) - Math.sin(phi0) * Math.cos(phi) * Math.cos(dLambda),
  };
}

/** Punto del disco a (lat, lon) en grados; `null` fuera del disco. */
export function unproject(point: DiskPoint, view: View): { lat: number; lon: number } | null {
  const rho2 = point.x * point.x + point.y * point.y;
  if (rho2 > 1) return null;
  const cosC = Math.sqrt(1 - rho2);
  const sinPhi0 = Math.sin(view.lat * RAD);
  const cosPhi0 = Math.cos(view.lat * RAD);
  const lat = Math.asin(Math.max(-1, Math.min(1, cosC * sinPhi0 + point.y * cosPhi0))) / RAD;
  const lon = view.lon + Math.atan2(point.x, cosC * cosPhi0 - point.y * sinPhi0) / RAD;
  return { lat, lon: wrapLon(lon) };
}
