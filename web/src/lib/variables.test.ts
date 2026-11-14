import { describe, expect, it } from "vitest";
import type { Weights } from "./ranking";
import { formatValue, parseWeights, serializeWeights } from "./variables";

const WEIGHTS: Weights = { slope_deg: 1, relief_m: 0.5, temp_mean_c: 3, precip_mm_year: 0, albedo: 2 };

describe("formatValue", () => {
  it("muestra 'sin dato' para null y la unidad cuando hay valor", () => {
    expect(formatValue("slope_deg", null)).toBe("sin dato");
    expect(formatValue("temp_mean_c", -60)).toBe("-60 °C");
    expect(formatValue("albedo", 0.12)).toBe("0.12");
  });
});

describe("pesos en la URL", () => {
  it("ida y vuelta", () => {
    expect(serializeWeights(WEIGHTS)).toBe("1,0.5,3,0,2");
    expect(parseWeights("1,0.5,3,0,2")).toEqual(WEIGHTS);
  });

  it("ignora valores ausentes, incompletos, no numéricos o fuera de rango", () => {
    expect(parseWeights(null)).toBeNull();
    expect(parseWeights("")).toBeNull();
    expect(parseWeights("1,1,1")).toBeNull();
    expect(parseWeights("1,1,1,1,x")).toBeNull();
    expect(parseWeights("1,1,1,1,4")).toBeNull();
    expect(parseWeights("1,1,1,1,-1")).toBeNull();
  });
});
