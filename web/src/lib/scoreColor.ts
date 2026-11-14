/** Escala de color del puntaje: la misma en el mapa, la lista y la leyenda. */
export const SCORE_STOPS: readonly (readonly [number, string])[] = [
  [20, "#8a7d6e"],
  [55, "#ffb566"],
  [85, "#ff6a00"],
];

function hexToRgb(hex: string): [number, number, number] {
  const value = Number.parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

/** Color (`#rrggbb`) de un puntaje, interpolado entre los tramos de `SCORE_STOPS`. */
export function scoreColor(score: number): string {
  const first = SCORE_STOPS[0];
  const last = SCORE_STOPS[SCORE_STOPS.length - 1];
  if (!first || !last) return "#000000";
  if (score <= first[0]) return first[1];
  if (score >= last[0]) return last[1];
  for (let i = 1; i < SCORE_STOPS.length; i += 1) {
    const [x1, c1] = SCORE_STOPS[i - 1] ?? first;
    const [x2, c2] = SCORE_STOPS[i] ?? last;
    if (score <= x2) {
      const ratio = (score - x1) / (x2 - x1);
      const a = hexToRgb(c1);
      const b = hexToRgb(c2);
      const channel = (k: 0 | 1 | 2) => Math.round(a[k] + (b[k] - a[k]) * ratio);
      return `#${[channel(0), channel(1), channel(2)].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
    }
  }
  return last[1];
}

/** Gradiente CSS con los mismos tramos, para la leyenda. */
export const SCORE_GRADIENT = `linear-gradient(90deg, ${SCORE_STOPS.map(([, color]) => color).join(", ")})`;
