import { VARIABLE_IDS } from "../types";
import type { Weights } from "./ranking";

export type ProfileId = "equal" | "mobility" | "thermal" | "water";

export interface MissionProfile {
  id: ProfileId;
  weights: Weights;
}

/**
 * Perfiles de ejemplo por objetivo de misión (tarea 4a). Fijan los pesos del índice; no son una
 * calibración científica, solo una forma explícita y reproducible de decir qué importa más.
 * Escala: 0 a 3 en pasos de 0,5, la misma de los sliders (1 = peso de referencia).
 *
 * - Igual: la referencia del índice (los cinco pesos en 1).
 * - Movilidad de rovers: la pendiente y el relieve local deciden si un vehículo puede pasar y cómo se
 *   navega (3 cada uno). El albedo se queda en 1 porque cambia la iluminación de las cámaras; el clima,
 *   en 0,5, porque importa menos para ensayar la conducción.
 * - Energía y sistemas térmicos: la temperatura media manda (3) y el albedo pesa 2 porque fija cuánta
 *   radiación absorbe la superficie. El terreno queda en 1 y la lluvia en 0,5.
 * - Agua y hielo: la aridez (3) y el frío (2) deciden si el agua o el hielo pueden persistir. El terreno
 *   queda en 0,5 y el albedo en 1, porque el hielo y las sales cambian la reflectividad.
 *
 * En los sitios lunares el albedo no tiene dato, así que su peso no cambia esos rankings.
 */
export const MISSION_PROFILES: readonly MissionProfile[] = [
  { id: "equal", weights: { slope_deg: 1, relief_m: 1, temp_mean_c: 1, precip_mm_year: 1, albedo: 1 } },
  { id: "mobility", weights: { slope_deg: 3, relief_m: 3, temp_mean_c: 0.5, precip_mm_year: 0.5, albedo: 1 } },
  { id: "thermal", weights: { slope_deg: 1, relief_m: 1, temp_mean_c: 3, precip_mm_year: 0.5, albedo: 2 } },
  { id: "water", weights: { slope_deg: 0.5, relief_m: 0.5, temp_mean_c: 2, precip_mm_year: 3, albedo: 1 } },
];

/** El perfil cuyos pesos coinciden exactamente con `weights`, o `null` si son pesos a mano. */
export function activeProfile(weights: Weights): ProfileId | null {
  const match = MISSION_PROFILES.find((profile) =>
    VARIABLE_IDS.every((variable) => profile.weights[variable] === weights[variable]),
  );
  return match?.id ?? null;
}
