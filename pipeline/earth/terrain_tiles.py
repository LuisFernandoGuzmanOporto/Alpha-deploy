"""Pendiente y relieve de un lugar de la Tierra en la ventana comun de 10 x 10 km.

Solo biblioteca estandar. Elevacion: Terrain Tiles de Mapzen en AWS (formato Terrarium),
un compuesto global de SRTM, GMTED2010, ArcticDEM, 3DEP y otros modelos abiertos
(https://registry.opendata.aws/terrain-tiles/). Cada tesela informa en el encabezado S3
`x-amz-meta-x-imagery-sources` que modelos aporto; ese dato se conserva para citar la fuente exacta.

Metodo (igual que pipeline/moon_mars/, CONTEXT.md seccion 5): cuadricula de 41 x 41 puntos
separados 250 m (ventana de 10 x 10 km) con interpolacion bilineal, pendiente media de Horn
(3 x 3, pixeles interiores) y relieve como desviacion estandar poblacional de la elevacion.
"""
import math
import struct
import sys
import urllib.request
import zlib
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "moon_mars"))
from terrain import USER_AGENT, WINDOW_KM, Grid, mean_slope_deg, relief_std_m  # noqa: E402

TILE_URL = "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"
ZOOM = 10
TILE_SIZE = 256
CELL_M = 250.0
CACHE_DIR = Path(__file__).resolve().parents[2] / "data" / "raw" / "terrain_tiles"

Tile = list[list[float]]


def _unfilter(raw: bytes, width: int, height: int, bpp: int) -> list[bytearray]:
    stride = width * bpp
    rows: list[bytearray] = []
    prev = bytearray(stride)
    pos = 0
    for _ in range(height):
        ftype = raw[pos]
        row = bytearray(raw[pos + 1 : pos + 1 + stride])
        pos += 1 + stride
        for i in range(stride):
            a = row[i - bpp] if i >= bpp else 0
            b = prev[i]
            c = prev[i - bpp] if i >= bpp else 0
            if ftype == 1:
                row[i] = (row[i] + a) & 255
            elif ftype == 2:
                row[i] = (row[i] + b) & 255
            elif ftype == 3:
                row[i] = (row[i] + ((a + b) >> 1)) & 255
            elif ftype == 4:
                p = a + b - c
                pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
                pred = a if pa <= pb and pa <= pc else (b if pb <= pc else c)
                row[i] = (row[i] + pred) & 255
            elif ftype != 0:
                raise ValueError(f"filtro PNG desconocido: {ftype}")
        rows.append(row)
        prev = row
    return rows


def decode_terrarium(png: bytes) -> Tile:
    """Decodifica una tesela Terrarium (PNG RGB o RGBA de 8 bits, sin entrelazado) a metros."""
    if png[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError("no es un PNG")
    pos, idat, header = 8, b"", None
    while pos < len(png):
        (length,) = struct.unpack(">I", png[pos : pos + 4])
        kind = png[pos + 4 : pos + 8]
        body = png[pos + 8 : pos + 8 + length]
        if kind == b"IHDR":
            header = struct.unpack(">IIBBBBB", body)
        elif kind == b"IDAT":
            idat += body
        pos += 12 + length
    if header is None:
        raise ValueError("PNG sin IHDR")
    width, height, depth, color, _, _, interlace = header
    if depth != 8 or color not in (2, 6) or interlace != 0:
        raise ValueError(f"formato PNG no soportado: profundidad {depth}, color {color}, entrelazado {interlace}")
    bpp = 3 if color == 2 else 4
    rows = _unfilter(zlib.decompress(idat), width, height, bpp)
    return [
        [row[x * bpp] * 256 + row[x * bpp + 1] + row[x * bpp + 2] / 256 - 32768 for x in range(width)]
        for row in rows
    ]


class TileSource:
    """Descarga (con cache en disco) y decodifica teselas; recuerda los modelos que aportaron."""

    def __init__(self) -> None:
        self.tiles: dict[tuple[int, int], Tile] = {}
        self.imagery_sources: set[str] = set()

    def tile(self, x: int, y: int) -> Tile:
        key = (x, y)
        if key not in self.tiles:
            png, sources = self._fetch(x, y)
            self.tiles[key] = decode_terrarium(png)
            self.imagery_sources.update(sources)
        return self.tiles[key]

    def _fetch(self, x: int, y: int) -> tuple[bytes, list[str]]:
        CACHE_DIR.mkdir(parents=True, exist_ok=True)
        png_path = CACHE_DIR / f"{ZOOM}_{x}_{y}.png"
        meta_path = CACHE_DIR / f"{ZOOM}_{x}_{y}.sources.txt"
        if png_path.exists() and meta_path.exists():
            return png_path.read_bytes(), meta_path.read_text(encoding="utf-8").split()
        request = urllib.request.Request(TILE_URL.format(z=ZOOM, x=x, y=y), headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(request, timeout=60) as response:
            png = response.read()
            header = response.headers.get("x-amz-meta-x-imagery-sources", "")
        sources = [s.strip() for s in header.split(",") if s.strip()]
        png_path.write_bytes(png)
        meta_path.write_text("\n".join(sources), encoding="utf-8")
        return png, sources

    def elevation(self, px: float, py: float) -> float:
        """Elevacion en metros en la coordenada de pixel mundial (px, py), con interpolacion bilineal."""
        x0, y0 = math.floor(px - 0.5), math.floor(py - 0.5)
        fx, fy = px - 0.5 - x0, py - 0.5 - y0
        values = []
        for dy in (0, 1):
            for dx in (0, 1):
                gx, gy = x0 + dx, y0 + dy
                tile = self.tile(gx // TILE_SIZE, gy // TILE_SIZE)
                values.append(tile[gy % TILE_SIZE][gx % TILE_SIZE])
        top = values[0] * (1 - fx) + values[1] * fx
        bottom = values[2] * (1 - fx) + values[3] * fx
        return top * (1 - fy) + bottom * fy


def _meters_per_degree(lat_deg: float) -> tuple[float, float]:
    """Metros por grado de latitud y de longitud en WGS84 (series estandar)."""
    phi = math.radians(lat_deg)
    per_lat = 111132.92 - 559.82 * math.cos(2 * phi) + 1.175 * math.cos(4 * phi)
    per_lon = 111412.84 * math.cos(phi) - 93.5 * math.cos(3 * phi) + 0.118 * math.cos(5 * phi)
    return per_lat, per_lon


def _world_pixel(lat: float, lon: float) -> tuple[float, float]:
    scale = TILE_SIZE * 2**ZOOM
    px = (lon + 180.0) / 360.0 * scale
    py = (1.0 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2.0 * scale
    return px, py


def window_grid(source: TileSource, lat: float, lon: float) -> Grid:
    """Cuadricula de elevaciones (filas de norte a sur) de la ventana de WINDOW_KM alrededor del punto."""
    n = int(round(WINDOW_KM * 1000 / CELL_M)) + 1
    half = (n - 1) / 2
    per_lat, per_lon = _meters_per_degree(lat)
    grid: Grid = []
    for row in range(n):
        dy = (half - row) * CELL_M  # norte positivo
        row_values = []
        for col in range(n):
            dx = (col - half) * CELL_M  # este positivo
            px, py = _world_pixel(lat + dy / per_lat, lon + dx / per_lon)
            row_values.append(source.elevation(px, py))
        grid.append(row_values)
    return grid


# Modelos globales gruesos (1 minuto de arco y 7,5 a 30 segundos): interpolarlos a 250 m no
# recupera detalle, asi que no sirven para pendiente ni relieve en una ventana de 10 km.
COARSE_MODELS = ("gmted/", "etopo1/")


def has_fine_model(imagery_sources: list[str]) -> bool:
    """True si alguna fuente de las teselas no es uno de los modelos globales gruesos."""
    return any(not name.startswith(COARSE_MODELS) for name in imagery_sources)


# Fraccion de puntos a nivel del mar o por debajo a partir de la cual, si ETOPO1 aporta a las
# teselas, la ventana incluye mar: esa batimetria no es terreno y distorsiona pendiente y relieve.
MARINE_FRACTION = 0.02


def terrain_variables(lat: float, lon: float, land_below_sea_level: bool = False) -> dict:
    """Pendiente media y relieve (`None` si no hay datos fiables) y las fuentes de elevacion.

    `null_reason` explica por que pendiente y relieve son `None`: "coarse" (solo modelos
    globales gruesos) o "marine" (la ventana incluye mar con batimetria de ETOPO1).
    `land_below_sea_level` marca depresiones de tierra bajo el nivel del mar (por ejemplo
    Danakil), donde elevaciones negativas no indican mar.
    """
    source = TileSource()
    grid = window_grid(source, lat, lon)
    sources = sorted(source.imagery_sources)
    values = [v for row in grid for v in row]
    below_sea = sum(1 for v in values if v <= 0) / len(values)
    reason = None
    if not has_fine_model(sources):
        reason = "coarse"
    elif not land_below_sea_level and any(n.startswith("etopo1/") for n in sources) and below_sea > MARINE_FRACTION:
        reason = "marine"
    return {
        "slope_deg": round(mean_slope_deg(grid, CELL_M, CELL_M), 2) if reason is None else None,
        "relief_m": round(relief_std_m(grid), 1) if reason is None else None,
        "elevation_center_m": round(grid[len(grid) // 2][len(grid) // 2], 0),
        "imagery_sources": sources,
        "null_reason": reason,
    }


if __name__ == "__main__":
    import json

    if len(sys.argv) != 3:
        sys.exit("uso: python pipeline/earth/terrain_tiles.py LAT LON")
    print(json.dumps(terrain_variables(float(sys.argv[1]), float(sys.argv[2])), indent=2))
