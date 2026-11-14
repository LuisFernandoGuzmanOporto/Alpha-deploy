import type { Candidate, RankingEntry, Results } from "../types";

export interface RankingRow {
  entry: RankingEntry;
  candidate: Candidate;
}

export interface RankingFilters {
  boliviaOnly: boolean;
  /** Solo candidatos `known: false` (poco estudiados como análogo). */
  unstudiedOnly: boolean;
}

/** Ranking de un sitio con su candidato resuelto, conservando el orden por puntaje del pipeline. */
export function buildRanking(
  results: Results,
  candidates: Candidate[],
  siteId: string,
  filters: RankingFilters,
): RankingRow[] {
  const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));
  const rows: RankingRow[] = [];
  for (const entry of results.sites[siteId] ?? []) {
    const candidate = byId.get(entry.candidate_id);
    if (!candidate) continue;
    if (filters.boliviaOnly && !candidate.is_bolivia) continue;
    if (filters.unstudiedOnly && candidate.known) continue;
    rows.push({ entry, candidate });
  }
  return rows;
}

/** Los mejores candidatos poco estudiados de un sitio (F11). */
export function topUnstudied(results: Results, candidates: Candidate[], siteId: string, limit: number): RankingRow[] {
  return buildRanking(results, candidates, siteId, { boliviaOnly: false, unstudiedOnly: true }).slice(0, limit);
}
