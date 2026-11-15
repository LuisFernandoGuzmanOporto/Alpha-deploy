"""Lista las frases de las fichas que hablan de puestos o del top 10 lunar, junto a los puestos reales. Uso: python pipeline/tools/ficha_rank_claims.py"""
import json
import re
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
root = str(REPO / "web" / "public" / "data") + "/"
results = json.load(open(root + "results.json", encoding="utf-8"))["sites"]
cands = {c["id"]: c for c in json.load(open(root + "candidates.json", encoding="utf-8"))}
fichas = json.load(open(root + "fichas.json", encoding="utf-8"))

lunar = ["moon-faustini-rim-a", "moon-peak-near-cabeus-b", "moon-malapert-massif"]
top10_lunar = {sid: [e["candidate_id"] for e in results[sid][:10]] for sid in lunar}
in_any_top10 = set().union(*top10_lunar.values())
print("top 10 lunar:")
for sid in lunar:
    print(" ", sid, [(i + 1, cands[c]["name"][:18], results[sid][i]["score"]) for i, c in enumerate(top10_lunar[sid])])
print()
pattern = re.compile(r"top 10|primero|décimo|\d+\.º|puesto|ranking|más frío|más alta|más alto|de los más|entra", re.I)
for f in fichas:
    cid = f["candidate_id"]
    ranks = {}
    for sid, rk in results.items():
        ids = [e["candidate_id"] for e in rk]
        ranks[sid.split("-", 1)[1][:10]] = (ids.index(cid) + 1, rk[ids.index(cid)]["score"])
    hits = [b for b in f["breaks_down"] if pattern.search(b)]
    if hits:
        lun = {k: v for k, v in ranks.items() if k.startswith(("faustini", "peak", "malapert"))}
        print(f"## {cid} | en algún top10 lunar: {cid in in_any_top10} | lunar: {lun}")
        for b in hits:
            print("   -", b[:230])
