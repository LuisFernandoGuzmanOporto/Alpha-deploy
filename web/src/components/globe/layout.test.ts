import { describe, expect, it } from "vitest";
import { spreadMarkers } from "./layout";

const distance = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y);

describe("spreadMarkers", () => {
  it("deja en su lugar los marcadores que no se tocan", () => {
    const points = [{ x: 0, y: 0 }, { x: 100, y: 0 }];
    expect(spreadMarkers(points, 20)).toEqual(points);
  });

  it("separa los marcadores agrupados al menos minDist entre sí", () => {
    const points = [{ x: 50, y: 50 }, { x: 52, y: 51 }, { x: 49, y: 53 }, { x: 51, y: 49 }];
    const placed = spreadMarkers(points, 20);
    for (let i = 0; i < placed.length; i++) {
      for (let j = i + 1; j < placed.length; j++) {
        expect(distance(placed[i]!, placed[j]!)).toBeGreaterThanOrEqual(20 - 1e-9);
      }
    }
  });

  it("une grupos encadenados aunque los extremos estén lejos", () => {
    const points = [{ x: 0, y: 0 }, { x: 15, y: 0 }, { x: 30, y: 0 }];
    const placed = spreadMarkers(points, 20);
    expect(distance(placed[0]!, placed[2]!)).toBeGreaterThanOrEqual(20 - 1e-9);
  });

  it("mantiene el grupo alrededor de su centro", () => {
    const points = [{ x: 10, y: 10 }, { x: 12, y: 10 }];
    const placed = spreadMarkers(points, 20);
    expect((placed[0]!.x + placed[1]!.x) / 2).toBeCloseTo(11);
    expect((placed[0]!.y + placed[1]!.y) / 2).toBeCloseTo(10);
  });
});
