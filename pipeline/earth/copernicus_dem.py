"""Pendiente y relieve con Copernicus DEM GLO-30 (ESA) para los lugares donde Terrain Tiles no sirve.

Solo biblioteca estandar. Copernicus DEM GLO-30 es un modelo digital de superficie global de
30 m (3 segundos de arco) publicado en AWS Open Data (https://registry.opendata.aws/copernicus-dem/),
un mosaico por grado en GeoTIFF con teselas de 1024 x 1024, compresion DEFLATE y predictor de coma
flotante. Se usa en los lugares donde las teselas de Mapzen solo traen modelos globales gruesos
(Antartida y Svalbard) o mezclan batimetria de ETOPO1 (costas).

Metodo (el mismo de pipeline/earth/terrain_tiles.py, CONTEXT.md seccion 5): cuadricula de 41 x 41
puntos separados 250 m (ventana de 10 x 10 km) con interpolacion bilineal, pendiente media de Horn
(3 x 3, pixeles interiores) y relieve como desviacion estandar poblacional de la elevacion.

Con `land_only` la ventana puede incluir mar: el modelo da 0 m sobre el agua, asi que el mar se
excluye. El relieve se calcula con los puntos de tierra y la pendiente solo donde los 9 puntos del
vecindario son de tierra; se informa la fraccion de tierra de la ventana.
"""
import math
import struct
import sys
import urllib.request
import zlib
from itertools import accumulate
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "moon_mars"))
from terrain import USER_AGENT, WINDOW_KM, Grid, mean_slope_deg, relief_std_m  # noqa: E402
from terrain_tiles import CELL_M, _meters_per_degree  # noqa: E402

DEM_URL = "https://copernicus-dem-30m.s3.amazonaws.com/{name}/{name}.tif"
DOCS = "https://registry.opendata.aws/copernicus-dem/"
CACHE_DIR = Path(__file__).resolve().parents[2] / "data" / "raw" / "copernicus_dem"
# Por debajo de esta elevacion interpolada (m) un punto se considera mar. El modelo vale 0 sobre el agua.
SEA_LEVEL_M = 1.0
# Fraccion minima de tierra en la ventana para publicar pendiente y relieve.
MIN_LAND_FRACTION = 0.25

TAG_WIDTH, TAG_HEIGHT, TAG_BITS, TAG_COMPRESSION = 256, 257, 258, 259
TAG_PREDICTOR, TAG_TILE_W, TAG_TILE_H, TAG_TILE_OFFSETS, TAG_TILE_COUNTS = 317, 322, 323, 324, 325
TAG_SAMPLE_FORMAT, TAG_PIXEL_SCALE, TAG_TIEPOINT = 339, 33550, 33922


def tile_name(lat: float, lon: float) -> str:
    """Nombre del mosaico de 1 x 1 grado que contiene el punto (esquina suroeste)."""
    south, west = math.floor(lat), math.floor(lon)
    return f"Copernicus_DSM_COG_10_{'N' if south >= 0 else 'S'}{abs(south):02d}_00_{'E' if west >= 0 else 'W'}{abs(west):03d}_00_DEM"


def _read_tags(data: bytes) -> dict[int, tuple]:
    if data[:4] != b"II*\x00":
        raise ValueError("se esperaba un TIFF clasico little-endian")
    (ifd,) = struct.unpack("<I", data[4:8])
    (count,) = struct.unpack("<H", data[ifd : ifd + 2])
    formats = {3: ("H", 2), 4: ("I", 4), 12: ("d", 8)}
    tags: dict[int, tuple] = {}
    for i in range(count):
        entry = data[ifd + 2 + i * 12 : ifd + 14 + i * 12]
        tag, kind, n = struct.unpack("<HHI", entry[:8])
        if kind not in formats:
            continue
        code, size = formats[kind]
        if size * n <= 4:
            raw = entry[8 : 8 + size * n]
        else:
            (offset,) = struct.unpack("<I", entry[8:12])
            raw = data[offset : offset + size * n]
        tags[tag] = struct.unpack("<" + code * n, raw)
    return tags


class DemFile:
    """Un mosaico de Copernicus DEM GLO-30: lee y decodifica sus teselas cuando hacen falta."""

    def __init__(self, name: str) -> None:
        CACHE_DIR.mkdir(parents=True, exist_ok=True)
        path = CACHE_DIR / f"{name}.tif"
        if not path.exists():
            request = urllib.request.Request(DEM_URL.format(name=name), headers={"User-Agent": USER_AGENT})
            with urllib.request.urlopen(request, timeout=300) as response:
                path.write_bytes(response.read())
        self.data = path.read_bytes()
        tags = _read_tags(self.data)
        if tags[TAG_COMPRESSION] != (8,) or tags[TAG_PREDICTOR] != (3,) or tags[TAG_BITS] != (32,) or tags[TAG_SAMPLE_FORMAT] != (3,):
            raise ValueError(f"{name}: formato no soportado (se esperaba float32, DEFLATE y predictor 3)")
        self.width, self.height = tags[TAG_WIDTH][0], tags[TAG_HEIGHT][0]
        self.tile_w, self.tile_h = tags[TAG_TILE_W][0], tags[TAG_TILE_H][0]
        self.offsets, self.counts = tags[TAG_TILE_OFFSETS], tags[TAG_TILE_COUNTS]
        self.across = math.ceil(self.width / self.tile_w)
        self.scale_x, self.scale_y = tags[TAG_PIXEL_SCALE][0], tags[TAG_PIXEL_SCALE][1]
        self.west, self.north = tags[TAG_TIEPOINT][3], tags[TAG_TIEPOINT][4]
        self.tiles: dict[int, list[tuple[float, ...]]] = {}

    def _decode_tile(self, index: int) -> list[tuple[float, ...]]:
        raw = zlib.decompress(self.data[self.offsets[index] : self.offsets[index] + self.counts[index]])
        row_bytes = self.tile_w * 4
        rows = []
        for r in range(self.tile_h):
            # Predictor 3: diferencias byte a byte en toda la fila; luego los bytes vienen por planos (el mas significativo primero).
            row = bytes(accumulate(raw[r * row_bytes : (r + 1) * row_bytes], lambda a, b: (a + b) & 255))
            ordered = bytearray(row_bytes)
            for plane in range(4):
                ordered[plane::4] = row[plane * self.tile_w : (plane + 1) * self.tile_w]
            rows.append(struct.unpack(f">{self.tile_w}f", bytes(ordered)))
        return rows

    def pixel(self, col: int, row: int) -> float:
        col = min(max(col, 0), self.width - 1)
        row = min(max(row, 0), self.height - 1)
        index = (row // self.tile_h) * self.across + col // self.tile_w
        if index not in self.tiles:
            self.tiles[index] = self._decode_tile(index)
        return self.tiles[index][row % self.tile_h][col % self.tile_w]

    def elevation(self, lat: float, lon: float) -> float:
        """Elevacion en metros con interpolacion bilineal (centros de pixel a mitad de celda)."""
        px = (lon - self.west) / self.scale_x - 0.5
        py = (self.north - lat) / self.scale_y - 0.5
        x0, y0 = math.floor(px), math.floor(py)
        fx, fy = px - x0, py - y0
        top = self.pixel(x0, y0) * (1 - fx) + self.pixel(x0 + 1, y0) * fx
        bottom = self.pixel(x0, y0 + 1) * (1 - fx) + self.pixel(x0 + 1, y0 + 1) * fx
        return top * (1 - fy) + bottom * fy


class Dem:
    """Elevaciones en cualquier punto, abriendo el mosaico de 1 grado que corresponda."""

    def __init__(self) -> None:
        self.files: dict[str, DemFile] = {}

    def elevation(self, lat: float, lon: float) -> float:
        name = tile_name(lat, lon)
        if name not in self.files:
            self.files[name] = DemFile(name)
        return self.files[name].elevation(lat, lon)


def window_grid(dem: Dem, lat: float, lon: float) -> Grid:
    """Cuadricula de elevaciones (filas de norte a sur) de la ventana de WINDOW_KM alrededor del punto."""
    n = int(round(WINDOW_KM * 1000 / CELL_M)) + 1
    half = (n - 1) / 2
    per_lat, per_lon = _meters_per_degree(lat)
    return [
        [dem.elevation(lat + (half - row) * CELL_M / per_lat, lon + (col - half) * CELL_M / per_lon) for col in range(n)]
        for row in range(n)
    ]


def land_only_stats(grid: Grid) -> tuple[float, float, float]:
    """Pendiente media de Horn y relieve solo con puntos de tierra, y la fraccion de tierra de la ventana."""
    land = [[v > SEA_LEVEL_M for v in row] for row in grid]
    values = [v for row, mask in zip(grid, land) for v, is_land in zip(row, mask) if is_land]
    if not values:
        raise ValueError("la ventana no tiene tierra")
    mean = sum(values) / len(values)
    relief = math.sqrt(sum((v - mean) ** 2 for v in values) / len(values))
    slopes: list[float] = []
    for r in range(1, len(grid) - 1):
        for c in range(1, len(grid[0]) - 1):
            if not all(land[r + dr][c + dc] for dr in (-1, 0, 1) for dc in (-1, 0, 1)):
                continue
            z = grid
            dzdx = ((z[r - 1][c + 1] + 2 * z[r][c + 1] + z[r + 1][c + 1]) - (z[r - 1][c - 1] + 2 * z[r][c - 1] + z[r + 1][c - 1])) / (8 * CELL_M)
            dzdy = ((z[r + 1][c - 1] + 2 * z[r + 1][c] + z[r + 1][c + 1]) - (z[r - 1][c - 1] + 2 * z[r - 1][c] + z[r - 1][c + 1])) / (8 * CELL_M)
            slopes.append(math.degrees(math.atan(math.hypot(dzdx, dzdy))))
    return sum(slopes) / len(slopes), relief, len(values) / (len(grid) * len(grid[0]))


def terrain_variables(lat: float, lon: float, land_only: bool = False) -> dict:
    """Pendiente media y relieve en la ventana comun, con la misma forma que `terrain_tiles.terrain_variables`."""
    dem = Dem()
    grid = window_grid(dem, lat, lon)
    center = grid[len(grid) // 2][len(grid) // 2]
    if land_only:
        slope, relief, land_fraction = land_only_stats(grid)
        reason = "marine" if land_fraction < MIN_LAND_FRACTION else None
    else:
        slope, relief, land_fraction = mean_slope_deg(grid, CELL_M, CELL_M), relief_std_m(grid), 1.0
        reason = None
    return {
        "slope_deg": round(slope, 2) if reason is None else None,
        "relief_m": round(relief, 1) if reason is None else None,
        "elevation_center_m": round(center, 0),
        "imagery_sources": sorted(name.removeprefix("Copernicus_DSM_COG_10_").removesuffix("_DEM") for name in dem.files),
        "land_fraction": round(land_fraction, 3),
        "null_reason": reason,
    }


if __name__ == "__main__":
    import json

    if len(sys.argv) not in (3, 4):
        sys.exit("uso: python pipeline/earth/copernicus_dem.py LAT LON [--land-only]")
    print(json.dumps(terrain_variables(float(sys.argv[1]), float(sys.argv[2]), "--land-only" in sys.argv), indent=2))
