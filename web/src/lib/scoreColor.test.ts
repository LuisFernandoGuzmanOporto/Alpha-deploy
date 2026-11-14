import { describe, expect, it } from "vitest";
import { SCORE_STOPS, scoreColor } from "./scoreColor";

describe("scoreColor", () => {
  it("devuelve el color exacto de cada tramo y se queda en los extremos", () => {
    for (const [score, color] of SCORE_STOPS) expect(scoreColor(score)).toBe(color);
    expect(scoreColor(0)).toBe("#b5472c");
    expect(scoreColor(100)).toBe("#0a7a6e");
  });

  it("interpola entre tramos y siempre devuelve #rrggbb", () => {
    for (const score of [21, 30, 54.9, 55.1, 70, 84]) {
      expect(scoreColor(score)).toMatch(/^#[0-9a-f]{6}$/);
    }
    expect(scoreColor(37.5)).not.toBe(scoreColor(20));
    expect(scoreColor(37.5)).not.toBe(scoreColor(55));
  });
});
