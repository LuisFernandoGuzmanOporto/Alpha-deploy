#!/usr/bin/env python3
"""Pendiente, relieve, temperatura media y albedo de sitios de Marte.

Fuentes:
- Elevacion: MGS MOLA MEGDR 128 px/grado (MGS-M-MOLA-5-MEGDR-L3-V1.0), cilindrica simple,
  unos 463 m por pixel. Se lee por HTTP Range, sin descargar las teselas completas.
- Temperatura de superficie y albedo: Mars Climate Database v6.2 (LMD/OU/IAA/ESA/CNES),
  escenario climatologico promedio, por su interfaz web publica.

La ventana es un cuadrado de WINDOW_KM x WINDOW_KM en el suelo. Coordenadas planetocentricas,
longitud este de 0 a 360.

Uso:
    python pipeline/moon_mars/mars_sites.py
"""
import json
import math
import re
import struct
import sys
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from terrain import USER_AGENT, WINDOW_KM, Grid, fetch_range, mean_slope_deg, relief_std_m  # noqa: E402

MARS_RADIUS_M = 3396190.0

MOLA_BASE = "https://pds-geosciences.wustl.edu/mgs/mgs-m-mola-5-megdr-l3-v1/mgsl_300x/meg128/"
MOLA_PPD = 128
MOLA_TILE_LAT_DEG = 44
MOLA_TILE_LON_DEG = 90
MOLA_TILE_TOPS = (88, 44, 0, -44)
MOLA_SAMPLES = MOLA_TILE_LON_DEG * MOLA_PPD

MCD_BASE = "https://www-mars.lmd.jussieu.fr/mcd_python/"
MCD_TIMEOUT_S = 300
KELVIN_TO_C = 273.15
PARALLEL_REQUESTS = 8

SITES: dict[str, tuple[float, float]] = {
    "mars-jezero": (18.4447, 77.4508),          # Octavia E. Butler Landing (Perseverance)
    "mars-gale": (-4.5895, 137.4417),           # Bradbury Landing (Curiosity), Vasavada et al. 2014
    "mars-arcadia-planitia": (49.02, 188.15),   # Centro IAU, Gazetteer of Planetary Nomenclature
}


def mola_tile(lat: float, lon: float) -> tuple[str, int, int]:
    """Archivo MEGDR que contiene el punto, con su latitud superior y longitud oeste."""
    top = next(t for t in MOLA_TILE_TOPS if t - MOLA_TILE_LAT_DEG <= lat < t)
    west = int(lon // MOLA_TILE_LON_DEG) * MOLA_TILE_LON_DEG
    hemi = "n" if top >= 0 else "s"
    return f"{MOLA_BASE}megt{abs(top):02d}{hemi}{west:03d}hb.img", top, west


def mola_window(lat: float, lon: float) -> tuple[Grid, float, float]:
    """Recorte de elevacion (m) y tamano de celda en el suelo en x e y (m)."""
    url, top, west = mola_tile(lat, lon)
    cell_y_m = MARS_RADIUS_M * math.radians(1 / MOLA_PPD)
    cell_x_m = cell_y_m * math.cos(math.radians(lat))
    n_lines = round(WINDOW_KM * 1000 / cell_y_m)
    n_samples = round(WINDOW_KM * 1000 / cell_x_m)
    line = int((top - lat) * MOLA_PPD)
    sample = int((lon - west) * MOLA_PPD)
    first_line = line - n_lines // 2
    first_sample = sample - n_samples // 2
    if first_line < 0 or first_sample < 0 or first_sample + n_samples > MOLA_SAMPLES:
        raise ValueError(f"La ventana de ({lat}, {lon}) cruza el borde de la tesela {url}")
    offsets = [(ln * MOLA_SAMPLES + first_sample) * 2 for ln in range(first_line, first_line + n_lines)]
    with ThreadPoolExecutor(max_workers=PARALLEL_REQUESTS) as pool:
        rows = pool.map(lambda offset: fetch_range(url, offset, n_samples * 2), offsets)
    grid: Grid = [list(map(float, struct.unpack(f">{n_samples}h", raw))) for raw in rows]
    return grid, cell_x_m, cell_y_m


def mcd_page(lat: float, lon: float, var: str, ls: str, localtime: str) -> str:
    """Respuesta HTML de la interfaz web de la MCD para una variable."""
    query = urllib.parse.urlencode({
        "var1": var, "var2": "none", "var3": "none", "var4": "none", "datekeyhtml": "1",
        "ls": ls, "localtime": localtime, "latitude": lat, "longitude": lon,
        "altitude": "10.", "zkey": "3", "isfixedlt": "off", "dust": "1", "hrkey": "1",
        "averaging": "off", "zonmean": "off", "diumean": "off", "dpi": "80",
        "islog": "off", "colorm": "jet", "proj": "cyl", "iswind": "off",
    })
    return _get(f"{MCD_BASE}cgi-bin/mcdcgi.py?{query}")


def mcd_table(lat: float, lon: float, var: str) -> list[list[float]]:
    """Tabla anual de la MCD: filas por longitud solar (Ls) y columnas por hora local."""
    page = mcd_page(lat, lon, var, "all", "all")
    match = re.search(r"href='\.\./(txt/[0-9a-f]+\.txt)'", page)
    if not match:
        raise IOError(f"La MCD no devolvio archivo de datos para ({lat}, {lon}, {var})")
    rows: list[list[float]] = []
    for line in _get(MCD_BASE + match.group(1)).splitlines():
        if line.startswith(("#", "-")) or "||" not in line:
            continue
        rows.append([float(v) for v in line.split("||")[1].split()])
    return rows


def mcd_annual_mean_tsurf_k(lat: float, lon: float) -> float:
    """Media de la temperatura de superficie sobre Ls 0-345 (cada 15) y horas 0-23."""
    table = mcd_table(lat, lon, "tsurf")
    by_ls = [row[:24] for row in table[:24]]
    return sum(sum(row) for row in by_ls) / (24 * len(by_ls))


def mcd_albedo(lat: float, lon: float) -> float:
    """Albedo de suelo desnudo que usa el modelo de la MCD (no cambia con la estacion)."""
    page = mcd_page(lat, lon, "ground_albedo", "0", "12")
    match = re.search(r"bare ground albedo \.+ ([0-9.]+)", page)
    if not match:
        raise IOError(f"La MCD no devolvio albedo para ({lat}, {lon})")
    return float(match.group(1))


def _get(url: str) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=MCD_TIMEOUT_S) as response:
        return response.read().decode("utf-8", errors="replace")


def main() -> None:
    results: dict[str, dict[str, float | int]] = {}
    for site_id, (lat, lon) in SITES.items():
        grid, cell_x_m, cell_y_m = mola_window(lat, lon)
        results[site_id] = {
            "lat": lat,
            "lon": lon,
            "slope_deg": round(mean_slope_deg(grid, cell_x_m, cell_y_m), 2),
            "relief_m": round(relief_std_m(grid), 1),
            "temp_mean_c": round(mcd_annual_mean_tsurf_k(lat, lon) - KELVIN_TO_C, 1),
            "albedo": round(mcd_albedo(lat, lon), 3),
            "mola_pixels": len(grid) * len(grid[0]),
            "mola_cell_x_m": round(cell_x_m, 1),
            "mola_cell_y_m": round(cell_y_m, 1),
        }
        print(f"{site_id}: listo", file=sys.stderr)
    print(json.dumps(results, indent=2))


if __name__ == "__main__":
    main()
