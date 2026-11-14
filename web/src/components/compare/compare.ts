import { VARIABLE_IDS, type RankingEntry, type VariableId, type VariableValues } from "../../types";

/** Diferencia normalizada a partir de la cual una variable cuenta como "donde falla". */
export const BREAKDOWN_THRESHOLD = 0.3;

const SIMILAR_BELOW = 0.1;
const SOMEWHAT_BELOW = 0.3;

/** Palabras para cuando el candidato terrestre tiene un valor mayor o menor que el sitio. */
const DIRECTION_WORDS: Record<VariableId, { higher: string; lower: string }> = {
  slope_deg: { higher: "más empinado", lower: "más llano" },
  relief_m: { higher: "más accidentado", lower: "más plano" },
  temp_mean_c: { higher: "más cálido", lower: "más frío" },
  precip_mm_year: { higher: "más lluvioso", lower: "más árido" },
  albedo: { higher: "más claro", lower: "más oscuro" },
};

export interface VariableComparison {
  variable: VariableId;
  siteValue: number | null;
  candidateValue: number | null;
  /** Diferencia normalizada de `results.json` (0 a 1), o `null` si falta en algún lado. */
  normDiff: number | null;
  /** Similitud de 0 a 100 (`100 × (1 − normDiff)`), o `null` si falta en algún lado. */
  similarity: number | null;
  /** Diferencia en palabras sencillas, desde el punto de vista del lugar terrestre. */
  description: string;
}

/** Describe en palabras cómo es el candidato terrestre respecto del sitio en una variable. */
export function describeDifference(
  variable: VariableId,
  siteValue: number | null,
  candidateValue: number | null,
  normDiff: number | null,
): string {
  if (siteValue === null || candidateValue === null || normDiff === null) return "sin dato para comparar";
  if (normDiff < SIMILAR_BELOW || siteValue === candidateValue) return "parecido";
  const words = DIRECTION_WORDS[variable];
  const direction = candidateValue > siteValue ? words.higher : words.lower;
  return normDiff < SOMEWHAT_BELOW ? `algo ${direction}` : `mucho ${direction}`;
}

/** Una fila por variable, en el orden del contrato. */
export function compareVariables(
  site: VariableValues,
  candidate: VariableValues,
  entry: RankingEntry | null,
): VariableComparison[] {
  return VARIABLE_IDS.map((variable) => {
    const normDiff = entry?.norm_diff[variable] ?? null;
    return {
      variable,
      siteValue: site[variable],
      candidateValue: candidate[variable],
      normDiff,
      similarity: normDiff === null ? null : Math.round(100 * (1 - normDiff)),
      description: describeDifference(variable, site[variable], candidate[variable], normDiff),
    };
  });
}

/** Variables donde la analogía falla: diferencia normalizada sobre el umbral, de mayor a menor. */
export function biggestGaps(rows: VariableComparison[]): VariableComparison[] {
  return rows
    .filter((row) => row.normDiff !== null && row.normDiff >= BREAKDOWN_THRESHOLD)
    .sort((a, b) => (b.normDiff ?? 0) - (a.normDiff ?? 0));
}
