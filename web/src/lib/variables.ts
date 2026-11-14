import { tEs, type Translate } from "../i18n/messages";
import { VARIABLE_IDS, type VariableId } from "../types";
import type { Weights } from "./ranking";

export const MAX_WEIGHT = 3;

/** Un valor con su unidad, o "sin dato" cuando es `null` (nunca se inventa). */
export function formatValue(variable: VariableId, value: number | null, t: Translate = tEs): string {
  if (value === null) return t("common.noData");
  const unit = t(`unit.${variable}`);
  return unit ? `${value} ${unit}` : String(value);
}

/** Pesos en la URL: cinco números separados por comas, en el orden de `VARIABLE_IDS`. */
export function serializeWeights(weights: Weights): string {
  return VARIABLE_IDS.map((variable) => weights[variable]).join(",");
}

/** Lee los pesos de la URL; devuelve `null` si faltan, no son números o salen de rango. */
export function parseWeights(raw: string | null): Weights | null {
  if (!raw) return null;
  const parts = raw.split(",").map(Number);
  if (parts.length !== VARIABLE_IDS.length) return null;
  if (parts.some((value) => !Number.isFinite(value) || value < 0 || value > MAX_WEIGHT)) return null;
  return Object.fromEntries(VARIABLE_IDS.map((variable, index) => [variable, parts[index]])) as Weights;
}
