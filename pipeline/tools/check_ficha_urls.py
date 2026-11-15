"""Comprueba que existen los enlaces de web/public/data/fichas.json.

Los DOI se consultan en Crossref (los editores bloquean a los robots con 403); el resto, con una peticion directa.
Uso: python pipeline/tools/check_ficha_urls.py [candidate_id ...]   (sin argumentos revisa todas las fichas)
"""
import json
import subprocess
import sys
import time
from pathlib import Path

fichas = json.loads((Path(__file__).resolve().parents[2] / "web" / "public" / "data" / "fichas.json").read_text(encoding="utf-8"))
only = set(sys.argv[1:])
urls = sorted({r["url"] for f in fichas if not only or f["candidate_id"] in only for r in f["references"]})
print(len(urls), "URLs")
bad = []
for url in urls:
    if "doi.org/" in url:
        doi = url.split("doi.org/")[1].replace("(", "%28").replace(")", "%29")
        target, pause = "https://api.crossref.org/works/" + doi, 0.4
    else:
        target, pause = url, 3  # Wikipedia limita las consultas rapidas
    code = subprocess.run(
        ["curl", "-s", "-o", "NUL", "-L", "-m", "30", "-A", "EarthAnalogs-research/1.0", "-w", "%{http_code}", target],
        capture_output=True, text=True,
    ).stdout
    if not code.startswith(("2", "3")):
        bad.append((code, url))
    time.sleep(pause)
print("con problema:", bad)
