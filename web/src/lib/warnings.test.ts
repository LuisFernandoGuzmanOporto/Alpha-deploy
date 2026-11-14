import { describe, expect, it } from "vitest";
import type { Candidate } from "../types";
import { hasClimateBias } from "./warnings";

const base = { notes: "" } as Candidate;

describe("hasClimateBias", () => {
  it("detecta el aviso ATENCION de los datos", () => {
    expect(hasClimateBias({ ...base, notes: "Coordenadas: x. ATENCION: el punto esta 3000 m por encima de la celda." })).toBe(true);
  });

  it("no avisa si las notas no lo traen", () => {
    expect(hasClimateBias({ ...base, notes: "Coordenadas: x. known=true: ..." })).toBe(false);
    expect(hasClimateBias(base)).toBe(false);
  });
});
