#!/usr/bin/env python3
"""Genera data/candidates.json a partir de pipeline/earth/seed.json.

Solo biblioteca estandar. El seed es la lista curada a mano (lugar, coordenadas con su fuente,
`known`, etiquetas y referencias con respaldo citable). Este script agrega las cinco variables
numericas con su fuente exacta:

- slope_deg y relief_m: pipeline/earth/terrain_tiles.py (Terrain Tiles de Mapzen en AWS).
- temp_mean_c, precip_mm_year y albedo: pipeline/earth/power.py (NASA POWER).

Un valor que no se consigue queda en `null` con su motivo en `notes`. Nada se inventa.

Uso:
    python pipeline/earth/build_candidates.py                 # escribe data/candidates.json
    python pipeline/earth/build_candidates.py --out otra.json
"""
import argparse
import json
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from power import climate_variables  # noqa: E402
from terrain_tiles import terrain_variables  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
SEED = Path(__file__).with_name("seed.json")
POWER_DOCS = "https://power.larc.nasa.gov/docs/services/api/temporal/climatology/"
TILES_DOCS = "https://registry.opendata.aws/terrain-tiles/"
SEARCH_DATE = "14/11/2026"
# Diferencia de elevacion (m) entre la celda de POWER y el punto a partir de la cual se avisa de sesgo.
ELEVATION_GAP_WARN_M = 500

NULL_REASONS = {
    "coarse": "las teselas de elevacion solo aportaron modelos globales gruesos ({models}), que no resuelven una ventana de 10 x 10 km",
    "marine": "la ventana de 10 x 10 km incluye mar y la batimetria de ETOPO1 ({models}) distorsionaria pendiente y relieve",
}


def terrain_source(kind: str, models: list[str]) -> str:
    what = "pendiente media de Horn (3 x 3)" if kind == "slope" else "desviacion estandar poblacional de la elevacion"
    return (
        f"Terrain Tiles de Mapzen en AWS (Terrarium, zoom 10), compuesto de: {', '.join(models)} ({TILES_DOCS}); "
        f"{what} en ventana de 10 x 10 km a 250 m, calculada con pipeline/earth/terrain_tiles.py"
    )


def auto_why(variables: dict) -> str:
    """Razon basada en los valores de este catalogo, para candidatos sin estudio de analogo."""
    parts = []
    if variables["precip_mm_year"] is not None:
        parts.append(f"{variables['precip_mm_year']:g} mm/ano de precipitacion")
    if variables["temp_mean_c"] is not None:
        parts.append(f"{variables['temp_mean_c']:g} °C de temperatura media de superficie")
    if variables["relief_m"] is not None:
        parts.append(f"{variables['relief_m']:g} m de relieve local")
    detail = ", ".join(parts) if parts else "sin datos suficientes"
    return f"Propuesto por sus valores en este catalogo ({detail}); no se encontro un estudio previo como analogo planetario."


def build_record(seed: dict) -> dict:
    lat, lon = seed["lat"], seed["lon"]
    terrain = terrain_variables(lat, lon, seed.get("land_below_sea_level", False))
    climate = climate_variables(lat, lon)
    models = terrain["imagery_sources"]
    period = climate["period"].split("(")[-1].rstrip(")")

    sources: dict[str, str] = {}
    if terrain["slope_deg"] is not None:
        sources["slope_deg"] = terrain_source("slope", models)
        sources["relief_m"] = terrain_source("relief", models)
    if climate["temp_mean_c"] is not None:
        sources["temp_mean_c"] = (
            f"NASA POWER, climatologia {period}, parametro TS (Earth Skin Temperature, temperatura de superficie), "
            f"media anual en °C, MERRA-2 ({POWER_DOCS})"
        )
    if climate["precip_mm_year"] is not None:
        sources["precip_mm_year"] = (
            "NASA POWER, parametro PRECTOTCORR (precipitacion corregida), media anual en mm/dia x 365,25, "
            f"MERRA-2 ({POWER_DOCS})"
        )
    if climate["albedo"] is not None:
        sources["albedo"] = (
            f"NASA POWER, parametro ALLSKY_SRF_ALB (albedo de superficie en todo cielo), CERES SYN1deg ({POWER_DOCS})"
        )

    notes = [f"Coordenadas: {seed['coord_source']}. Son WGS84 en grados decimales y el punto representa el lugar, no toda su extension."]
    if terrain["null_reason"]:
        reason = NULL_REASONS[terrain["null_reason"]].format(models=", ".join(models))
        notes.append(f"Pendiente y relieve: null, {reason}.")
    else:
        notes.append(
            f"Elevacion en el centro: {terrain['elevation_center_m']:.0f} m. Pendiente y relieve en ventana de 10 x 10 km "
            f"a 250 m con interpolacion bilineal; modelos de elevacion: {', '.join(models)}."
        )
    notes.append(
        "Temperatura, precipitacion y albedo vienen de NASA POWER con resolucion nativa de decenas de km (MERRA-2 de unos "
        "0,5 x 0,625 grados y CERES SYN1deg de 1 grado), mucho mas gruesa que la ventana de 10 km: describen la region, no el "
        f"punto. La celda de POWER tiene {climate['grid_elevation_m']:.0f} m de elevacion. El albedo incluye vegetacion, nieve y "
        "agua; no es comparable de forma directa con el de suelo desnudo de Marte."
    )
    gap = terrain["elevation_center_m"] - climate["grid_elevation_m"]
    if abs(gap) > ELEVATION_GAP_WARN_M:
        notes.append(
            f"ATENCION: el punto esta {abs(gap):.0f} m {'por encima' if gap > 0 else 'por debajo'} de la celda de POWER "
            "(elevacion de la celda frente a la del terreno); la temperatura y la precipitacion probablemente no representan "
            "el punto y no se corrigieron."
        )
    if seed["known"]:
        notes.append("known=true: las referencias citadas documentan el lugar (o su region) como analogo planetario.")
    else:
        notes.append(
            f"known=false: en una busqueda en Crossref del {SEARCH_DATE} no se encontro un estudio de analogo planetario de este "
            "lugar; falta una revision bibliografica completa (a verificar)."
        )
    if seed.get("note_extra"):
        notes.append(seed["note_extra"] + ".")

    variables = {
        "slope_deg": terrain["slope_deg"],
        "relief_m": terrain["relief_m"],
        "temp_mean_c": climate["temp_mean_c"],
        "precip_mm_year": climate["precip_mm_year"],
        "albedo": climate["albedo"],
    }
    return {
        "id": seed["id"],
        "body": "earth",
        "name": seed["name"],
        "country": seed["country"],
        "is_bolivia": seed["is_bolivia"],
        "known": seed["known"],
        "analog_for": seed["analog_for"],
        "why": seed["why"] or auto_why(variables),
        "reference_urls": seed["references"],
        "lat": lat,
        "lon": lon,
        "variables": variables,
        "sources": sources,
        "notes": " ".join(notes),
        "tags": seed["tags"],
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--out", default=str(ROOT / "data" / "candidates.json"))
    args = parser.parse_args()

    seeds = json.loads(SEED.read_text(encoding="utf-8"))
    records = []
    for index, seed in enumerate(seeds, 1):
        record = build_record(seed)
        records.append(record)
        v = record["variables"]
        print(
            f"[{index:02d}/{len(seeds)}] {record['id']}: pend={v['slope_deg']} rel={v['relief_m']} "
            f"T={v['temp_mean_c']} P={v['precip_mm_year']} alb={v['albedo']}"
        )
        time.sleep(0.2)
    Path(args.out).write_text(json.dumps(records, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Escrito {args.out} con {len(records)} candidatos.")


if __name__ == "__main__":
    main()
