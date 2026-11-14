import { describe, expect, it } from "vitest";
import type { Results } from "../types";
import { rescore } from "./score";

const weights: Results["weights"] = {
  slope_deg: 1,
  relief_m: 1,
  temp_mean_c: 1,
  precip_mm_year: 1,
  albedo: 1,
};

// norm_diff y score de pipeline/similarity.py con data/examples, solo para esta prueba.
const moon = { slope_deg: 0.1818, relief_m: 0.1065, temp_mean_c: 0.4706, precip_mm_year: 0.4779, albedo: 0.3333 };
const mars = { slope_deg: 0.9091, relief_m: 0.833, temp_mean_c: 0.9412, precip_mm_year: 0.8193 };

describe("rescore", () => {
  it("reproduce los puntajes de Python para ejemplos lunares y marcianos", () => {
    const customWeights = { ...weights, relief_m: 2, precip_mm_year: 0, albedo: 0.5 };
    expect(rescore(moon, weights)).toBe(68.6);
    expect(rescore(mars, weights)).toBe(12.4);
    expect(rescore(moon, customWeights)).toBe(77.1);
    expect(rescore(mars, customWeights)).toBe(12.1);
  });

  it("promedia solo las diferencias disponibles y redondea empates a par", () => {
    const differences = { slope_deg: 0.0625, relief_m: 0.0625, temp_mean_c: 0.0625 };
    expect(rescore(differences, weights)).toBe(93.8);
    expect(rescore({ ...differences, slope_deg: 0.1875 }, { ...weights, slope_deg: 2 })).toBe(87.5);
    expect(rescore({ slope_deg: 0.1875, relief_m: 0.1875, temp_mean_c: 0.1875 }, weights)).toBe(81.2);
  });

  it("devuelve null cuando faltan variables o el peso total disponible es cero", () => {
    expect(rescore({ slope_deg: 0, relief_m: 0 }, weights)).toBeNull();
    expect(rescore({ slope_deg: 0, relief_m: 0, temp_mean_c: 0 }, {
      ...weights, slope_deg: 0, relief_m: 0, temp_mean_c: 0,
    })).toBeNull();
  });
});
