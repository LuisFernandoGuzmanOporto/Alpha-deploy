import { describe, expect, it } from "vitest";
import candidatesRaw from "../../public/data/candidates.json?raw";
import fichasRaw from "../../public/data/fichas.json?raw";
import resultsRaw from "../../public/data/results.json?raw";
import sitesRaw from "../../public/data/sites.json?raw";
import * as dataEn from "../content/dataEn";
import { tagsEn, variablesEn } from "../content/en";
import { tags as tagsEs, variables as variablesEs } from "../content/es";
import { makeT, type Lang } from "../i18n/messages";
import type { Candidate, Results, Site } from "../types";
import type { AppData } from "./data";
import { EXPLAIN_TOP, explainPair } from "./explain";
import { indexFichas } from "./fichas";
import { localizeData } from "./localize";
import { ordinal } from "./ordinal";

const raw = {
  sites: JSON.parse(sitesRaw) as Site[],
  candidates: JSON.parse(candidatesRaw) as Candidate[],
  results: JSON.parse(resultsRaw) as Results,
  fichas: indexFichas(JSON.parse(fichasRaw)),
} as AppData;

/** Las explicaciones de los 5 mejores pares de cada sitio en un idioma, como las vería la web. */
export function allExplanations(lang: Lang): { pair: string; sentences: string[] }[] {
  const data = localizeData(raw, lang, dataEn);
  const t = makeT(lang);
  const labels = {
    variable: (v: keyof typeof variablesEs) => (lang === "es" ? variablesEs : variablesEn)[v].label,
    tag: (tag: keyof typeof tagsEs) => (lang === "es" ? tagsEs : tagsEn)[tag].label,
    ordinal: (n: number) => ordinal(n, lang),
  };
  return data.sites.flatMap((site) => {
    const entries = data.results.sites[site.id] ?? [];
    return entries.slice(0, EXPLAIN_TOP).map((entry, index) => {
      const candidate = data.candidates.find((c) => c.id === entry.candidate_id)!;
      const sentences = explainPair(site, candidate, entry, index + 1, entries.length, t, labels)!;
      return { pair: `${site.id} / ${candidate.id}`, sentences };
    });
  });
}

describe("explicaciones con plantilla (F7)", () => {
  for (const lang of ["es", "en"] as const) {
    it(`en ${lang}: 30 pares con 3 o 4 frases completas y sin marcadores sin rellenar`, () => {
      const all = allExplanations(lang);
      expect(all).toHaveLength(30);
      for (const { pair, sentences } of all) {
        expect(sentences.length, pair).toBeGreaterThanOrEqual(3);
        expect(sentences.length, pair).toBeLessThanOrEqual(4);
        for (const sentence of sentences) {
          expect(sentence, pair).not.toMatch(/\{|\}|undefined|null|NaN/);
          expect(sentence, pair).toMatch(/\.$/);
        }
      }
    });
  }

  it("fuera del top 5 no hay explicación", () => {
    const site = raw.sites[0]!;
    const entry = raw.results.sites[site.id]![5]!;
    const candidate = raw.candidates.find((c) => c.id === entry.candidate_id)!;
    const labels = { variable: () => "x", tag: () => "y", ordinal: String };
    expect(explainPair(site, candidate, entry, 6, 47, makeT("es"), labels)).toBeNull();
  });

  it("el primero de Jezero se explica con su puesto y su mayor diferencia", () => {
    const first = allExplanations("en").find((e) => e.pair.startsWith("mars-jezero"))!;
    expect(first.sentences[0]).toMatch(/: 1st of 47 places for Crater Jezero, with 82\.1\/100/);
    expect(first.sentences[2]).toMatch(/^The largest difference is in surface temperature/);
  });
});
