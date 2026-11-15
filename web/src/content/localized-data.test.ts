import { describe, expect, it } from "vitest";
import type { AppData } from "../lib/data";
import { indexFichas } from "../lib/fichas";
import { hasClimateBias } from "../lib/warnings";
import { buildRanking } from "../lib/ranking";
import { localizeData } from "./localized-data";
import { countriesEn, placeNamesEn, regionsEn } from "./places.en";
import { fichasEn } from "./fichas.en";
import methodologyEn from "./methodology.en.md?raw";
import methodologyEs from "../../../docs/METODOLOGIA.md?raw";
import sitesRaw from "../../public/data/sites.json?raw";
import candidatesRaw from "../../public/data/candidates.json?raw";
import resultsRaw from "../../public/data/results.json?raw";
import fichasRaw from "../../public/data/fichas.json?raw";

const original: AppData = { sites: JSON.parse(sitesRaw), candidates: JSON.parse(candidatesRaw), results: JSON.parse(resultsRaw), fichas: indexFichas(JSON.parse(fichasRaw)) };
const en = localizeData(original, "en");
const urls = (text: string) => text.match(/https?:\/\/[^\s)]+/g) ?? [];
const numbers = (text: string) => (text.replace(/(\d)\s+(?=\d{3}\b)/g, "$1").match(/[−-]?\d+(?:[.,]\d+)*/g) ?? []).map((n) => n.replaceAll(",", "."));

describe("contenido bilingüe de presentación", () => {
  it("cubre todos los sitios, candidatos, países, regiones y fichas publicados", () => {
    for (const site of original.sites) {
      expect(placeNamesEn[site.id], site.id).toBeTruthy();
      expect(regionsEn[site.region], site.region).toBeTruthy();
    }
    for (const candidate of original.candidates) {
      expect(placeNamesEn[candidate.id], candidate.id).toBeTruthy();
      expect(countriesEn[candidate.country], candidate.country).toBeTruthy();
    }
    for (const id of Object.keys(original.fichas)) expect(fichasEn[id], id).toBeTruthy();
  });

  it("no muta originales ni cambia índices, coordenadas, variables, etiquetas o clasificación", () => {
    const before = structuredClone(original);
    expect(localizeData(original, "es")).toBe(original);
    expect(en.results).toBe(original.results);
    for (const [i, site] of en.sites.entries()) {
      const source = original.sites[i]!;
      for (const key of ["id", "body", "lat", "lon", "variables", "tags"] as const) expect(site[key]).toEqual(source[key]);
    }
    for (const [i, candidate] of en.candidates.entries()) {
      const source = original.candidates[i]!;
      for (const key of ["id", "body", "lat", "lon", "variables", "tags", "known", "is_bolivia", "analog_for", "notes", "sources", "reference_urls"] as const) expect(candidate[key]).toEqual(source[key]);
      expect(hasClimateBias(candidate)).toBe(hasClimateBias(source));
    }
    expect(original).toEqual(before);
  });

  it("mantiene puntajes, orden, filtros y pesos personalizados idénticos en ambos idiomas", () => {
    const signature = (rows: ReturnType<typeof buildRanking>) => rows.map(({ candidate, entry }) => [candidate.id, entry.score]);
    for (const site of original.sites) {
      for (const filters of [{ boliviaOnly: false, unstudiedOnly: false }, { boliviaOnly: true, unstudiedOnly: false }, { boliviaOnly: false, unstudiedOnly: true }]) {
        for (const weights of [original.results.weights, { ...original.results.weights, slope_deg: 2 }]) {
          expect(signature(buildRanking(en.results, en.candidates, site.id, filters, weights))).toEqual(signature(buildRanking(original.results, original.candidates, site.id, filters, weights)));
        }
      }
    }
  });

  it("traduce notas y fuentes visibles sin perder enlaces ni cifras", () => {
    for (const [i, site] of en.sites.entries()) {
      const source = original.sites[i]!;
      expect(urls(site.notes)).toEqual(urls(source.notes));
      expect(numbers(site.notes)).toEqual(numbers(source.notes));
      const prose = [site.notes, ...Object.values(site.sources)].join(" ").replace(/https?:\/\/\S+/g, "");
      expect(prose, site.id).not.toMatch(/Coordenadas|temperatura|calculada con|valor definido|de la ventana|no medido|suelo desnudo|a verificar|sin etiqueta/i);
      for (const [key, text] of Object.entries(site.sources)) expect(urls(text)).toEqual(urls(source.sources[key as keyof typeof source.sources] ?? ""));
    }
    for (const candidate of en.candidates) expect(candidate.why).not.toMatch(/Propuesto|precipitacion|se encontro|relieve local/);
  });

  it("conserva cada proceso, uso, límite, cifra y enlace de las 31 fichas", () => {
    for (const [id, source] of Object.entries(original.fichas)) {
      const translated = en.fichas[id]!;
      expect(numbers(translated.summary), id + " summary").toEqual(numbers(source.summary));
      for (const key of ["processes", "use_cases", "breaks_down"] as const) {
        expect(translated[key].length, id + " " + key).toBe(source[key].length);
        expect(numbers(translated[key].join(" ")), id + " " + key).toEqual(numbers(source[key].join(" ")));
      }
      expect(translated.references.map((ref) => ref.url)).toEqual(source.references.map((ref) => ref.url));
      expect(translated.summary).not.toBe(source.summary);
    }
  });

  it("incluye todas las secciones, tablas y enlaces de la metodología", () => {
    expect(methodologyEn.match(/^## \d\./gm)?.length).toBe(9);
    expect(methodologyEn.match(/^\|/gm)?.length).toBe(methodologyEs.match(/^\|/gm)?.length);
    expect(numbers(methodologyEn.split("\n").filter((line) => line.startsWith("|")).join("\n"))).toEqual(numbers(methodologyEs.split("\n").filter((line) => line.startsWith("|")).join("\n")));
    expect(urls(methodologyEn)).toEqual(urls(methodologyEs));
    expect(methodologyEn).toContain("100 × (1 − distance)");
    expect(methodologyEn).not.toContain("written in Spanish");
  });
});
