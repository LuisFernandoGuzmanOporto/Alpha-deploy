"""Fotografías reales de cada candidato terrestre, desde Wikimedia Commons.

Para cada lugar de data/candidates.json busca en Commons las fotos **geoetiquetadas a menos de
10 km de sus coordenadas** (la misma ventana de 10 x 10 km del índice). La verificación es esa:
la foto fue tomada en el lugar según sus propios metadatos; no se busca por nombre ni se acepta
una imagen sin coordenadas. Se guarda autor, licencia y enlace a la página de cada archivo.

Solo biblioteca estándar. Uso:
    python pipeline/tools/fetch_photos.py            # escribe web/public/data/photos.json
    python pipeline/tools/fetch_photos.py --max 6    # hasta 6 fotos por lugar

No necesita clave. Se ejecuta a mano cuando cambian los candidatos; la web solo lee el JSON.
"""
from __future__ import annotations

import argparse
import html
import json
import math
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
API = "https://commons.wikimedia.org/w/api.php"
USER_AGENT = "EarthAnalogsPhotoFetcher/1.0 (Space Apps hackathon project; static site)"
RADIUS_M = 10_000
# Commons solo sirve miniaturas en anchos fijos (500, 960, 1280, 1920...).
THUMB_W = 500
LARGE_WIDTHS = (1920, 1280)
MIN_WIDTH = 1000
# Archivos que no son fotos del lugar: mapas, esquemas, logos, escudos, imágenes de satélite.
SKIP = re.compile(
    r"\b(map|mapa|karte|locator|location|diagram|logo|flag|bandera|coat of arms|escudo|plan|"
    r"satellite|landsat|sentinel|modis|aster|panorama map|topographic|relief|chart|from space|"
    r"view of earth|earth observatory)\b"
    # Fotos orbitales de la ISS y del transbordador: muestran la región desde el espacio, no el lugar.
    r"|\b(ISS|STS)\d{2,3}-",
    re.IGNORECASE,
)
TAG = re.compile(r"<[^>]+>")


def api(params: dict[str, str]) -> dict:
    url = f"{API}?{urllib.parse.urlencode({**params, 'format': 'json', 'formatversion': '2'})}"
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    for attempt in range(5):
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                return json.load(response)
        except urllib.error.HTTPError as error:
            # 429: Commons pide ir más despacio; se espera lo que indique y se reintenta.
            if error.code != 429 or attempt == 4:
                raise
            time.sleep(float(error.headers.get("Retry-After") or 0) or 5 * (attempt + 1))
    raise RuntimeError("sin respuesta")


def clean(value: str | None, limit: int = 160) -> str:
    text = html.unescape(TAG.sub("", value or "")).strip()
    text = re.sub(r"\s+", " ", text)
    return text if len(text) <= limit else text[: limit - 1].rstrip() + "…"


def distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    p1, p2 = math.radians(lat1), math.radians(lat2)
    a = math.sin((p2 - p1) / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(math.radians(lon2 - lon1) / 2) ** 2
    return 6371.0088 * 2 * math.asin(math.sqrt(a))


def large_url(info: dict) -> str:
    """Versión de 1920 o 1280 px si el original es mayor; si no, el original."""
    thumb = info.get("thumburl", "")
    for width in LARGE_WIDTHS:
        if info.get("width", 0) > width and re.search(r"/\d+px-", thumb):
            return re.sub(r"/\d+px-", f"/{width}px-", thumb, count=1)
    return info.get("url", thumb)


def photos_for(lat: float, lon: float, limit: int) -> list[dict]:
    data = api(
        {
            "action": "query",
            "generator": "geosearch",
            "ggscoord": f"{lat}|{lon}",
            "ggsradius": str(RADIUS_M),
            "ggsnamespace": "6",
            "ggslimit": "40",
            "prop": "imageinfo|coordinates",
            "iiprop": "url|mime|size|extmetadata",
            "iiurlwidth": str(THUMB_W),
            "iiextmetadatafilter": "Artist|LicenseShortName|LicenseUrl|ImageDescription",
        }
    )
    found = []
    for page in data.get("query", {}).get("pages", []):
        info = (page.get("imageinfo") or [{}])[0]
        coords = (page.get("coordinates") or [{}])[0]
        title = page.get("title", "")
        if info.get("mime") != "image/jpeg" or info.get("width", 0) < MIN_WIDTH:
            continue
        if SKIP.search(title) or "lat" not in coords:
            continue
        # Retratos muy verticales o panorámicas extremas no sirven para la tarjeta.
        ratio = info["width"] / max(info.get("height", 1), 1)
        if ratio < 0.7 or ratio > 3.2:
            continue
        meta = info.get("extmetadata", {})
        license_name = clean(meta.get("LicenseShortName", {}).get("value"), 40)
        if not license_name:
            continue
        found.append(
            {
                "title": clean(title.removeprefix("File:").rsplit(".", 1)[0], 120),
                "thumb": info["thumburl"],
                "large": large_url(info),
                "width": info["width"],
                "height": info["height"],
                "page": info.get("descriptionurl", ""),
                "author": clean(meta.get("Artist", {}).get("value"), 80) or "Wikimedia Commons",
                "license": license_name,
                "license_url": meta.get("LicenseUrl", {}).get("value", ""),
                "distance_km": round(distance_km(lat, lon, coords["lat"], coords["lon"]), 2),
            }
        )
    found.sort(key=lambda photo: photo["distance_km"])
    # Evita series casi idénticas del mismo autor ("… (1)", "… (2)").
    unique, seen = [], set()
    for photo in found:
        key = (re.sub(r"[\s\-_(]*\d+\)?$", "", photo["title"]).lower(), photo["author"])
        if key in seen:
            continue
        seen.add(key)
        unique.append(photo)
    return unique[:limit]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--candidates", default=str(ROOT / "data" / "candidates.json"))
    parser.add_argument("--out", default=str(ROOT / "web" / "public" / "data" / "photos.json"))
    parser.add_argument("--max", type=int, default=5, help="fotos por lugar")
    parser.add_argument("--pause", type=float, default=1.5, help="segundos entre peticiones")
    parser.add_argument("--resume", action="store_true", help="conserva los lugares que ya tienen fotos en el JSON")
    args = parser.parse_args()

    candidates = json.loads(Path(args.candidates).read_text(encoding="utf-8"))
    places: dict[str, list[dict]] = {}
    failed = 0
    previous = Path(args.out)
    if args.resume and previous.exists():
        places = json.loads(previous.read_text(encoding="utf-8")).get("places", {})
    for candidate in candidates:
        lat, lon = candidate.get("lat"), candidate.get("lon")
        if lat is None or lon is None or candidate["id"] in places:
            continue
        try:
            photos = photos_for(lat, lon, args.max)
        except Exception as error:  # red caída o respuesta inesperada: el lugar queda sin fotos
            print(f"AVISO  {candidate['id']}: {error}", file=sys.stderr)
            photos = []
            failed += 1
        if photos:
            places[candidate["id"]] = photos
        print(f"{len(photos):2d} fotos  {candidate['id']}")
        time.sleep(args.pause)

    out = {
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "source": "Wikimedia Commons",
        "method": f"Fotos geoetiquetadas a menos de {RADIUS_M // 1000} km de las coordenadas del candidato",
        "places": places,
    }
    Path(args.out).write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    without = len([c for c in candidates if c["id"] not in places])
    print(f"\n{len(places)} lugares con fotos, {without} sin fotos, {failed} con error de red -> {args.out}")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
