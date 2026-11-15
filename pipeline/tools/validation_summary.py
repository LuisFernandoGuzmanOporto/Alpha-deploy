"""Validacion por cuerpo (S-6): conocidos y poco estudiados en el top 5 de cada sitio. Uso: python pipeline/tools/validation_summary.py"""
import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
root = (Path(sys.argv[1]) if len(sys.argv) > 1 else REPO) / "web" / "public" / "data"
results = json.loads((root / "results.json").read_text(encoding="utf-8"))
cands = json.loads((root / "candidates.json").read_text(encoding="utf-8"))
cands = cands if isinstance(cands, list) else cands["candidates"]
by_id = {c["id"]: c for c in cands}

print("conocidos:", sum(1 for c in cands if c["known"]), "poco estudiados:", sum(1 for c in cands if not c["known"]))
for body in ("moon", "mars"):
    print(body, "conocidos con analog_for:", sum(1 for c in cands if c["known"] and body in c["analog_for"]))

total_unstudied = 0
for site_id, ranking in results["sites"].items():
    body = site_id.split("-")[0]
    top5 = ranking[:5]
    known = [
        (pos, by_id[e["candidate_id"]]["name"], e["score"])
        for pos, e in enumerate(top5, 1)
        if by_id[e["candidate_id"]]["known"] and body in by_id[e["candidate_id"]]["analog_for"]
    ]
    unstudied = [
        (pos, by_id[e["candidate_id"]]["name"], e["score"])
        for pos, e in enumerate(top5, 1)
        if not by_id[e["candidate_id"]]["known"]
    ]
    total_unstudied += len(unstudied)
    print(f"\n{site_id}: pares={len(ranking)}")
    print("  conocidos del cuerpo en top5:", known)
    print("  poco estudiados en top5:", unstudied)
print("\npoco estudiados en el top 5 general:", total_unstudied, "de 30")
