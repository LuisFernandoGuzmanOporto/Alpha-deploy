import { describe, expect, it } from "vitest";
import candidatesRaw from "../../public/data/candidates.json?raw";
import resultsRaw from "../../public/data/results.json?raw";
import sitesRaw from "../../public/data/sites.json?raw";
import type { Candidate, Results, Site } from "../types";
import { pairDiffs, scenarioRanking, siteRobustness, stability, weightScenarios } from "./robustness";

const results = JSON.parse(resultsRaw) as Results;
const candidates = JSON.parse(candidatesRaw) as Candidate[];
const sites = JSON.parse(sitesRaw) as Site[];
const pairsOf = (siteId: string) => pairDiffs(sites.find((site) => site.id === siteId)!, candidates, results);

/**
 * Referencia: salida de `python pipeline/sensitivity.py` con el catálogo de esta entrega
 * (desplazamiento medio, desplazamiento máximo y nombres compartidos del top 5, por escenario y en
 * el mismo orden). Si cambian los datos, se regenera con ese comando.
 */
const PIPELINE: Record<string, [number, number, number][]> = {
  "mars-jezero": [
    [4.18, 13, 5], [2.86, 10, 5], [8.57, 37, 5],
    [3.11, 13, 5], [1.89, 10, 5], [6.68, 24, 4],
    [1, 4, 5], [0.89, 4, 4], [1.75, 7, 5],
    [3.04, 11, 4], [2.39, 11, 5], [6.43, 27, 2],
    [2.89, 14, 5], [2.21, 13, 4], [5.32, 24, 5],
  ],
  "moon-peak-near-cabeus-b": [
    [1.21, 5, 4], [0.93, 3, 4], [3.11, 14, 3],
    [1.71, 7, 4], [1.14, 3, 5], [4.5, 13, 4],
    [0.61, 3, 4], [0.89, 3, 5], [1.11, 4, 4],
    [2.11, 13, 4], [2.04, 10, 4], [4.21, 23, 4],
    [0, 0, 5], [0, 0, 5], [0, 0, 5],
  ],
};

describe("robustez del puesto frente a los pesos", () => {
  it("el ranking base coincide con el del pipeline", () => {
    for (const [siteId, entries] of Object.entries(results.sites)) {
      expect(scenarioRanking(pairsOf(siteId), results.weights), siteId).toEqual(
        entries.map((entry) => entry.candidate_id),
      );
    }
  });

  for (const [siteId, expected] of Object.entries(PIPELINE)) {
    it(`reproduce los 15 escenarios de sensitivity.py en ${siteId}`, () => {
      const pairs = pairsOf(siteId);
      const base = scenarioRanking(pairs, results.weights);
      const basePosition = new Map(base.map((id, index) => [id, index + 1]));
      const scenarios = weightScenarios(results.weights);
      expect(scenarios).toHaveLength(15);
      scenarios.forEach((scenario, index) => {
        const variant = scenarioRanking(pairs, scenario.weights, scenario.dropped);
        const shifts = variant.map((id, position) => Math.abs(position + 1 - basePosition.get(id)!));
        const mean = Math.round((shifts.reduce((a, b) => a + b, 0) / shifts.length) * 100) / 100;
        const shared = variant.slice(0, 5).filter((id) => base.slice(0, 5).includes(id)).length;
        const label = `${scenario.variable} ${scenario.kind}`;
        expect([mean, Math.max(...shifts), shared], label).toEqual(expected[index]);
      });
    });
  }

  it("el primero de Jezero sigue en el ranking en los 15 escenarios y nunca baja del 1.º al mejor caso", () => {
    const robustness = siteRobustness(pairsOf("mars-jezero"), results.weights);
    const first = robustness.get(results.sites["mars-jezero"]![0]!.candidate_id)!;
    expect(first.base).toBe(1);
    expect(first.present).toBe(15);
    expect(first.best).toBe(1);
    expect(first.worst).toBeGreaterThanOrEqual(1);
    expect(["stable", "moderate", "sensitive"]).toContain(stability(first));
  });

  it("los pesos del albedo no mueven los rankings lunares (sin dato de albedo)", () => {
    const pairs = pairsOf("moon-malapert-massif");
    const base = scenarioRanking(pairs, results.weights);
    for (const scenario of weightScenarios(results.weights).filter((s) => s.variable === "albedo")) {
      expect(scenarioRanking(pairs, scenario.weights, scenario.dropped)).toEqual(base);
    }
  });
});
