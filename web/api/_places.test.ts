import { describe, expect, it } from "vitest";
import { distanceKm, isCandidateId, pickPlace, type GooglePlace } from "./_places";

const photo = { name: "places/x/photos/y", widthPx: 1600, heightPx: 1200 };

describe("pickPlace", () => {
  it("descarta homónimos lejanos y elige el resultado con fotos dentro de 10 km", () => {
    const places: GooglePlace[] = [
      { id: "far", location: { latitude: 10, longitude: 10 }, photos: [photo] },
      { id: "near-no-photos", location: { latitude: -22.05, longitude: -67.88 } },
      { id: "near", location: { latitude: -22.06, longitude: -67.87 }, photos: [photo] },
    ];
    expect(pickPlace(places, -22.05, -67.88)?.id).toBe("near");
  });

  it("devuelve null si ningún resultado está cerca", () => {
    expect(pickPlace([{ id: "a", location: { latitude: 0, longitude: 0 }, photos: [photo] }], -22, -67)).toBeNull();
  });
});

describe("distanceKm", () => {
  it("un grado de latitud son unos 111 km", () => {
    expect(distanceKm(0, 0, 1, 0)).toBeCloseTo(111.2, 0);
  });
});

describe("isCandidateId", () => {
  it("acepta ids del catálogo y rechaza el resto", () => {
    expect(isCandidateId("earth-volcan-ollague")).toBe(true);
    expect(isCandidateId("../secrets")).toBe(false);
    expect(isCandidateId(null)).toBe(false);
  });
});
