/** Reparto de marcadores en pantalla para que no se superpongan cuando sus puntos están muy cerca. */

export interface Point {
  x: number;
  y: number;
}

/**
 * Posición de dibujo de cada marcador. Los marcadores cuyos puntos quedan a menos de `minDist`
 * (directa o encadenadamente) forman un grupo y se reparten en un círculo alrededor del centro del
 * grupo, separados entre sí por `minDist`. Un marcador aislado se dibuja en su punto.
 */
export function spreadMarkers(points: Point[], minDist: number): Point[] {
  const parent = points.map((_, i) => i);
  const find = (i: number): number => {
    while (parent[i] !== i) i = parent[i] = parent[parent[i]!]!;
    return i;
  };
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const a = points[i]!;
      const b = points[j]!;
      if (Math.hypot(a.x - b.x, a.y - b.y) < minDist) parent[find(i)] = find(j);
    }
  }

  const groups = new Map<number, number[]>();
  points.forEach((_, i) => groups.set(find(i), [...(groups.get(find(i)) ?? []), i]));

  const placed: Point[] = points.map((p) => ({ ...p }));
  for (const members of groups.values()) {
    if (members.length < 2) continue;
    const cx = members.reduce((sum, i) => sum + points[i]!.x, 0) / members.length;
    const cy = members.reduce((sum, i) => sum + points[i]!.y, 0) / members.length;
    const ring = minDist / (2 * Math.sin(Math.PI / members.length));
    members.forEach((i, k) => {
      const angle = -Math.PI / 2 + (2 * Math.PI * k) / members.length;
      placed[i] = { x: cx + ring * Math.cos(angle), y: cy + ring * Math.sin(angle) };
    });
  }
  return placed;
}
