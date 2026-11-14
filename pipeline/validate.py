#!/usr/bin/env python3
"""Valida data/sites.json y data/candidates.json contra el contrato de CONTEXT.md.

Solo usa la biblioteca estandar de Python. Corre esto antes de cada commit de datos.

Uso:
    python pipeline/validate.py
    python pipeline/validate.py --data data/examples

Sale con codigo 1 si hay errores. Los avisos no bloquean.
"""
import argparse
import json
import math
import re
import sys
from pathlib import Path

VARIABLES = ["slope_deg", "relief_m", "temp_mean_c", "precip_mm_year", "albedo"]
NON_NEGATIVE = {"slope_deg", "relief_m", "precip_mm_year"}
ID_RE = re.compile(r"^(moon|mars|earth)(-[a-z0-9]+)+$|^demo(-[a-z0-9]+)+$")
TAGS = {
    "basalt", "impact-crater", "evaporite", "aeolian-dunes", "dust-activity", "polar-ice",
    "permafrost", "glacier", "lava-tubes", "caves", "hydrated-minerals", "highland-terrain",
    "volcanic-field", "extreme-cold", "hyper-arid",
}


def is_number(x):
    return type(x) is int or (type(x) is float and math.isfinite(x))


def check_record(rec, kind, errors, warnings, seen):
    if not isinstance(rec, dict):
        errors.append(f'{kind}: cada registro debe ser un objeto JSON')
        return

    rid = rec.get("id", "<sin id>")
    where = f"{kind} {rid}"

    for key in ("id", "body", "name", "variables", "sources"):
        if key not in rec:
            errors.append(f"{where}: falta el campo '{key}'")
    if "id" in rec and not isinstance(rec["id"], str):
        errors.append(f"{where}: id debe ser texto")
    elif "id" in rec:
        if not ID_RE.match(rec["id"]):
            errors.append(f"{where}: el id debe ser kebab-case con prefijo moon-, mars- o earth-")
        if rec["id"] in seen:
            errors.append(f"{where}: id repetido")
        seen.add(rec["id"])

    body = rec.get("body")
    if kind == "sitio" and body not in ("moon", "mars"):
        errors.append(f"{where}: body debe ser 'moon' o 'mars'")
    if kind == "candidato" and body != "earth":
        errors.append(f"{where}: body debe ser 'earth'")

    for coord, lo, hi in (("lat", -90, 90), ("lon", -360, 360)):
        v = rec.get(coord)
        if v is not None and not (is_number(v) and lo <= v <= hi):
            errors.append(f"{where}: {coord} fuera de rango o no numerico ({v})")
        if coord not in rec:
            warnings.append(f"{where}: falta {coord} (usa null si aun no lo tienes)")

    variables = rec.get("variables", {})
    sources = rec.get("sources", {})
    if not isinstance(variables, dict):
        errors.append(f"{where}: variables debe ser un objeto JSON")
        variables = {}
    if not isinstance(sources, dict):
        errors.append(f"{where}: sources debe ser un objeto JSON")
        sources = {}
    for var, value in variables.items():
        if var not in VARIABLES:
            errors.append(f"{where}: variable desconocida '{var}'")
            continue
        if value is None:
            continue
        if not is_number(value):
            errors.append(f"{where}: {var} debe ser numero o null ({value!r})")
            continue
        if var in NON_NEGATIVE and value < 0:
            errors.append(f"{where}: {var} no puede ser negativo ({value})")
        if var == "albedo" and not (0 <= value <= 1):
            errors.append(f"{where}: albedo debe estar entre 0 y 1 ({value})")
        source = sources.get(var)
        if not isinstance(source, str) or not source.strip():
            errors.append(f"{where}: {var} tiene valor pero no tiene fuente en 'sources'")
    missing = [v for v in VARIABLES if variables.get(v) is None]
    if missing:
        warnings.append(f"{where}: sin dato para {', '.join(missing)}")

    tags = rec.get("tags")
    if not isinstance(tags, list) or not tags:
        warnings.append(f"{where}: faltan tags (vocabulario en CONTEXT.md, seccion 5)")
    else:
        for t in tags:
            if not isinstance(t, str) or t not in TAGS:
                errors.append(f"{where}: tag desconocido '{t}'")

    if kind == "candidato":
        if not isinstance(rec.get("known"), bool):
            errors.append(f"{where}: known debe ser true o false (true si la literatura ya lo documenta como analogo)")
        if not isinstance(rec.get("is_bolivia"), bool):
            errors.append(f"{where}: is_bolivia debe ser true o false")
        if not rec.get("country"):
            errors.append(f"{where}: falta country")
        if not isinstance(rec.get("analog_for"), list) or not rec.get("analog_for"):
            warnings.append(f"{where}: analog_for deberia ser una lista con 'moon' y/o 'mars'")
        if not rec.get("why"):
            warnings.append(f"{where}: falta why (una frase de por que es analogo)")


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--data", default="data")
    args = parser.parse_args()
    data_dir = Path(args.data)

    errors, warnings = [], []
    for filename, kind in (("sites.json", "sitio"), ("candidates.json", "candidato")):
        path = data_dir / filename
        try:
            with open(path, encoding="utf-8") as f:
                records = json.load(f)
        except FileNotFoundError:
            errors.append(f"No existe {path}")
            continue
        except json.JSONDecodeError as e:
            errors.append(f"{path}: JSON invalido ({e})")
            continue
        if not isinstance(records, list):
            errors.append(f"{path}: debe ser una lista")
            continue
        if not records:
            warnings.append(f"{filename}: catalogo vacio; no se puede generar el ranking")
        seen = set()
        for rec in records:
            check_record(rec, kind, errors, warnings, seen)
        print(f"{filename}: {len(records)} registros")
        if kind == "candidato" and records:
            candidates = [r for r in records if isinstance(r, dict)]
            known = sum(1 for r in candidates if r.get("known") is True)
            bol = sum(1 for r in candidates if r.get("is_bolivia") is True)
            print(f"  conocidos: {known}, poco estudiados: {len(candidates) - known}, de Bolivia: {bol}")
            if len(candidates) < 40 or known < 12 or len(candidates) - known < 25 or bol < 8:
                warnings.append("metas de candidatos: 40 o mas en total, 12 o mas conocidos, 25 o mas poco estudiados y 8 o mas de Bolivia")

    for w in warnings:
        print(f"AVISO  {w}")
    for e in errors:
        print(f"ERROR  {e}")
    print(f"\n{len(errors)} errores, {len(warnings)} avisos")
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
