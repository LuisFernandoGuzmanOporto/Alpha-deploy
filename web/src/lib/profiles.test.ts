import { describe, expect, it } from "vitest";
import { VARIABLE_IDS } from "../types";
import { activeProfile, MISSION_PROFILES } from "./profiles";
import { MAX_WEIGHT, parseWeights, serializeWeights } from "./variables";

describe("perfiles por objetivo de misión", () => {
  it("cada perfil tiene los cinco pesos dentro del rango de los sliders", () => {
    for (const profile of MISSION_PROFILES) {
      for (const variable of VARIABLE_IDS) {
        const weight = profile.weights[variable];
        expect(weight, `${profile.id} ${variable}`).toBeGreaterThanOrEqual(0);
        expect(weight, `${profile.id} ${variable}`).toBeLessThanOrEqual(MAX_WEIGHT);
        expect((weight * 2) % 1, `${profile.id} ${variable}: pasos de 0,5`).toBe(0);
      }
    }
  });

  it("los perfiles son distintos entre sí", () => {
    const keys = MISSION_PROFILES.map((profile) => serializeWeights(profile.weights));
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("el perfil activo se deduce de los pesos de la URL", () => {
    for (const profile of MISSION_PROFILES) {
      const fromUrl = parseWeights(serializeWeights(profile.weights));
      expect(fromUrl).not.toBeNull();
      expect(activeProfile(fromUrl!)).toBe(profile.id);
    }
  });

  it("pesos a mano no coinciden con ningún perfil", () => {
    expect(activeProfile({ slope_deg: 2, relief_m: 1, temp_mean_c: 1, precip_mm_year: 1, albedo: 1 })).toBeNull();
  });
});
