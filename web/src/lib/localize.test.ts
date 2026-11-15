import { describe, expect, it } from "vitest";
import candidatesRaw from "../../public/data/candidates.json?raw";
import fichasRaw from "../../public/data/fichas.json?raw";
import sitesRaw from "../../public/data/sites.json?raw";
import * as dataEn from "../content/dataEn";
import { CANDIDATE_NAMES_EN, CANDIDATE_WHY_EN, COUNTRIES_EN, FICHAS_EN, SITES_EN } from "../content/dataEn";
import type { Candidate, Ficha, Site } from "../types";
import type { AppData } from "./data";
import { indexFichas } from "./fichas";
import { localizeData, translateWhy } from "./localize";

const sites = JSON.parse(sitesRaw) as Site[];
const candidates = JSON.parse(candidatesRaw) as Candidate[];
const fichas = indexFichas(JSON.parse(fichasRaw));
const data = { sites, candidates, fichas, results: { sites: {} } } as unknown as AppData;

describe("traducción de los textos de los datos", () => {
  it("cada sitio tiene región y notas en inglés", () => {
    for (const site of sites) {
      expect(SITES_EN[site.id], site.id).toBeDefined();
    }
  });

  it("cada candidato tiene nombre y país en inglés", () => {
    for (const candidate of candidates) {
      expect(CANDIDATE_NAMES_EN[candidate.id], `nombre de ${candidate.id}`).toBeDefined();
      expect(COUNTRIES_EN[candidate.country], `país de ${candidate.id}: ${candidate.country}`).toBeDefined();
    }
  });

  it("cada `why` está en el diccionario o sigue la plantilla traducible", () => {
    for (const candidate of candidates) {
      const translated = CANDIDATE_WHY_EN[candidate.id] ?? translateWhy(candidate.why);
      expect(translated, `why de ${candidate.id}`).toBeDefined();
    }
  });

  it("cada ficha tiene su versión en inglés con las mismas listas", () => {
    for (const [id, ficha] of Object.entries(fichas)) {
      const en = FICHAS_EN[id];
      expect(en, `ficha de ${id}`).toBeDefined();
      expect(en?.processes.length, `processes de ${id}`).toBe(ficha.processes.length);
      expect(en?.use_cases.length, `use_cases de ${id}`).toBe(ficha.use_cases.length);
      expect(en?.breaks_down.length, `breaks_down de ${id}`).toBe(ficha.breaks_down.length);
    }
  });

  it("traduce la plantilla sin tocar los números", () => {
    expect(
      translateWhy(
        "Propuesto por sus valores en este catalogo (149.8 mm/ano de precipitacion, -1.28 °C de temperatura media de superficie, 74.6 m de relieve local); no se encontro un estudio previo como analogo planetario.",
      ),
    ).toBe(
      "Proposed for its values in this catalog (149.8 mm/yr precipitation, -1.28 °C mean surface temperature, 74.6 m local relief); no earlier study as a planetary analog was found.",
    );
  });

  it("acepta la plantilla sin relieve y rechaza textos que no la siguen", () => {
    expect(
      translateWhy(
        "Propuesto por sus valores en este catalogo (1629 mm/ano de precipitacion, 18.32 °C de temperatura media de superficie); no se encontro un estudio previo como analogo planetario.",
      ),
    ).toContain("1629 mm/yr precipitation, 18.32 °C mean surface temperature)");
    expect(translateWhy("Lago de cráter de altura.")).toBeUndefined();
  });

  it("en español devuelve los datos tal cual", () => {
    expect(localizeData(data, "es", dataEn)).toBe(data);
  });

  it("mientras no llegan los textos en inglés devuelve los datos tal cual", () => {
    expect(localizeData(data, "en", null)).toBe(data);
  });

  it("en inglés cambia los textos y conserva ids, valores y referencias", () => {
    const en = localizeData(data, "en", dataEn);
    const licancabur = en.candidates.find((c) => c.id === "earth-licancabur-laguna-verde");
    const original = candidates.find((c) => c.id === "earth-licancabur-laguna-verde");
    expect(licancabur?.name).toBe("Licancabur Volcano and its summit lake");
    expect(licancabur?.country).toBe("Bolivia");
    expect(licancabur?.variables).toEqual(original?.variables);
    expect(licancabur?.notes).toBe(original?.notes);
    expect(en.sites.find((s) => s.id === "moon-malapert-massif")?.region).toBe("Lunar south pole");
    const ficha: Ficha | undefined = en.fichas["earth-gilf-kebir"];
    expect(ficha?.summary).toContain("El-Baz and Maxwell");
    expect(ficha?.references).toEqual(fichas["earth-gilf-kebir"]?.references);
  });
});
