import { describe, expect, it } from "vitest";
import type { Candidate, RankingEntry, Results, VariableId } from "../types";
import { buildRanking, topUnstudied, type Weights } from "./ranking";

// Fixtures sintéticas solo para pruebas; no son datos del proyecto.
const WEIGHTS: Weights = { slope_deg: 1, relief_m: 1, temp_mean_c: 1, precip_mm_year: 1, albedo: 1 };

function entry(id: string, score: number, norm_diff: Partial<Record<VariableId, number>>): RankingEntry {
  return { candidate_id: id, score, n_vars_used: Object.keys(norm_diff).length, norm_diff, tag_overlap: null };
}

function candidate(id: string, known: boolean, isBolivia: boolean): Candidate {
  return {
    id,
    body: "earth",
    name: id,
    country: isBolivia ? "Bolivia" : "Otro",
    is_bolivia: isBolivia,
    known,
    analog_for: ["mars"],
    why: "",
    reference_urls: [],
    lat: null,
    lon: null,
    variables: { slope_deg: null, relief_m: null, temp_mean_c: null, precip_mm_year: null, albedo: null },
    sources: {},
    tags: [],
    notes: "",
  };
}

const candidates = [
  candidate("earth-a", true, false),
  candidate("earth-b", false, true),
  candidate("earth-c", false, false),
];

const results: Results = {
  generated_at: "2000-01-01T00:00:00+00:00",
  variables: ["slope_deg", "relief_m", "temp_mean_c", "precip_mm_year", "albedo"],
  weights: WEIGHTS,
  log_variables: ["relief_m", "precip_mm_year"],
  ranges: {},
  sites: {
    "moon-x": [
      entry("earth-a", 80, { slope_deg: 0.1, relief_m: 0.1, temp_mean_c: 0.4 }),
      entry("earth-b", 60, { slope_deg: 0.5, relief_m: 0.5, temp_mean_c: 0.2 }),
      entry("earth-c", 40, { slope_deg: 0.6, relief_m: 0.6, temp_mean_c: 0.6 }),
      entry("earth-gone", 10, { slope_deg: 0.9, relief_m: 0.9, temp_mean_c: 0.9 }),
    ],
  },
};

const NO_FILTERS = { boliviaOnly: false, unstudiedOnly: false };

describe("buildRanking", () => {
  it("con los pesos del pipeline conserva orden y puntajes, y omite candidatos que no existen", () => {
    const rows = buildRanking(results, candidates, "moon-x", NO_FILTERS);
    expect(rows.map((r) => [r.candidate.id, r.entry.score])).toEqual([
      ["earth-a", 80],
      ["earth-b", 60],
      ["earth-c", 40],
    ]);
  });

  it("devuelve una lista vacía para un sitio sin ranking", () => {
    expect(buildRanking(results, candidates, "moon-nope", NO_FILTERS)).toEqual([]);
  });

  it("filtra Bolivia y poco estudiados", () => {
    const bolivia = buildRanking(results, candidates, "moon-x", { boliviaOnly: true, unstudiedOnly: false });
    expect(bolivia.map((r) => r.candidate.id)).toEqual(["earth-b"]);
    const unstudied = buildRanking(results, candidates, "moon-x", { boliviaOnly: false, unstudiedOnly: true });
    expect(unstudied.map((r) => r.candidate.id)).toEqual(["earth-b", "earth-c"]);
  });

  it("recalcula con otros pesos igual que el pipeline y reordena", () => {
    // Solo la temperatura pesa: score = 100 * (1 - diff_temp).
    const onlyTemp: Weights = { ...WEIGHTS, slope_deg: 0, relief_m: 0, precip_mm_year: 0, albedo: 0 };
    const rows = buildRanking(results, candidates, "moon-x", NO_FILTERS, onlyTemp);
    expect(rows.map((r) => [r.candidate.id, r.entry.score])).toEqual([
      ["earth-b", 80],
      ["earth-a", 60],
      ["earth-c", 40],
    ]);
  });

  it("promedia ponderado: pesos distintos de 1", () => {
    const weights: Weights = { ...WEIGHTS, slope_deg: 2, relief_m: 1, temp_mean_c: 1, precip_mm_year: 0, albedo: 0 };
    const [first] = buildRanking(results, candidates, "moon-x", NO_FILTERS, weights);
    // earth-a: (2*0.1 + 1*0.1 + 1*0.4) / 4 = 0.175 -> 82.5
    expect(first?.candidate.id).toBe("earth-a");
    expect(first?.entry.score).toBe(82.5);
  });

  it("descarta el par si todas sus variables disponibles tienen peso 0", () => {
    const onlyAlbedo: Weights = { ...WEIGHTS, slope_deg: 0, relief_m: 0, temp_mean_c: 0, precip_mm_year: 0 };
    expect(buildRanking(results, candidates, "moon-x", NO_FILTERS, onlyAlbedo)).toEqual([]);
  });
});

describe("topUnstudied", () => {
  it("devuelve solo known: false y respeta el límite", () => {
    expect(topUnstudied(results, candidates, "moon-x", 1).map((r) => r.candidate.id)).toEqual(["earth-b"]);
    expect(topUnstudied(results, candidates, "moon-x", 5).map((r) => r.candidate.id)).toEqual(["earth-b", "earth-c"]);
  });
});
