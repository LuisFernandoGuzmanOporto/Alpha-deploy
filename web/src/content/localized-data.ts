import type { AppData } from "../lib/data";
import type { Lang } from "../i18n/messages";
import { fichasEn } from "./fichas.en";
import { countriesEn, placeNamesEn, rationaleEn, regionsEn } from "./places.en";
import { referenceTitleEn, scientificTextEn } from "./site-details.en";

/** Copia de presentación: nunca modifica los JSON, el índice ni los campos de control. */
export function localizeData(data: AppData, lang: Lang): AppData {
  if (lang === "es") return data;
  return {
    ...data,
    sites: data.sites.map((site) => ({
      ...site,
      name: placeNamesEn[site.id] ?? site.name,
      region: regionsEn[site.region] ?? site.region,
      notes: scientificTextEn(site.notes),
      sources: Object.fromEntries(Object.entries(site.sources).map(([key, value]) => [key, scientificTextEn(value)])),
    })),
    candidates: data.candidates.map((candidate) => ({
      ...candidate,
      name: placeNamesEn[candidate.id] ?? candidate.name,
      country: countriesEn[candidate.country] ?? candidate.country,
      ...(candidate.region ? { region: regionsEn[candidate.region] ?? candidate.region } : {}),
      why: rationaleEn(candidate.id, candidate.why),
      // `notes` conserva ATENCION: la lógica existente usa esa marca para advertir sesgo.
    })),
    fichas: Object.fromEntries(Object.entries(data.fichas).map(([id, ficha]) => [id, {
      ...ficha,
      ...fichasEn[id],
      references: ficha.references.map((reference) => ({ ...reference, title: referenceTitleEn(reference.title) })),
    }])),
  };
}
