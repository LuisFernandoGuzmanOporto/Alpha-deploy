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

  it("cuenta una diferencia cero y excluye del promedio las variables ausentes", () => {
    const differences = { slope_deg: 0, relief_m: 1, temp_mean_c: 0.5 };
    expect(rescore(differences, { ...weights, slope_deg: 2, albedo: 100 })).toBe(62.5);
    expect(rescore({ slope_deg: 0, relief_m: 1 }, weights)).toBeNull();
  });

  it("acepta los extremos de la escala y omite el peso cero sin perder cobertura", () => {
    expect(rescore({ slope_deg: 0, relief_m: 0, temp_mean_c: 0 }, weights)).toBe(100);
    expect(rescore({ slope_deg: 1, relief_m: 1, temp_mean_c: 1 }, weights)).toBe(0);
    expect(rescore({ slope_deg: 1, relief_m: 0, temp_mean_c: 1 }, {
      ...weights, slope_deg: 0, temp_mean_c: 0,
    })).toBe(100);
  });

  it("recalcula en el orden del pipeline independientemente del orden del JSON", () => {
    const shuffled = { albedo: 0.3333, temp_mean_c: 0.4706, precip_mm_year: 0.4779, relief_m: 0.1065, slope_deg: 0.1818 };
    expect(rescore(shuffled, weights)).toBe(rescore(moon, weights));
  });

  it("permite ordenar de mayor a menor tras cambiar los pesos", () => {
    const pairA = { slope_deg: 0.1, relief_m: 0.8, temp_mean_c: 0.1 };
    const pairB = { slope_deg: 0.8, relief_m: 0.1, temp_mean_c: 0.3 };
    expect(rescore(pairA, weights)!).toBeGreaterThan(rescore(pairB, weights)!);
    const reliefWeight = { ...weights, relief_m: 3 };
    expect(rescore(pairB, reliefWeight)!).toBeGreaterThan(rescore(pairA, reliefWeight)!);
  });

  it("recalcula a partir de la precisión publicada, que puede perder una décima", () => {
    // Ambos conjuntos originales exportan 0.5005 y Python los puntúa como 50.0 y 49.9.
    const published = { slope_deg: 0.5005, relief_m: 0.5005, temp_mean_c: 0.5005 };
    expect(rescore(published, weights)).toBe(50);
  });
});
