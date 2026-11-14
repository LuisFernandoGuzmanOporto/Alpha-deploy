"""Utilidades comunes para calcular variables del terreno en la ventana comun.

Solo biblioteca estandar. La ventana comun (CONTEXT.md, seccion 5) es de 10 x 10 km
alrededor del punto, con el modelo de elevacion a unos 250 m por pixel.
"""
import math
import urllib.request

WINDOW_KM = 10.0
USER_AGENT = "EarthAnalogs-NASA-SpaceApps-Cochabamba/1.0"

Grid = list[list[float]]


def fetch_range(url: str, start: int, length: int) -> bytes:
    """Descarga solo los bytes [start, start + length) de un archivo remoto."""
    request = urllib.request.Request(
        url, headers={"Range": f"bytes={start}-{start + length - 1}", "User-Agent": USER_AGENT}
    )
    with urllib.request.urlopen(request, timeout=60) as response:
        data = response.read()
    if len(data) != length:
        raise IOError(f"{url}: se esperaban {length} bytes y llegaron {len(data)}")
    return data


def mean_slope_deg(grid: Grid, cell_x_m: float, cell_y_m: float) -> float:
    """Pendiente media en grados con el metodo de Horn (3 x 3), solo pixeles interiores."""
    slopes: list[float] = []
    for r in range(1, len(grid) - 1):
        for c in range(1, len(grid[0]) - 1):
            z = grid
            dzdx = ((z[r - 1][c + 1] + 2 * z[r][c + 1] + z[r + 1][c + 1])
                    - (z[r - 1][c - 1] + 2 * z[r][c - 1] + z[r + 1][c - 1])) / (8 * cell_x_m)
            dzdy = ((z[r + 1][c - 1] + 2 * z[r + 1][c] + z[r + 1][c + 1])
                    - (z[r - 1][c - 1] + 2 * z[r - 1][c] + z[r - 1][c + 1])) / (8 * cell_y_m)
            slopes.append(math.degrees(math.atan(math.hypot(dzdx, dzdy))))
    return sum(slopes) / len(slopes)


def relief_std_m(grid: Grid) -> float:
    """Relieve local: desviacion estandar poblacional de la elevacion en la ventana."""
    values = [v for row in grid for v in row]
    mean = sum(values) / len(values)
    return math.sqrt(sum((v - mean) ** 2 for v in values) / len(values))
