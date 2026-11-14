import { describe, expect, it } from "vitest";
import { indexFichas } from "./fichas";

// Fixtures sintéticas solo para pruebas; no son fichas del proyecto.
const complete = {
  candidate_id: "earth-a",
  summary: "Resumen",
  processes: ["erosión eólica"],
  use_cases: ["pruebas de rovers"],
  breaks_down: ["gravedad terrestre"],
  references: [{ title: "Artículo", url: "https://example.org/a" }],
};

describe("indexFichas", () => {
  it("indexa por candidate_id", () => {
    expect(indexFichas([complete])["earth-a"]).toEqual(complete);
  });

  it("no publica una ficha sin breaks_down", () => {
    const sin = { ...complete, candidate_id: "earth-b", breaks_down: [] };
    const faltante = { candidate_id: "earth-c", summary: "x" };
    expect(Object.keys(indexFichas([complete, sin, faltante]))).toEqual(["earth-a"]);
  });

  it("descarta referencias que no son enlaces http(s)", () => {
    const ficha = {
      ...complete,
      references: [
        { title: "ok", url: "https://example.org/a" },
        { title: "malo", url: "javascript:alert(1)" },
        { title: "sin url" },
        "texto",
      ],
    };
    expect(indexFichas([ficha])["earth-a"]?.references).toEqual([{ title: "ok", url: "https://example.org/a" }]);
  });

  it("tolera entradas que no son una lista o registros mal formados", () => {
    expect(indexFichas(null)).toEqual({});
    expect(indexFichas({})).toEqual({});
    expect(indexFichas([null, 5, { candidate_id: 7, breaks_down: ["x"] }])).toEqual({});
  });

  it("rellena con vacíos los campos opcionales ausentes", () => {
    const minima = { candidate_id: "earth-d", breaks_down: ["x"] };
    expect(indexFichas([minima])["earth-d"]).toEqual({
      candidate_id: "earth-d",
      summary: "",
      processes: [],
      use_cases: [],
      breaks_down: ["x"],
      references: [],
    });
  });
});
