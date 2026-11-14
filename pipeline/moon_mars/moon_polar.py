#!/usr/bin/env python3
"""Pendiente, relieve y temperatura media de sitios del polo sur lunar.

Fuentes (se leen por HTTP Range, sin descargar los archivos completos):
- Elevacion: LOLA LDEM_75S_240M (LRO-L-LOLA-4-GDR-V1.0), estereografica polar, 240 m/px.
- Temperatura: Diviner Polar Resource Product sur (LRO-L-DLRE-5-PRP-V2.0), columna
  temp_avg: temperatura media anual a 2 cm de profundidad, segun la etiqueta del producto;
  ice_depth: profundidad a la que el hielo de agua seria estable segun el modelo termico.
- Albedo: LOLA LDAM_50S_1000M_FLOAT (LRO-L-LOLA-4-GDR-V1.0), albedo normal a 1064 nm
  (Lemelin et al. 2016), estereografica polar, 1000 m/px. Es reflectancia en una sola
  longitud de onda, no albedo solar de banda ancha.

La ventana es un cuadrado de WINDOW_KM x WINDOW_KM en el suelo, alineado con la
cuadricula de LOLA. Las coordenadas son planetocentricas, longitud este (Mean Earth/Polar Axis, DE421).

Uso:
    python pipeline/moon_mars/moon_polar.py
"""
import json
import math
import struct
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from terrain import WINDOW_KM, Grid, fetch_range, mean_slope_deg, relief_std_m  # noqa: E402

MOON_RADIUS_M = 1737400.0

LOLA_URL = ("https://pds-geosciences.wustl.edu/lro/lro-l-lola-3-rdr-v1/lrolol_1xxx/"
            "data/lola_gdr/polar/img/ldem_75s_240m.img")
LOLA_N = 3812
LOLA_SCALE_M = 240.0
LOLA_DN_TO_M = 0.5

LDAM_URL = ("https://pds-geosciences.wustl.edu/lro/lro-l-lola-3-rdr-v1/lrolol_1xxx/"
            "data/lola_gdr/polar/float_img/ldam_50s_1000m_float.img")
LDAM_N = 2532
LDAM_SCALE_M = 1000.0

DIVINER_URL = ("https://pds-geosciences.wustl.edu/lro/urn-nasa-pds-lro_diviner_derived1/"
               "data_derived_prp/dlre_prp_south.tab")
DIVINER_ROW_BYTES = 210
DIVINER_CELLS = 1200
DIVINER_HALF_KM = 300.0
DIVINER_MARGIN_CELLS = 15
DIVINER_MISSING = -999.0
KELVIN_TO_C = 273.15
PARALLEL_REQUESTS = 8
ICE_DEPTH_MAX_M = 1.0

# Centros de los mosaicos NAC de cada region (LROC RDR, data.lroc.im-ldi.com/lroc/view_rdr/<id>).
SITES: dict[str, tuple[float, float]] = {
    "moon-faustini-rim-a": (-87.8, 90.0),          # NAC_ROI_FAUSTINILOC
    "moon-peak-near-cabeus-b": (-83.6, 291.2),     # NAC_ROI_CABEUSPKLOB
    "moon-malapert-massif": (-86.0, 0.3),          # NAC_ROI_MALAPERTLOA
}


def stereo_xy(lat: float, lon: float) -> tuple[float, float]:
    """Coordenadas X, Y en metros de la estereografica polar sur de LOLA.

    La formula de DSMAP_POLAR.CAT invierte el signo de X en el sur. Esta orientacion
    (longitud 0 arriba, 90 E a la derecha) se verifico contra las altitudes Kaguya de la
    tabla de Diviner (diferencias menores a 100 m) y el fondo del crater Shackleton.
    """
    r = 2 * MOON_RADIUS_M * math.tan(math.radians(90 - abs(lat)) / 2)
    return r * math.sin(math.radians(lon)), -r * math.cos(math.radians(lon))


def scale_factor(lat: float) -> float:
    """Factor de escala de la estereografica polar: distancia en el mapa / distancia en el suelo."""
    return 2 / (1 + abs(math.sin(math.radians(lat))))


def lola_window(lat: float, lon: float) -> tuple[Grid, float]:
    """Recorte de elevacion (m) en la ventana y tamano de celda en el suelo (m)."""
    k = scale_factor(lat)
    n_px = round(WINDOW_KM * 1000 * k / LOLA_SCALE_M)
    x, y = stereo_xy(lat, lon)
    sample = round(x / LOLA_SCALE_M + LOLA_N / 2 + 0.5)
    line = round(y / LOLA_SCALE_M + LOLA_N / 2 + 0.5)
    first_sample = sample - n_px // 2
    first_line = line - n_px // 2
    offsets = [((ln - 1) * LOLA_N + (first_sample - 1)) * 2 for ln in range(first_line, first_line + n_px)]
    with ThreadPoolExecutor(max_workers=PARALLEL_REQUESTS) as pool:
        rows = pool.map(lambda offset: fetch_range(LOLA_URL, offset, n_px * 2), offsets)
    grid: Grid = [[dn * LOLA_DN_TO_M for dn in struct.unpack(f"<{n_px}h", raw)] for raw in rows]
    return grid, LOLA_SCALE_M / k


def ldam_window_mean(lat: float, lon: float) -> tuple[float, int]:
    """Promedio del albedo normal a 1064 nm de LOLA en la ventana, y cuantos pixeles validos hay."""
    k = scale_factor(lat)
    n_px = max(1, round(WINDOW_KM * 1000 * k / LDAM_SCALE_M))
    x, y = stereo_xy(lat, lon)
    sample = round(x / LDAM_SCALE_M + LDAM_N / 2 + 0.5)
    line = round(y / LDAM_SCALE_M + LDAM_N / 2 + 0.5)
    first_sample = sample - n_px // 2
    first_line = line - n_px // 2
    values: list[float] = []
    for ln in range(first_line, first_line + n_px):
        raw = fetch_range(LDAM_URL, ((ln - 1) * LDAM_N + (first_sample - 1)) * 4, n_px * 4)
        values.extend(v for v in struct.unpack(f"<{n_px}f", raw) if math.isfinite(v) and v > 0)
    if not values:
        raise ValueError(f"LDAM sin pixeles validos en la ventana de ({lat}, {lon})")
    return sum(values) / len(values), len(values)


def diviner_window(lat: float, lon: float) -> tuple[float, int, float]:
    """Triangulos de Diviner cuyo centro cae en la ventana.

    Devuelve el promedio de temp_avg (K), cuantos triangulos hay y la fraccion de ellos
    donde el modelo de Diviner da hielo de agua estable a ICE_DEPTH_MAX_M o menos.
    """
    k = scale_factor(lat)
    half_map_m = WINDOW_KM * 1000 * k / 2
    x0, y0 = stereo_xy(lat, lon)
    rho_km = MOON_RADIUS_M / 1000 * math.cos(math.radians(lat))
    body_x = rho_km * math.cos(math.radians(lon))
    body_y = rho_km * math.sin(math.radians(lon))
    i_center = int((DIVINER_HALF_KM - body_x) / 0.5)
    j_center = int((body_y + DIVINER_HALF_KM) / 0.5)
    span = int(WINDOW_KM / 0.5 / 2) + DIVINER_MARGIN_CELLS
    j_first = max(0, j_center - span)
    j_last = min(DIVINER_CELLS - 1, j_center + span)
    n_records = 2 * (j_last - j_first + 1)
    offsets = [DIVINER_ROW_BYTES * (1 + 2 * (i * DIVINER_CELLS + j_first))
               for i in range(max(0, i_center - span), min(DIVINER_CELLS - 1, i_center + span) + 1)]
    with ThreadPoolExecutor(max_workers=PARALLEL_REQUESTS) as pool:
        chunks = pool.map(lambda offset: fetch_range(DIVINER_URL, offset, DIVINER_ROW_BYTES * n_records), offsets)
    temps: list[float] = []
    shallow_ice = 0
    for raw in chunks:
        for row in raw.decode("ascii").splitlines():
            cols = row.split(",")
            clon, clat, temp, ice_depth = float(cols[9]), float(cols[10]), float(cols[12]), float(cols[14])
            if temp == DIVINER_MISSING:
                continue
            tx, ty = stereo_xy(clat, clon)
            if abs(tx - x0) <= half_map_m and abs(ty - y0) <= half_map_m:
                temps.append(temp)
                if ice_depth != DIVINER_MISSING and ice_depth <= ICE_DEPTH_MAX_M:
                    shallow_ice += 1
    if not temps:
        raise ValueError(f"Diviner sin triangulos en la ventana de ({lat}, {lon})")
    return sum(temps) / len(temps), len(temps), shallow_ice / len(temps)


def main() -> None:
    results: dict[str, dict[str, float | int]] = {}
    for site_id, (lat, lon) in SITES.items():
        grid, cell_m = lola_window(lat, lon)
        temp_k, n_triangles, ice_fraction = diviner_window(lat, lon)
        albedo_1064, ldam_pixels = ldam_window_mean(lat, lon)
        results[site_id] = {
            "lat": lat,
            "lon": lon,
            "slope_deg": round(mean_slope_deg(grid, cell_m, cell_m), 2),
            "relief_m": round(relief_std_m(grid), 1),
            "temp_mean_c": round(temp_k - KELVIN_TO_C, 1),
            "lola_pixels": len(grid) * len(grid[0]),
            "lola_cell_m": round(cell_m, 1),
            "diviner_triangles": n_triangles,
            "diviner_ice_stable_1m_fraction": round(ice_fraction, 3),
            "albedo_lola_1064nm": round(albedo_1064, 3),
            "ldam_pixels": ldam_pixels,
        }
        print(f"{site_id}: listo", file=sys.stderr)
    print(json.dumps(results, indent=2))


if __name__ == "__main__":
    main()
