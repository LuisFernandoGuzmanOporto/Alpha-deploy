// Fotografías reales de los lugares de la Tierra, con prioridad de fuentes:
//   1. Google Places (Place Photos), solo si el despliegue tiene la función `/api/place-photos`
//      configurada (VITE_PLACES_API=1 y GOOGLE_PLACES_API_KEY en el servidor).
//   2. Wikimedia Commons: `data/photos.json`, generado por `pipeline/tools/fetch_photos.py` con fotos
//      geoetiquetadas a menos de 10 km del lugar.
//   3. Ilustración de la categoría del lugar, presentada como ilustración y nunca como foto.
import { useEffect, useState } from "react";
import type { Candidate, Tag } from "../types";

export interface Photo {
  /** Miniatura (unos 500 px de ancho). */
  thumb: string;
  /** Versión grande para la galería ampliada. */
  large: string;
  title: string;
  author: string;
  /** Enlace al perfil del autor (Google) o a la página del archivo (Commons). */
  page: string;
  license: string;
  license_url?: string;
  width: number;
  height: number;
  /** Distancia en km entre la foto y las coordenadas del lugar, cuando se conoce. */
  distance_km?: number;
}

export type PhotoSource = "google" | "commons";

export type PhotoState =
  | { status: "loading" }
  | { status: "ready"; source: PhotoSource; photos: Photo[] }
  | { status: "empty"; reason: "none" | "unidentified" | "offline" | "error" };

interface PhotosFile {
  places: Record<string, Photo[]>;
}

let commonsPromise: Promise<Record<string, Photo[]>> | null = null;

/** `photos.json` se pide una sola vez y solo cuando alguien necesita una foto. */
export function loadCommonsPhotos(): Promise<Record<string, Photo[]>> {
  commonsPromise ??= fetch(`${import.meta.env.BASE_URL}data/photos.json`)
    .then((response) => {
      const isHtml = response.headers.get("content-type")?.includes("text/html") ?? false;
      if (!response.ok || isHtml) return {};
      return (response.json() as Promise<PhotosFile>).then((file) => file.places ?? {});
    })
    .catch((error: unknown) => {
      commonsPromise = null; // se reintenta en la próxima apertura (por ejemplo, al volver la conexión)
      throw error;
    });
  return commonsPromise;
}

const googleEnabled = import.meta.env.VITE_PLACES_API === "1";
/** Una sola petición en curso por lugar (evita duplicadas al pasar el cursor y abrir la tarjeta). */
const googleInFlight = new Map<string, Promise<Photo[] | null>>();

function loadGooglePhotos(candidateId: string): Promise<Photo[] | null> {
  if (!googleEnabled) return Promise.resolve(null);
  let request = googleInFlight.get(candidateId);
  if (!request) {
    request = fetch(`/api/place-photos?id=${encodeURIComponent(candidateId)}`)
      .then(async (response) => {
        if (!response.ok) return null;
        const body = (await response.json()) as { photos?: Photo[] };
        return body.photos && body.photos.length > 0 ? body.photos : null;
      })
      .catch(() => null);
    googleInFlight.set(candidateId, request);
  }
  return request;
}

/** Resuelve las fotos de un lugar siguiendo la prioridad de fuentes. */
export async function resolvePhotos(candidateId: string): Promise<PhotoState> {
  const google = await loadGooglePhotos(candidateId);
  if (google) return { status: "ready", source: "google", photos: google };
  try {
    const commons = (await loadCommonsPhotos())[candidateId];
    if (commons && commons.length > 0) return { status: "ready", source: "commons", photos: commons };
    return { status: "empty", reason: "none" };
  } catch {
    return { status: "empty", reason: typeof navigator !== "undefined" && navigator.onLine === false ? "offline" : "error" };
  }
}

/** Fotos de un lugar para un componente; `null` = lugar no identificado (sin id o sin coordenadas). */
export function usePlacePhotos(candidate: Pick<Candidate, "id" | "lat" | "lon"> | null): PhotoState {
  const [state, setState] = useState<PhotoState>({ status: "loading" });
  const id = candidate?.id ?? null;
  const located = candidate !== null && candidate.lat !== null && candidate.lon !== null;
  useEffect(() => {
    if (!id || !located) {
      setState({ status: "empty", reason: "unidentified" });
      return;
    }
    let active = true;
    setState({ status: "loading" });
    void resolvePhotos(id).then((next) => active && setState(next));
    return () => {
      active = false;
    };
  }, [id, located]);
  return state;
}

export type PlaceCategory = "ice" | "cave" | "volcanic" | "salt" | "desert" | "crater" | "terrain";

const CATEGORY_TAGS: [PlaceCategory, Tag[]][] = [
  ["ice", ["polar-ice", "glacier", "permafrost", "extreme-cold"]],
  ["cave", ["lava-tubes", "caves"]],
  ["volcanic", ["volcanic-field", "basalt"]],
  ["crater", ["impact-crater"]],
  ["salt", ["evaporite"]],
  ["desert", ["aeolian-dunes", "hyper-arid", "dust-activity"]],
];

export const CATEGORIES: PlaceCategory[] = ["desert", "salt", "volcanic", "cave", "ice", "crater", "terrain"];

/** Categoría principal del lugar a partir de sus etiquetas (la primera que aplique en este orden). */
export function placeCategory(tags: readonly Tag[]): PlaceCategory {
  for (const [category, list] of CATEGORY_TAGS) {
    if (tags.some((tag) => list.includes(tag))) return category;
  }
  return "terrain";
}
