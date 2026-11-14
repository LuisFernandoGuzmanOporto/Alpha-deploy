import type { RankingEntry, Results, VariableId } from "../types";

/**
 * Recalcula un par a partir de las diferencias que exporta Python a cuatro decimales.
 * Ese redondeo puede cambiar la última cifra respecto de la salida original.
 */
export function rescore(
  normDiff: RankingEntry["norm_diff"],
  weights: Results["weights"],
): number | null {
  let count = 0;
  let weightedDifference = 0;
  let totalWeight = 0;
  for (const [variable, difference] of Object.entries(normDiff) as [VariableId, number][]) {
    if (difference === undefined) continue;
    const weight = weights[variable];
    count += 1;
    weightedDifference += weight * difference;
    totalWeight += weight;
  }
  if (count < 3 || totalWeight === 0) return null;

  const score = 100 * (1 - weightedDifference / totalWeight);
  // En un empate exacto entre décimas, Python redondea hacia la décima par.
  // En binario, esos empates solo son representables en los cuartos impares.
  if ((score * 4) % 2 === 1) {
    const lowerTenth = Math.floor(score * 10);
    return (lowerTenth + (lowerTenth % 2)) / 10;
  }
  return Number(score.toFixed(1));
}
