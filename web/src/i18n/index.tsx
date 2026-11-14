import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { en, tagsEn, variablesEn, type Content } from "../content/en";
import { es, tags as tagsEs, variables as variablesEs } from "../content/es";
import type { Tag, VariableId } from "../types";
import { makeT, type Lang, type Translate } from "./messages";

export type { Lang, MessageKey, Translate } from "./messages";

const STORAGE_KEY = "earth-analogs-lang";
export const LANGS: readonly Lang[] = ["es", "en"];

function isLang(value: unknown): value is Lang {
  return value === "es" || value === "en";
}

/**
 * Idioma inicial: `?lang=` de la URL (para compartir un enlace en un idioma), luego la
 * elección guardada y, si no hay ninguna, el idioma del navegador (español si empieza por "es").
 */
export function detectLang(): Lang {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    if (isLang(fromUrl)) return fromUrl;
  } catch {
    // sin window.location: se sigue con el resto
  }
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLang(stored)) return stored;
  } catch {
    // el almacenamiento puede estar bloqueado: la página funciona igual
  }
  return typeof navigator !== "undefined" && navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
}

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const LanguageContext = createContext<LanguageContextValue>({ lang: "es", setLang: () => undefined });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang: (next) => {
        setLangState(next);
        try {
          window.localStorage.setItem(STORAGE_KEY, next);
        } catch {
          // no pasa nada si no se puede guardar
        }
      },
    }),
    [lang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang(): LanguageContextValue {
  return useContext(LanguageContext);
}

/** Traductor de los textos de la interfaz en el idioma actual. */
export function useT(): Translate {
  const { lang } = useLang();
  return useMemo(() => makeT(lang), [lang]);
}

export interface LocalizedContent {
  ui: Content;
  tags: Record<Tag, { label: string; description: string; icon: string }>;
  variables: Record<VariableId, { label: string; unit: string; description: string }>;
}

/** Textos de Noe (`content/`) en el idioma actual. */
export function useContent(): LocalizedContent {
  const { lang } = useLang();
  return lang === "en" ? { ui: en, tags: tagsEn, variables: variablesEn } : { ui: es, tags: tagsEs, variables: variablesEs };
}
