import { describe, expect, it } from "vitest";
import { placeCategory } from "../../lib/photos";
import type { RankingRow } from "../../lib/ranking";
import { filterPlaces, fold } from "./PlaceExplorer";

function row(id: string, name: string, country: string, tags: string[]): RankingRow {
  return { candidate: { id, name, country, tags }, entry: { score: 50 } } as unknown as RankingRow;
}

const rows = [
  row("a", "Volcán Ollagüe", "Bolivia y Chile", ["volcanic-field"]),
  row("b", "Salar de Uyuni", "Bolivia", ["evaporite"]),
  row("c", "Valles Secos de McMurdo", "Antártida", ["extreme-cold", "hyper-arid"]),
];

describe("placeCategory", () => {
  it("prioriza hielo sobre desierto y cae en terreno sin etiquetas", () => {
    expect(placeCategory(["hyper-arid", "extreme-cold"])).toBe("ice");
    expect(placeCategory(["evaporite"])).toBe("salt");
    expect(placeCategory([])).toBe("terrain");
  });
});

describe("filterPlaces", () => {
  it("busca sin tildes por nombre o país", () => {
    expect(fold("Ollagüe")).toBe("ollague");
    expect(filterPlaces(rows, { query: "ollague", category: "all", country: "" }).map((r) => r.candidate.id)).toEqual(["a"]);
    expect(filterPlaces(rows, { query: "antartida", category: "all", country: "" }).map((r) => r.candidate.id)).toEqual(["c"]);
  });

  it("combina categoría y país conservando el orden", () => {
    expect(filterPlaces(rows, { query: "", category: "salt", country: "" }).map((r) => r.candidate.id)).toEqual(["b"]);
    expect(filterPlaces(rows, { query: "", category: "all", country: "Bolivia" }).map((r) => r.candidate.id)).toEqual(["b"]);
    expect(filterPlaces(rows, { query: "", category: "ice", country: "Bolivia" })).toEqual([]);
  });
});
