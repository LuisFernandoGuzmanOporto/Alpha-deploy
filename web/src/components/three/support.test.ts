import { describe, expect, it } from "vitest";
import { latLonToXYZ } from "./support";

const close = (a: number, b: number) => expect(Math.abs(a - b)).toBeLessThan(1e-9);

describe("latLonToXYZ", () => {
  it("pone el polo norte arriba y el polo sur abajo", () => {
    const [, yN] = latLonToXYZ(90, 0, 1);
    const [, yS] = latLonToXYZ(-90, 0, 1);
    close(yN, 1);
    close(yS, -1);
  });

  it("lon 0 en el ecuador cae sobre +x (centro de la textura en la esfera de three.js)", () => {
    const [x, y, z] = latLonToXYZ(0, 0, 2);
    close(x, 2);
    close(y, 0);
    close(z, 0);
  });

  it("lon 90 E en el ecuador cae sobre -z", () => {
    const [x, , z] = latLonToXYZ(0, 90, 1);
    close(x, 0);
    close(z, -1);
  });

  it("conserva el radio", () => {
    for (const [lat, lon] of [
      [-22.4, -67.8],
      [-87.8, 90],
      [18.4, 77.4],
    ] as const) {
      const [x, y, z] = latLonToXYZ(lat, lon, 1.5);
      close(Math.hypot(x, y, z), 1.5);
    }
  });
});
