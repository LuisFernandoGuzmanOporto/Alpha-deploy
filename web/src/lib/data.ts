import { useEffect, useMemo, useState } from "react";
import { useLang } from "../i18n";
import type { MessageKey, Translate, TranslateParams } from "../i18n/messages";
import type { Candidate, Ficha, Results, Site } from "../types";
import { indexFichas } from "./fichas";
import { loadDataEn, localizeData, type DataEn } from "./localize";

export interface AppData {
  sites: Site[];
  candidates: Candidate[];
  results: Results;
  /** Fichas publicables por `candidate_id`; vacío si todavía no existe `fichas.json`. */
  fichas: Record<string, Ficha>;
}

/** Error de carga con un mensaje traducible (la clave y sus parámetros, no el texto). */
export class LoadError extends Error {
  constructor(
    readonly key: MessageKey,
    readonly params?: TranslateParams,
  ) {
    super(key);
  }
}

export type DataState =
  | { status: "loading" }
  | { status: "error"; error: unknown }
  | { status: "ready"; data: AppData };

/** Texto del error de carga en el idioma actual. */
export function loadErrorText(t: Translate, error: unknown): string {
  const detail =
    error instanceof LoadError ? t(error.key, error.params) : error instanceof Error ? error.message : t("error.unknown");
  return t("error.load", { message: detail });
}

async function fetchJson<T>(file: string): Promise<T> {
  const url = `${import.meta.env.BASE_URL}data/${file}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new LoadError("error.http", { file, status: response.status });
  }
  try {
    return (await response.json()) as T;
  } catch {
    throw new LoadError("error.json", { file });
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
    throw new LoadError("error.json", { file: "fichas.json" });
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
    throw new LoadError("error.lists");
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
        if (active) setState({ status: "error", error });
      },
    );
    return () => {
      active = false;
    };
  }, []);

  // Los textos en inglés de los datos se piden en paralelo con los JSON y solo si el idioma es inglés.
  const { lang } = useLang();
  const [dataEn, setDataEn] = useState<DataEn | null>(null);
  const [dataEnError, setDataEnError] = useState<unknown>(null);
  useEffect(() => {
    if (lang !== "en" || dataEn) return;
    let active = true;
    loadDataEn().then(
      (module) => active && setDataEn(module),
      (error: unknown) => active && setDataEnError(error),
    );
    return () => {
      active = false;
    };
  }, [lang, dataEn]);

  return useMemo<DataState>(() => {
    if (state.status !== "ready") return state;
    if (lang === "en" && !dataEn) {
      return dataEnError ? { status: "error", error: dataEnError } : { status: "loading" };
    }
    return { status: "ready", data: localizeData(state.data, lang, dataEn) };
  }, [state, lang, dataEn, dataEnError]);
}
