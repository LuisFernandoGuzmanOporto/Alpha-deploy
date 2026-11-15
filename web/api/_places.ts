// Lógica pura de la función /api/place-photos (sin red), separada para probarla.

/** Lugar devuelto por Places API (New) con la máscara de campos que pedimos. */
export interface GooglePlace {
  id: string;
  location?: { latitude: number; longitude: number };
  googleMapsUri?: string;
  photos?: GooglePhoto[];
}

export interface GooglePhoto {
  /** Recurso de la foto (`places/<id>/photos/<ref>`). No se guarda: solo sirve para pedir la imagen ahora. */
  name: string;
  widthPx: number;
  heightPx: number;
  authorAttributions?: { displayName?: string; uri?: string }[];
}

/** Radio máximo entre el lugar de Google y las coordenadas del candidato (la ventana del índice). */
export const MAX_DISTANCE_KM = 10;

export function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const rad = Math.PI / 180;
  const a =
    Math.sin(((lat2 - lat1) * rad) / 2) ** 2 +
    Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(((lon2 - lon1) * rad) / 2) ** 2;
  return 6371.0088 * 2 * Math.asin(Math.sqrt(a));
}

/**
 * Verificación: se acepta el primer resultado con fotos que esté a menos de 10 km del candidato.
 * Un homónimo en otro lugar (otra "Laguna Verde") se descarta aunque Google lo devuelva primero.
 */
export function pickPlace(places: GooglePlace[], lat: number, lon: number): GooglePlace | null {
  for (const place of places) {
    if (!place.location || !place.photos?.length) continue;
    if (distanceKm(lat, lon, place.location.latitude, place.location.longitude) <= MAX_DISTANCE_KM) return place;
  }
  return null;
}

/** Los ids de candidato son minúsculas, dígitos y guiones: cualquier otra cosa se rechaza sin llamar a Google. */
export function isCandidateId(value: string | null): value is string {
  return value !== null && /^[a-z0-9-]{3,80}$/.test(value);
}
