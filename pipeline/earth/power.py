"""Temperatura de superficie, precipitacion y albedo de un lugar de la Tierra con NASA POWER.

Solo biblioteca estandar. Usa la API de climatologia de NASA POWER
(https://power.larc.nasa.gov/docs/services/api/temporal/climatology/), sin clave.

- temp_mean_c: TS, temperatura de la piel de la Tierra (superficie), media anual en °C (MERRA-2).
- precip_mm_year: PRECTOTCORR, precipitacion corregida, media anual en mm/dia * 365,25 (MERRA-2).
- albedo: ALLSKY_SRF_ALB, albedo de superficie en todo cielo (CERES SYN1deg).

La resolucion nativa es de unos 0,5 a 1 grado (decenas de km): mucho mas gruesa que la ventana de
10 km de las variables de terreno. Eso se declara en las notas de cada candidato.
"""
import json
import time
import urllib.parse
import urllib.request
from pathlib import Path

USER_AGENT = "EarthAnalogs-NASA-SpaceApps-Cochabamba/1.0"
API = "https://power.larc.nasa.gov/api/temporal/climatology/point"
PARAMETERS = ("TS", "PRECTOTCORR", "ALLSKY_SRF_ALB")
DAYS_PER_YEAR = 365.25
CACHE_DIR = Path(__file__).resolve().parents[2] / "data" / "raw" / "power"


def _request(lat: float, lon: float) -> dict:
    query = urllib.parse.urlencode(
        {"parameters": ",".join(PARAMETERS), "community": "RE", "longitude": lon, "latitude": lat, "format": "JSON"}
    )
    request = urllib.request.Request(f"{API}?{query}", headers={"User-Agent": USER_AGENT})
    last_error: Exception | None = None
    for attempt in range(4):
        try:
            with urllib.request.urlopen(request, timeout=90) as response:
                return json.load(response)
        except Exception as error:  # reintenta ante errores de red o limite de uso
            last_error = error
            time.sleep(3 * (attempt + 1))
    raise RuntimeError(f"NASA POWER no respondio para ({lat}, {lon}): {last_error}")


def climate_variables(lat: float, lon: float) -> dict:
    """Variables climaticas anuales; `None` cuando POWER devuelve el valor de relleno."""
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    cache = CACHE_DIR / f"{lat:.4f}_{lon:.4f}.json"
    if cache.exists():
        data = json.loads(cache.read_text(encoding="utf-8"))
    else:
        data = _request(lat, lon)
        cache.write_text(json.dumps(data), encoding="utf-8")
    fill = data["header"]["fill_value"]
    annual = {name: values["ANN"] for name, values in data["properties"]["parameter"].items()}

    def value(name: str) -> float | None:
        raw = annual.get(name)
        return None if raw is None or raw == fill else raw

    temp, precip, albedo = value("TS"), value("PRECTOTCORR"), value("ALLSKY_SRF_ALB")
    return {
        "temp_mean_c": None if temp is None else round(temp, 2),
        "precip_mm_year": None if precip is None else round(precip * DAYS_PER_YEAR, 1),
        "albedo": None if albedo is None else round(albedo, 3),
        "period": data["header"]["range"],
        "grid_elevation_m": data["geometry"]["coordinates"][2],
    }


if __name__ == "__main__":
    import sys

    if len(sys.argv) != 3:
        sys.exit("uso: python pipeline/earth/power.py LAT LON")
    print(json.dumps(climate_variables(float(sys.argv[1]), float(sys.argv[2])), indent=2, ensure_ascii=False))
