#!/usr/bin/env python3
"""Mide sensibilidad del ranking. Ejecuta validate.py sobre el mismo catálogo antes.

Por ejemplo: python pipeline/sensitivity.py --data data
El informe Markdown sale por stdout. Las comprobaciones controladas son sintéticas.
"""
import argparse
from pathlib import Path
import sys
from statistics import mean

from similarity import VARIABLES, WEIGHTS, build_results, load_json


def scenarios():
    for variable in VARIABLES:
        for factor, label in ((0.5, "−50 %"), (1.5, "+50 %")):
            yield f"{variable} {label}", {**WEIGHTS, variable: WEIGHTS[variable] * factor}, None
        yield f"Sin {variable}", WEIGHTS, variable


def without_variable(records, variable):
    return [
        {**record, "variables": {
            name: value for name, value in record["variables"].items() if name != variable
        }}
        for record in records
    ]


def compare_rankings(base, variant):
    base_ids = [row["candidate_id"] for row in base]
    variant_ids = [row["candidate_id"] for row in variant]
    base_positions = {candidate: rank for rank, candidate in enumerate(base_ids, 1)}
    variant_positions = {candidate: rank for rank, candidate in enumerate(variant_ids, 1)}
    common = base_positions.keys() & variant_positions.keys()
    shifts = [abs(base_positions[candidate] - variant_positions[candidate]) for candidate in common]
    return (
        f"{mean(shifts):.2f}" if shifts else "—",
        max(shifts, default="—"),
        len(set(base_ids[:5]) & set(variant_ids[:5])),
        min(5, len(base_ids)),
        min(5, len(variant_ids)),
        len(variant_positions.keys() - base_positions.keys()),
        len(base_positions.keys() - variant_positions.keys()),
    )


def sanity_check():
    """Aísla temperatura y aridez conservando idénticas las otras variables."""
    terrain = {"slope_deg": 1, "relief_m": 30, "albedo": 0.2}
    mars = {"id": "test-mars", "variables": {**terrain, "temp_mean_c": -50, "precip_mm_year": 0}}
    cold = {"id": "test-cold", "variables": {**terrain, "temp_mean_c": -15, "precip_mm_year": 5}}
    warm = {"id": "test-warm", "variables": {**terrain, "temp_mean_c": 25, "precip_mm_year": 1500}}
    cases = (
        ("frío y seco frente a cálido y húmedo", cold, warm),
        ("menor precipitación a igual temperatura", cold, {
            **warm, "variables": {**warm["variables"], "temp_mean_c": -15}
        }),
        ("menor diferencia térmica a igual precipitación", cold, {
            **warm, "variables": {**warm["variables"], "precip_mm_year": 5}
        }),
    )
    passed = True
    print("### Comprobaciones controladas con datos sintéticos\n")
    print("| Caso | Puntaje esperado mayor | Otro puntaje | Resultado |")
    print("| --- | ---: | ---: | --- |")
    for label, closer, farther in cases:
        rows = build_results([mars], [farther, closer])["sites"][mars["id"]]
        scores = {row["candidate_id"]: row["score"] for row in rows}
        first, second = scores[closer["id"]], scores[farther["id"]]
        ok = first > second
        passed &= ok
        print(f"| {label} | {first:.1f} | {second:.1f} | {'OK' if ok else 'Fallo'} |")
    return passed


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data", type=Path, default=Path("data"))
    args = parser.parse_args()
    sites = load_json(args.data / "sites.json")
    candidates = load_json(args.data / "candidates.json")
    if not sites or not candidates:
        parser.exit(1, "Se necesitan ambos catálogos para medir la sensibilidad del ranking.\n")

    baseline = build_results(sites, candidates)["sites"]
    header = (
        "| Escenario | Despl. medio | Despl. máximo | Top compartido | "
        "Top base | Top variante | Entran al ranking | Salen del ranking |"
    )
    separator = "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |"
    tables = {site["id"]: [header, separator] for site in sites}
    print("## Sensibilidad del ranking\n")
    if any(row["id"].startswith("demo-") for row in sites + candidates):
        print("Catálogo DEMO. Las tablas siguientes son exclusivamente para pruebas.\n")
    print("El desplazamiento usa las posiciones de los candidatos presentes en ambos rankings. "
          "Al retirar una variable se vuelve a exigir un mínimo de tres variables compartidas.\n")
    for label, weights, dropped in scenarios():
        scenario_sites = without_variable(sites, dropped) if dropped else sites
        scenario_candidates = without_variable(candidates, dropped) if dropped else candidates
        variant = build_results(scenario_sites, scenario_candidates, weights)["sites"]
        for site_id, rows in baseline.items():
            values = compare_rankings(rows, variant[site_id])
            tables[site_id].append("| " + " | ".join(map(str, (label, *values))) + " |")

    for site_id, table in tables.items():
        print(f"### {site_id} ({len(baseline[site_id])} pares en el ranking base)\n")
        print(*table, sep="\n", end="\n\n")
    return 0 if sanity_check() else 1


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
    raise SystemExit(main())
