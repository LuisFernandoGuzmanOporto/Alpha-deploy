import type { Candidate, RankingEntry, Results, VariableId } from "../types";

export type Weights = Record<VariableId, number>;

export interface RankingRow {
  entry: RankingEntry;
  candidate: Candidate;
}

export interface RankingFilters {
  boliviaOnly: boolean;
  /** Solo candidatos `known: false` (poco estudiados como análogo). */
  unstudiedOnly: boolean;
}

/**
 * Puntaje con otros pesos, a partir de `norm_diff` (misma fórmula que pipeline/similarity.py).
 * Devuelve `null` si todas las variables disponibles tienen peso 0.
 */
function rescore(entry: RankingEntry, weights: Weights): number | null {
  let totalWeight = 0;
  let weighted = 0;
  for (const [variable, diff] of Object.entries(entry.norm_diff) as [VariableId, number][]) {
    totalWeight += weights[variable];
    weighted += weights[variable] * diff;
  }
  if (totalWeight === 0) return null;
  return Math.round(100 * (1 - weighted / totalWeight) * 10) / 10;
}

function sameWeights(a: Weights, b: Weights): boolean {
  return (Object.keys(a) as VariableId[]).every((variable) => a[variable] === b[variable]);
}

/**
 * Ranking de un sitio con su candidato resuelto. Con los pesos del pipeline conserva su orden y
 * sus puntajes; con otros pesos recalcula y reordena de mayor a menor puntaje.
 */
export function buildRanking(
  results: Results,
  candidates: Candidate[],
  siteId: string,
  filters: RankingFilters,
  weights: Weights = results.weights,
): RankingRow[] {
  const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));
  const customWeights = !sameWeights(weights, results.weights);
  const rows: RankingRow[] = [];
  for (const original of results.sites[siteId] ?? []) {
    const candidate = byId.get(original.candidate_id);
    if (!candidate) continue;
    if (filters.boliviaOnly && !candidate.is_bolivia) continue;
    if (filters.unstudiedOnly && candidate.known) continue;
    let entry = original;
    if (customWeights) {
      const score = rescore(original, weights);
      if (score === null) continue;
      entry = { ...original, score };
    }
    rows.push({ entry, candidate });
  }
  return customWeights ? rows.sort((a, b) => b.entry.score - a.entry.score) : rows;
}

/** Los mejores candidatos poco estudiados de un sitio (F11). */
export function topUnstudied(results: Results, candidates: Candidate[], siteId: string, limit: number): RankingRow[] {
  return buildRanking(results, candidates, siteId, { boliviaOnly: false, unstudiedOnly: true }).slice(0, limit);
}
