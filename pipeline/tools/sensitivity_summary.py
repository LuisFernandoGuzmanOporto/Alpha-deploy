"""Agregados de sensibilidad para docs/METODOLOGIA.md (S-3): corre pipeline/sensitivity.py y resume por sitio."""
import re
import subprocess
import sys
from collections import defaultdict
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]

out = subprocess.run(
    [sys.executable, str(REPO / "pipeline" / "sensitivity.py")],
    cwd=str(REPO), capture_output=True, text=True, encoding="utf-8",
    env={**__import__("os").environ, "PYTHONIOENCODING": "utf-8"},
).stdout

site = None
rows = defaultdict(list)  # site -> [(scenario, mean, max, shared, entra, sale)]
for line in out.splitlines():
    m = re.match(r"### (\S+) \((\d+) pares", line)
    if m:
        site = m.group(1)
        pairs = int(m.group(2))
        print(f"{site}: {pairs} pares")
        continue
    cells = [c.strip() for c in line.strip("|").split("|")]
    if site and len(cells) == 8 and cells[0] not in ("Escenario", "---") and not cells[0].startswith("---"):
        try:
            rows[site].append((cells[0], float(cells[1]) if cells[1] != "—" else 0.0,
                               int(cells[2]) if cells[2] != "—" else 0, int(cells[3]), int(cells[6]), int(cells[7])))
        except ValueError:
            pass

weights_total = omit_total = 0
w_ge4 = w_eq5 = o_ge4 = 0
exceptions = []
print()
for s, items in rows.items():
    w = [r for r in items if not r[0].startswith("Sin ")]
    o = [r for r in items if r[0].startswith("Sin ")]
    fmt = lambda v: f"{v:.2f}".replace(".", ",")
    print(f"{s}\n   ±50 %: top compartido {min(r[3] for r in w)}–{max(r[3] for r in w)}; "
          f"mayor desplazamiento medio {fmt(max(r[1] for r in w))} / individual {max(r[2] for r in w)}"
          f"\n   omisión: top compartido {min(r[3] for r in o)}–{max(r[3] for r in o)}; "
          f"mayor desplazamiento medio {fmt(max(r[1] for r in o))} / individual {max(r[2] for r in o)}")
    weights_total += len(w)
    omit_total += len(o)
    w_ge4 += sum(1 for r in w if r[3] >= 4)
    w_eq5 += sum(1 for r in w if r[3] == 5)
    o_ge4 += sum(1 for r in o if r[3] >= 4)
    exceptions += [(s, r[0], r[3]) for r in w if r[3] < 4]
    for r in o:
        if r[3] <= 2:
            print(f"   omisión con solo {r[3]} nombres: {r[0]}")
        if r[4] or r[5]:
            print(f"   {r[0]}: entran {r[4]}, salen {r[5]}")
    big = max(items, key=lambda r: r[2])
    print(f"   mayor desplazamiento individual: {big[2]} en '{big[0]}'")
print()
print(f"pruebas de pesos: {weights_total}; con >=4 nombres: {w_ge4}; con 5 nombres: {w_eq5}; excepciones: {exceptions}")
print(f"omisiones: {omit_total}; con >=4 nombres: {o_ge4}")
