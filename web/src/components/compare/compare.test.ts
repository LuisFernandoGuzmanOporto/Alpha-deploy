import { describe, expect, it } from "vitest";
import type { RankingEntry, VariableValues } from "../../types";
import { biggestGaps, compareVariables, describeDifference } from "./compare";

const site: VariableValues = { slope_deg: 10, relief_m: 500, temp_mean_c: -150, precip_mm_year: 0, albedo: null };
const candidate: VariableValues = { slope_deg: 11, relief_m: 200, temp_mean_c: -20, precip_mm_year: 5, albedo: 0.3 };
const entry: RankingEntry = {
  candidate_id: "earth-x",
  score: 60,
  n_vars_used: 4,
  norm_diff: { slope_deg: 0.05, relief_m: 0.2, temp_mean_c: 0.6, precip_mm_year: 0.35 },
  tag_overlap: null,
};

describe("describeDifference", () => {
  it("dice parecido con diferencia chica", () => {
    expect(describeDifference("slope_deg", 10, 11, 0.05)).toBe("parecido");
  });

  it("usa algo o mucho según la magnitud y la dirección del candidato", () => {
    expect(describeDifference("relief_m", 500, 200, 0.2)).toBe("algo más plano");
    expect(describeDifference("temp_mean_c", -150, -20, 0.6)).toBe("mucho más cálido");
  });

  it("no compara cuando falta un valor", () => {
    expect(describeDifference("albedo", null, 0.3, null)).toBe("sin dato para comparar");
  });
});

describe("compareVariables", () => {
  it("deja la similitud en null cuando falta el dato, nunca en 0", () => {
    const albedo = compareVariables(site, candidate, entry).find((row) => row.variable === "albedo");
    expect(albedo?.similarity).toBeNull();
    expect(albedo?.siteValue).toBeNull();
  });

  it("calcula la similitud como 100 × (1 − norm_diff)", () => {
    const temp = compareVariables(site, candidate, entry).find((row) => row.variable === "temp_mean_c");
    expect(temp?.similarity).toBe(40);
  });
});

describe("biggestGaps", () => {
  it("devuelve las variables sobre el umbral, de mayor a menor diferencia", () => {
    const gaps = biggestGaps(compareVariables(site, candidate, entry));
    expect(gaps.map((row) => row.variable)).toEqual(["temp_mean_c", "precip_mm_year"]);
  });
});
