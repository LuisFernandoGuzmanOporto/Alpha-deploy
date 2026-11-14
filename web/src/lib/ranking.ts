import type { Candidate, RankingEntry, Results } from "../types";

export interface RankingRow {
  entry: RankingEntry;
  candidate: Candidate;
}

export interface RankingFilters {
  boliviaOnly: boolean;
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
    rows.push({ entry, candidate });
  }
  return rows;
}
