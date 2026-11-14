import { useEffect, useState } from "react";
import type { Candidate, Results, Site } from "../types";

export interface AppData {
  sites: Site[];
  candidates: Candidate[];
  results: Results;
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

export async function loadData(): Promise<AppData> {
  const [sites, candidates, results] = await Promise.all([
    fetchJson<Site[]>("sites.json"),
    fetchJson<Candidate[]>("candidates.json"),
    fetchJson<Results>("results.json"),
  ]);
  if (!Array.isArray(sites) || !Array.isArray(candidates)) {
    throw new Error("sites.json y candidates.json deben ser listas");
  }
  return { sites, candidates, results };
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
