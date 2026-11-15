import { VARIABLE_IDS, type Candidate, type Results, type Site, type VariableId } from "../types";
import type { Weights } from "./ranking";
import { rescore } from "./score";

/**
 * Robustez del puesto (tarea 4b): la misma prueba que `pipeline/sensitivity.py`, en el navegador.
 * Para cada variable, su peso por 0,5 y por 1,5, y un escenario sin ella (que vuelve a exigir al menos
 * tres variables compartidas): 15 escenarios por sitio, en el mismo orden que el pipeline.
 *
 * Las diferencias se recalculan a precisión completa con `ranges` y `log_variables` de `results.json`:
 * las de `norm_diff` vienen redondeadas a cuatro decimales y desempatan distinto que el pipeline en
 * puntajes que caen justo en ,x5.
 */
export interface Scenario {
  variable: VariableId;
  kind: "minus" | "plus" | "drop";
  weights: Weights;
  dropped: VariableId | null;
}

export function weightScenarios(base: Weights): Scenario[] {
  return VARIABLE_IDS.flatMap((variable): Scenario[] => [
    { variable, kind: "minus", weights: { ...base, [variable]: base[variable] * 0.5 }, dropped: null },
    { variable, kind: "plus", weights: { ...base, [variable]: base[variable] * 1.5 }, dropped: null },
    { variable, kind: "drop", weights: base, dropped: variable },
  ]);
}

export interface PairDiffs {
  id: string;
  diffs: Partial<Record<VariableId, number>>;
}

/** Igual que `normalize` de `similarity.py`: log1p en las variables logarítmicas y escala min–max conjunta. */
function normalize(results: Results, variable: VariableId, value: number | null): number | null {
  const range = results.ranges[variable];
  if (value === null || !range) return null;
  const [lo, hi] = range;
  if (hi === lo) return 0;
  const transformed = results.log_variables.includes(variable) ? Math.log1p(value) : value;
  return (transformed - lo) / (hi - lo);
}

/** Diferencias normalizadas de cada candidato con el sitio, en el orden del catálogo. */
export function pairDiffs(site: Site, candidates: readonly Candidate[], results: Results): PairDiffs[] {
  return candidates.map((candidate) => {
    const diffs: Partial<Record<VariableId, number>> = {};
    for (const variable of VARIABLE_IDS) {
      const s = normalize(results, variable, site.variables[variable]);
      const c = normalize(results, variable, candidate.variables[variable]);
      if (s !== null && c !== null) diffs[variable] = Math.abs(s - c);
    }
    return { id: candidate.id, diffs };
  });
}

/**
 * Ids del ranking con unos pesos y, si se pide, sin una variable. Orden como en `similarity.py`:
 * puntaje redondeado de mayor a menor y, en los empates, el orden del catálogo.
 */
export function scenarioRanking(pairs: readonly PairDiffs[], weights: Weights, dropped: VariableId | null = null): string[] {
  const scored: { id: string; score: number; order: number }[] = [];
  pairs.forEach((pair, order) => {
    const diffs = dropped ? { ...pair.diffs, [dropped]: undefined } : pair.diffs;
    const score = rescore(diffs, weights);
    if (score !== null) scored.push({ id: pair.id, score, order });
  });
  scored.sort((a, b) => b.score - a.score || a.order - b.order);
  return scored.map((row) => row.id);
}

export interface Robustness {
  /** Puesto en el ranking general con los pesos actuales. */
  base: number;
  best: number;
  worst: number;
  /** Escenarios en los que sigue en el ranking (sin una variable puede quedar con menos de tres). */
  present: number;
  total: number;
}

/** Robustez de cada candidato de un sitio frente a los 15 escenarios, partiendo de los pesos actuales. */
export function siteRobustness(pairs: readonly PairDiffs[], base: Weights): Map<string, Robustness> {
  const scenarios = weightScenarios(base);
  const result = new Map<string, Robustness>();
  scenarioRanking(pairs, base).forEach((id, index) => {
    result.set(id, { base: index + 1, best: index + 1, worst: index + 1, present: 0, total: scenarios.length });
  });
  for (const scenario of scenarios) {
    const ranking = scenarioRanking(pairs, scenario.weights, scenario.dropped);
    ranking.forEach((id, index) => {
      const robustness = result.get(id);
      if (!robustness) return;
      robustness.present += 1;
      robustness.best = Math.min(robustness.best, index + 1);
      robustness.worst = Math.max(robustness.worst, index + 1);
    });
  }
  return result;
}

export type Stability = "stable" | "moderate" | "sensitive";

/** Estable si el puesto se mueve 2 lugares o menos; moderado hasta 5; sensible si se mueve más o sale del ranking. */
export function stability(robustness: Robustness): Stability {
  if (robustness.present < robustness.total) return "sensitive";
  const spread = robustness.worst - robustness.best;
  return spread <= 2 ? "stable" : spread <= 5 ? "moderate" : "sensitive";
}
