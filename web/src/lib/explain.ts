import { biggestGaps, compareVariables } from "../components/compare/compare";
import type { Translate } from "../i18n/messages";
import type { Candidate, RankingEntry, Site, Tag, VariableId } from "../types";
import { formatValue } from "./variables";

/** Solo se explican los cinco mejores pares de cada sitio (tarea 4d, F7). */
export const EXPLAIN_TOP = 5;

interface Labels {
  variable: (variable: VariableId) => string;
  tag: (tag: Tag) => string;
  ordinal: (n: number) => string;
}

/**
 * Explicación de 3 o 4 frases para un par del top 5, armada con una plantilla fija a partir de
 * `norm_diff`, los valores y las etiquetas (sin IA ni servidores). `rank` es el puesto con los pesos
 * iguales del pipeline. Devuelve `null` fuera del top 5.
 */
export function explainPair(
  site: Site,
  candidate: Candidate,
  entry: RankingEntry,
  rank: number,
  total: number,
  t: Translate,
  labels: Labels,
): string[] | null {
  if (rank < 1 || rank > EXPLAIN_TOP) return null;
  const rows = compareVariables(site.variables, candidate.variables, entry, t).filter((row) => row.similarity !== null);
  const closest = [...rows].sort((a, b) => (a.normDiff ?? 1) - (b.normDiff ?? 1)).slice(0, 2);
  const gap = biggestGaps(rows)[0] ?? [...rows].sort((a, b) => (b.normDiff ?? 0) - (a.normDiff ?? 0))[0];
  const name = (variable: VariableId) => labels.variable(variable).toLowerCase();

  const sentences = [
    t("explain.rank", { place: candidate.name, rank: labels.ordinal(rank), total, site: site.name, score: entry.score.toFixed(1) }),
  ];
  if (closest.length === 2) {
    sentences.push(
      t("explain.closest", {
        a: name(closest[0]!.variable),
        pa: closest[0]!.similarity!,
        b: name(closest[1]!.variable),
        pb: closest[1]!.similarity!,
      }),
    );
  }
  if (gap) {
    sentences.push(
      t("explain.gap", {
        variable: name(gap.variable),
        place: formatValue(gap.variable, gap.candidateValue, t),
        site: formatValue(gap.variable, gap.siteValue, t),
        similarity: gap.similarity!,
      }),
    );
  }
  const overlap = entry.tag_overlap;
  if (overlap && overlap.shared.length > 0) {
    sentences.push(t("explain.shared", { tags: overlap.shared.map((tag) => labels.tag(tag).toLowerCase()).join(", ") }));
  } else if (overlap && overlap.only_site.length > 0) {
    sentences.push(t("explain.missing", { tags: overlap.only_site.map((tag) => labels.tag(tag).toLowerCase()).join(", ") }));
  } else {
    sentences.push(t(candidate.known ? "explain.known" : "explain.unstudied"));
  }
  return sentences;
}
