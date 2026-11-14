#!/usr/bin/env python3
"""Calcula el indice de similitud entre sitios extraterrestres y candidatos terrestres.

Solo usa la biblioteca estandar de Python.

Uso:
    python pipeline/similarity.py                       # usa data/ y escribe en web/public/data/
    python pipeline/similarity.py --data data/examples  # usa los datos de demostracion
    python pipeline/similarity.py --out-dir /tmp/salida

Metodo (ver CONTEXT.md, seccion 7 y docs/METODOLOGIA.md):
    1. Transformar cada variable (log1p en LOG_VARIABLES).
    2. Normalizar entre 0 y 1 con el minimo y el maximo de todos los registros juntos.
    3. Diferencia absoluta por variable entre el sitio y el candidato.
    4. Distancia = promedio ponderado de las diferencias de las variables disponibles en ambos.
    5. score = 100 * (1 - distancia). Se exige un minimo de MIN_VARS variables por par.
"""
import argparse
import json
import math
import shutil
import sys
from datetime import datetime, timezone
from pathlib import Path

VARIABLES = ["slope_deg", "relief_m", "temp_mean_c", "precip_mm_year", "albedo"]
WEIGHTS = {v: 1.0 for v in VARIABLES}  # pesos iguales al inicio; Sebastian los ajusta y documenta
LOG_VARIABLES = ["relief_m", "precip_mm_year"]  # rango muy amplio: se usa log1p
MIN_VARS = 3  # variables minimas disponibles en ambos para entrar al ranking


def load_json(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def transform(var, value):
    if value is None:
        return None
    if var in LOG_VARIABLES:
        if value < 0:
            raise ValueError(f"{var} no puede ser negativo para aplicar log1p: {value}")
        return math.log1p(value)
    return float(value)


def compute_ranges(records):
    """Minimo y maximo (en espacio transformado) por variable, sobre todos los registros."""
    ranges = {}
    for var in VARIABLES:
        values = [
            transform(var, r["variables"].get(var))
            for r in records
            if r["variables"].get(var) is not None
        ]
        if not values:
            ranges[var] = None
            continue
        lo, hi = min(values), max(values)
        ranges[var] = (lo, hi)
    return ranges


def normalize(var, value, ranges):
    if value is None or ranges.get(var) is None:
        return None
    lo, hi = ranges[var]
    if hi == lo:
        return 0.0
    return (transform(var, value) - lo) / (hi - lo)


def score_pair(site, cand, ranges, weights):
    """Devuelve (score, n_vars_usadas, diferencias_normalizadas) o None si faltan variables."""
    diffs = {}
    for var in VARIABLES:
        s = normalize(var, site["variables"].get(var), ranges)
        c = normalize(var, cand["variables"].get(var), ranges)
        if s is None or c is None:
            continue
        diffs[var] = abs(s - c)
    if len(diffs) < MIN_VARS:
        return None
    total_w = sum(weights[v] for v in diffs)
    if total_w == 0:
        return None
    distance = sum(weights[v] * d for v, d in diffs.items()) / total_w
    score = round(100 * (1 - distance), 1)
    return score, len(diffs), {v: round(d, 4) for v, d in diffs.items()}


def tag_overlap(site, cand):
    """Coincidencia cualitativa (indice de Jaccard) entre las etiquetas de un sitio y un candidato."""
    s = set(site.get("tags") or [])
    c = set(cand.get("tags") or [])
    if not s or not c:
        return None
    shared = s & c
    return {
        "jaccard": round(len(shared) / len(s | c), 3),
        "shared": sorted(shared),
        "only_site": sorted(s - c),
        "only_candidate": sorted(c - s),
    }


def build_results(sites, candidates, weights=None):
    weights = weights or WEIGHTS
    ranges = compute_ranges(sites + candidates)
    out = {
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "variables": VARIABLES,
        "weights": weights,
        "log_variables": LOG_VARIABLES,
        "ranges": {v: (list(r) if r else None) for v, r in ranges.items()},
        "sites": {},
    }
    for site in sites:
        ranking = []
        for cand in candidates:
            res = score_pair(site, cand, ranges, weights)
            if res is None:
                continue
            score, n_used, norm_diff = res
            ranking.append(
                {
                    "candidate_id": cand["id"],
                    "score": score,
                    "n_vars_used": n_used,
                    "norm_diff": norm_diff,
                    "tag_overlap": tag_overlap(site, cand),
                }
            )
        ranking.sort(key=lambda x: x["score"], reverse=True)
        out["sites"][site["id"]] = ranking
    return out


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--data", default="data", help="carpeta con sites.json y candidates.json")
    parser.add_argument("--out-dir", default="web/public/data", help="carpeta de salida para la web")
    args = parser.parse_args()

    data_dir = Path(args.data)
    out_dir = Path(args.out_dir)
    sites = load_json(data_dir / "sites.json")
    candidates = load_json(data_dir / "candidates.json")

    if not sites or not candidates:
        print("Aviso: sites.json o candidates.json estan vacios; no hay nada que calcular.", file=sys.stderr)
        sys.exit(1)

    results = build_results(sites, candidates)
    out_dir.mkdir(parents=True, exist_ok=True)
    with open(out_dir / "results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    # La web solo lee web/public/data: copiamos los datos de entrada junto con los resultados.
    shutil.copyfile(data_dir / "sites.json", out_dir / "sites.json")
    shutil.copyfile(data_dir / "candidates.json", out_dir / "candidates.json")

    names = {c["id"]: c["name"] for c in candidates}
    by_id = {c["id"]: c for c in candidates}
    print(f"Escrito {out_dir / 'results.json'}")
    for site in sites:
        top = results["sites"][site["id"]][:3]
        resumen = ", ".join(f"{names[t['candidate_id']]} ({t['score']})" for t in top) or "sin candidatos con datos suficientes"
        print(f"  {site['name']}: {resumen}")
        nuevos = [e for e in results["sites"][site["id"]] if by_id[e["candidate_id"]].get("known") is False][:3]
        if nuevos:
            print("    poco estudiados: " + ", ".join(f"{names[e['candidate_id']]} ({e['score']})" for e in nuevos))


if __name__ == "__main__":
    main()
