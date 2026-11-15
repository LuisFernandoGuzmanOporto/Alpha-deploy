"""Primera pasada (debil) para detectar `known: false` equivocados: busca en Crossref titulos con "analog" y el nombre del lugar.
No sustituye una revision a fondo (ver prompts/fase-final.md). Uso: python pipeline/tools/audit_known.py"""
import json
import re
import subprocess
import time
import urllib.parse
from pathlib import Path

cands = json.loads(Path(__file__).resolve().parents[2] / "web" / "public" / "data" / "candidates.json".read_text(encoding="utf-8"))
EN = {
    "earth-volcan-tunupa-uyuni": "Tunupa volcano", "earth-badain-jaran-china": "Badain Jaran Desert", "earth-rub-al-khali": "Rub al Khali",
    "earth-mar-de-arena-namib": "Namib Sand Sea", "earth-harrat-khaybar": "Harrat Khaybar", "earth-ojos-del-salado": "Ojos del Salado",
    "earth-volcan-socompa": "Socompa volcano", "earth-el-malpais-nuevo-mexico": "El Malpais lava tubes", "earth-undara-australia": "Undara lava tubes",
    "earth-lava-beds-california": "Lava Beds National Monument lava tubes", "earth-etosha-namibia": "Etosha Pan", "earth-chott-el-djerid": "Chott el Djerid",
    "earth-desierto-tengger": "Tengger Desert", "earth-dasht-e-kavir": "Dasht-e Kavir", "earth-lago-eyre-australia": "Lake Eyre",
    "earth-macizo-del-hoggar": "Hoggar Ahaggar massif", "earth-desierto-de-taklamakan": "Taklamakan Desert", "earth-montanas-del-pamir": "Pamir",
    "earth-salar-de-arizaro": "Salar de Arizaro", "earth-laguna-colorada": "Laguna Colorada", "earth-laguna-verde-bolivia": "Laguna Verde Bolivia",
    "earth-uturuncu-bolivia": "Uturuncu volcano", "earth-nevado-sajama": "Sajama volcano", "earth-torotoro-umajalanta": "Torotoro Umajalanta cave",
    "earth-arbol-de-piedra-siloli": "Siloli Desert Arbol de Piedra", "earth-manjanggul-jeju": "Manjanggul lava tube",
}
KEY = re.compile(r"analog|analogue|mars|martian|planetary|lunar|moon", re.I)
for c in cands:
    if c["known"] or c["id"] not in EN:
        continue
    name = EN[c["id"]]
    hits = []
    for q in (f"{name} Mars analog", f"{name} lunar planetary analog"):
        url = "https://api.crossref.org/works?rows=6&select=DOI,title,issued,container-title&query=" + urllib.parse.quote(q)
        raw = subprocess.run(["curl", "-s", "-m", "30", "-A", "EarthAnalogs-audit/1.0", url], capture_output=True, text=True, encoding="utf-8").stdout
        try:
            items = json.loads(raw)["message"]["items"]
        except Exception:
            continue
        for i in items:
            title = (i.get("title") or ["?"])[0]
            if KEY.search(title) and name.split()[0].lower() in title.lower():
                hits.append((title[:120], (i.get("container-title") or ["?"])[0][:30], i.get("issued", {}).get("date-parts", [[None]])[0][0], i["DOI"]))
        time.sleep(0.6)
    seen = set()
    hits = [h for h in hits if not (h[3] in seen or seen.add(h[3]))]
    print(f"## {c['id']} ({name}): {len(hits)} posibles")
    for h in hits[:3]:
        print("   -", h)
