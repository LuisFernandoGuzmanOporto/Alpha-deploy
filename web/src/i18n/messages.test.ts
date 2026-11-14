import { describe, expect, it } from "vitest";
import { tagsEn, variablesEn } from "../content/en";
import { tags, variables } from "../content/es";
import { TAGS, VARIABLE_IDS } from "../types";
import { MESSAGE_KEYS as KEYS, makeT } from "./messages";

const es = makeT("es");
const en = makeT("en");

function placeholders(text: string): string[] {
  return [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1] ?? "").sort();
}

describe("catálogo de mensajes", () => {
  it("tiene claves", () => {
    expect(KEYS.length).toBeGreaterThan(100);
  });

  it("el inglés usa los mismos marcadores que el español en cada texto", () => {
    for (const key of KEYS) {
      expect(placeholders(en(key)), key).toEqual(placeholders(es(key)));
    }
  });

  it("ningún texto en inglés queda vacío salvo la unidad sin unidad", () => {
    for (const key of KEYS) {
      if (key === "unit.albedo") continue;
      expect(en(key).trim().length, key).toBeGreaterThan(0);
    }
  });

  it("reemplaza los parámetros y deja visible uno que falta", () => {
    expect(en("home.countMany", { n: 7 })).toBe("7 analogs in the ranking");
    expect(es("home.countOne", { n: 1 })).toBe("1 análogo en el ranking");
    expect(en("home.countMany")).toBe("{n} analogs in the ranking");
  });
});

describe("contenido de Noe en inglés", () => {
  it("traduce todas las etiquetas y variables sin dejar el texto en español", () => {
    for (const tag of TAGS) {
      expect(tagsEn[tag].label, tag).not.toBe(tags[tag].label);
      expect(tagsEn[tag].icon).toBe(tags[tag].icon);
    }
    for (const variable of VARIABLE_IDS) {
      expect(variablesEn[variable].label, variable).not.toBe(variables[variable].label);
    }
  });
});
