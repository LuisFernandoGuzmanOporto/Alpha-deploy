import { describe, expect, it } from "vitest";
import { project, unproject, wrapLon } from "./orthographic";

describe("wrapLon", () => {
  it("lleva longitudes de 0 a 360 al intervalo [-180, 180)", () => {
    expect(wrapLon(291.2)).toBeCloseTo(-68.8);
    expect(wrapLon(180)).toBe(-180);
    expect(wrapLon(-190)).toBe(170);
  });
});

describe("project", () => {
  it("pone el centro de la vista en el centro del disco", () => {
    const p = project(-86, 0.3, { lat: -86, lon: 0.3 });
    expect(p?.x).toBeCloseTo(0);
    expect(p?.y).toBeCloseTo(0);
  });

  it("oculta los puntos del otro lado de la esfera", () => {
    expect(project(0, 180, { lat: 0, lon: 0 })).toBeNull();
  });

  it("dibuja el norte arriba y el este a la derecha", () => {
    const north = project(30, 0, { lat: 0, lon: 0 });
    const east = project(0, 30, { lat: 0, lon: 0 });
    expect(north?.y).toBeGreaterThan(0);
    expect(east?.x).toBeGreaterThan(0);
  });
});

describe("unproject", () => {
  it("es la inversa de project en el hemisferio visible", () => {
    const view = { lat: -60, lon: 120 };
    for (const [lat, lon] of [[-87.8, 90], [-83.6, -68.8], [-40, 150]] as const) {
      const p = project(lat, lon, view);
      expect(p).not.toBeNull();
      const back = p && unproject(p, view);
      expect(back?.lat).toBeCloseTo(lat, 6);
      expect(back?.lon).toBeCloseTo(lon, 6);
    }
  });

  it("devuelve null fuera del disco", () => {
    expect(unproject({ x: 0.9, y: 0.9 }, { lat: 0, lon: 0 })).toBeNull();
  });
});
