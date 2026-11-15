// Función serverless de Vercel: GET /api/place-photos?id=<id de candidato>
//
// Busca el lugar en Google Places API (New) con su nombre y coordenadas, comprueba que el resultado
// esté a menos de 10 km y devuelve hasta 4 fotos con la atribución de su autor.
// La clave (GOOGLE_PLACES_API_KEY) vive solo en el servidor. Solo acepta ids del catálogo, así que
// nadie puede usar la función para hacer búsquedas arbitrarias con nuestra cuota.
// Condiciones de Google: no se guardan los recursos de foto ni las URL (son temporales); solo se
// reutiliza la respuesta en memoria unos minutos para no repetir peticiones.
import { isCandidateId, pickPlace, type GooglePlace } from "./_places";

declare const process: { env: Record<string, string | undefined> };

const MAX_PHOTOS = 4;
const PHOTO_WIDTH = 1280;
const MEMORY_TTL_MS = 10 * 60 * 1000;
const FIELD_MASK = "places.id,places.location,places.googleMapsUri,places.photos";

interface Candidate {
  id: string;
  name: string;
  country: string;
  lat: number | null;
  lon: number | null;
}

interface PhotoOut {
  thumb: string;
  large: string;
  title: string;
  author: string;
  page: string;
  license: string;
  width: number;
  height: number;
}

let catalog: Promise<Candidate[]> | null = null;
const memory = new Map<string, { expires: number; photos: PhotoOut[] }>();

function json(body: unknown, status = 200, cache = "no-store"): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": cache },
  });
}

async function loadCatalog(origin: string): Promise<Candidate[]> {
  catalog ??= fetch(new URL("/data/candidates.json", origin)).then((response) => {
    if (!response.ok) throw new Error(`candidates.json: HTTP ${response.status}`);
    return response.json() as Promise<Candidate[]>;
  });
  return catalog.catch((error: unknown) => {
    catalog = null;
    throw error;
  });
}

async function searchPlace(key: string, candidate: Candidate & { lat: number; lon: number }): Promise<GooglePlace | null> {
  const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: { "content-type": "application/json", "X-Goog-Api-Key": key, "X-Goog-FieldMask": FIELD_MASK },
    body: JSON.stringify({
      textQuery: `${candidate.name}, ${candidate.country}`,
      locationBias: { circle: { center: { latitude: candidate.lat, longitude: candidate.lon }, radius: 10_000 } },
      pageSize: 3,
    }),
  });
  if (!response.ok) throw new Error(`searchText: HTTP ${response.status}`);
  const body = (await response.json()) as { places?: GooglePlace[] };
  return pickPlace(body.places ?? [], candidate.lat, candidate.lon);
}

async function photoUri(key: string, name: string): Promise<string | null> {
  const url = `https://places.googleapis.com/v1/${name}/media?maxWidthPx=${PHOTO_WIDTH}&skipHttpRedirect=true`;
  const response = await fetch(url, { headers: { "X-Goog-Api-Key": key } });
  if (!response.ok) return null;
  const body = (await response.json()) as { photoUri?: string };
  return body.photoUri ?? null;
}

export async function GET(request: Request): Promise<Response> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return json({ error: "not-configured" }, 503);

  const id = new URL(request.url).searchParams.get("id");
  if (!isCandidateId(id)) return json({ error: "bad-id" }, 400);

  const cached = memory.get(id);
  if (cached && cached.expires > Date.now()) return json({ source: "google", photos: cached.photos }, 200, "private, max-age=600");

  try {
    const candidate = (await loadCatalog(new URL(request.url).origin)).find((c) => c.id === id);
    if (!candidate || candidate.lat === null || candidate.lon === null) return json({ error: "unknown-place" }, 404);

    const place = await searchPlace(key, { ...candidate, lat: candidate.lat, lon: candidate.lon });
    if (!place?.photos) return json({ source: "google", photos: [] }, 200, "private, max-age=600");

    const photos: PhotoOut[] = [];
    for (const photo of place.photos.slice(0, MAX_PHOTOS)) {
      const uri = await photoUri(key, photo.name);
      if (!uri) continue;
      const author = photo.authorAttributions?.[0];
      photos.push({
        thumb: uri,
        large: uri,
        title: candidate.name,
        author: author?.displayName ?? "Google Maps",
        page: author?.uri ?? place.googleMapsUri ?? "https://maps.google.com",
        license: "",
        width: photo.widthPx,
        height: photo.heightPx,
      });
    }
    memory.set(id, { expires: Date.now() + MEMORY_TTL_MS, photos });
    return json({ source: "google", photos }, 200, "private, max-age=600");
  } catch {
    return json({ error: "upstream" }, 502);
  }
}
