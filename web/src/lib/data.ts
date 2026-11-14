import { useEffect, useState } from "react";
import type { Candidate, Ficha, Results, Site } from "../types";
import { indexFichas } from "./fichas";

export interface AppData {
  sites: Site[];
  candidates: Candidate[];
  results: Results;
  /** Fichas publicables por `candidate_id`; vacío si todavía no existe `fichas.json`. */
  fichas: Record<string, Ficha>;
}

export type DataState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: AppData };

async function fetchJson<T>(file: string): Promise<T> {
  const url = `${import.meta.env.BASE_URL}data/${file}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`No se pudo cargar ${file} (HTTP ${response.status})`);
  }
  try {
    return (await response.json()) as T;
  } catch {
    throw new Error(`${file} no es un JSON válido`);
  }
}

/** `fichas.json` es opcional: si no existe (404, o el servidor devuelve la página HTML) no hay fichas. */
async function fetchFichas(): Promise<Record<string, Ficha>> {
  const response = await fetch(`${import.meta.env.BASE_URL}data/fichas.json`);
  const isHtml = response.headers.get("content-type")?.includes("text/html") ?? false;
  if (!response.ok || isHtml) return {};
  try {
    return indexFichas(await response.json());
  } catch {
    throw new Error("fichas.json no es un JSON válido");
  }
}

export async function loadData(): Promise<AppData> {
  const [sites, candidates, results, fichas] = await Promise.all([
    fetchJson<Site[]>("sites.json"),
    fetchJson<Candidate[]>("candidates.json"),
    fetchJson<Results>("results.json"),
    fetchFichas(),
  ]);
  if (!Array.isArray(sites) || !Array.isArray(candidates)) {
    throw new Error("sites.json y candidates.json deben ser listas");
  }
  return { sites, candidates, results, fichas };
}

let cached: Promise<AppData> | null = null;

/** Carga los JSON estáticos una sola vez y comparte el resultado entre componentes. */
export function useData(): DataState {
  const [state, setState] = useState<DataState>({ status: "loading" });

  useEffect(() => {
    let active = true;
    cached ??= loadData();
    cached.then(
      (data) => active && setState({ status: "ready", data }),
      (error: unknown) => {
        cached = null;
        if (active) {
          setState({
            status: "error",
            message: error instanceof Error ? error.message : "Error desconocido",
          });
        }
      },
    );
    return () => {
      active = false;
    };
  }, []);

  return state;
}
