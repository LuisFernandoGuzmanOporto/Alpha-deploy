import { useMemo } from "react";
import { useLang } from "../i18n";
import { useData, type DataState } from "../lib/data";
import { localizeData } from "./localized-data";

/** Datos originales cargados por el frontend, con textos de presentación en el idioma elegido. */
export function useLocalizedData(): DataState {
  const state = useData();
  const { lang } = useLang();
  return useMemo(() => state.status === "ready"
    ? { ...state, data: localizeData(state.data, lang) }
    : state, [state, lang]);
}
