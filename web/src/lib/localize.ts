import type * as DataEnModule from "../content/dataEn";
import type { Lang } from "../i18n/messages";
import type { AppData } from "./data";

/** Textos en inglés de los datos (`content/dataEn.ts`), que se cargan aparte solo cuando hacen falta. */
export type DataEn = Pick<
  typeof DataEnModule,
  "CANDIDATE_NAMES_EN" | "CANDIDATE_WHY_EN" | "COUNTRIES_EN" | "FICHAS_EN" | "SITES_EN"
>;

let dataEnPromise: Promise<DataEn> | null = null;

/** Carga `dataEn.ts` (unos 60 KB) una sola vez; en español no se descarga. */
export function loadDataEn(): Promise<DataEn> {
  dataEnPromise ??= import("../content/dataEn").catch((error: unknown) => {
    dataEnPromise = null;
    throw error;
  });
  return dataEnPromise;
}

const WHY_TEMPLATE =
  /^Propuesto por sus valores en este catalogo \((.+)\); no se encontro un estudio previo como analogo planetario\.$/;

const WHY_PARTS: ReadonlyArray<readonly [RegExp, (value: string) => string]> = [
  [/^(-?[\d.]+) mm\/ano de precipitacion$/, (n) => `${n} mm/yr precipitation`],
  [/^(-?[\d.]+) °C de temperatura media de superficie$/, (n) => `${n} °C mean surface temperature`],
  [/^(-?[\d.]+) m de relieve local$/, (n) => `${n} m local relief`],
];

/**
 * Traduce el `why` generado por `build_candidates.py` ("Propuesto por sus valores en este catalogo…").
 * Devuelve `undefined` si el texto no sigue esa plantilla, para que se use el diccionario o el original.
 */
export function translateWhy(why: string): string | undefined {
  const match = WHY_TEMPLATE.exec(why);
  if (!match?.[1]) return undefined;
  const parts: string[] = [];
  for (const part of match[1].split(", ")) {
    const translated = WHY_PARTS.flatMap(([pattern, render]) => {
      const found = pattern.exec(part);
      return found?.[1] ? [render(found[1])] : [];
    })[0];
    if (!translated) return undefined;
    parts.push(translated);
  }
  return `Proposed for its values in this catalog (${parts.join(", ")}); no earlier study as a planetary analog was found.`;
}

/**
 * Textos de los datos (nombres, países, regiones, `why`, notas de los sitios y fichas) en el idioma pedido.
 * Los datos y el contrato no cambian: la traducción es una capa por `id`; lo que no tiene traducción queda como está.
 * Las notas de los candidatos no se traducen: no se muestran y `warnings.ts` busca en ellas "ATENCION".
 */
export function localizeData(data: AppData, lang: Lang, dataEn: DataEn | null): AppData {
  if (lang === "es" || !dataEn) return data;
  const { CANDIDATE_NAMES_EN, CANDIDATE_WHY_EN, COUNTRIES_EN, FICHAS_EN, SITES_EN } = dataEn;
  return {
    ...data,
    sites: data.sites.map((site) => {
      const en = SITES_EN[site.id];
      return en ? { ...site, region: en.region, notes: en.notes } : site;
    }),
    candidates: data.candidates.map((candidate) => ({
      ...candidate,
      name: CANDIDATE_NAMES_EN[candidate.id] ?? candidate.name,
      country: COUNTRIES_EN[candidate.country] ?? candidate.country,
      why: CANDIDATE_WHY_EN[candidate.id] ?? translateWhy(candidate.why) ?? candidate.why,
    })),
    fichas: Object.fromEntries(
      Object.entries(data.fichas).map(([id, ficha]) => {
        const en = FICHAS_EN[id];
        return [id, en ? { ...ficha, ...en } : ficha];
      }),
    ),
  };
}
