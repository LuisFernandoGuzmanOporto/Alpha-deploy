# Pendientes de Lian (datos de la Tierra)

Estado revisado sobre `main` en `2517734` (14/11/2026). Fuente de las tareas originales: `TASKS.md`. Marca tus casillas en tu propio PR.

Ya entregado: L-1. `data/candidates.json` tiene 47 candidatos (20 conocidos, 27 poco estudiados y 10 de Bolivia), así que cumple las metas.

## Antes de empezar

1. `git checkout main && git pull`
2. Rama propia: `git checkout -b feat/lian-<tarea>`
3. Antes de cada cambio de datos: `python pipeline/validate.py`. Hoy da 0 errores y 31 avisos.
4. Nunca inventes datos: si falta un valor, déjalo en `null` y anota la fuente.

## Pendientes

- [ ] **L-2, fichas (prioridad):** crear `web/public/data/fichas.json` con resumen, procesos, usos, "dónde falla la analogía" y referencias. Primero los candidatos que estén en el top 10 de algún sitio. Solo afirmaciones citables. Hoy la web dice "aún no tiene ficha publicada".
- [ ] **Etiquetas (`tags`):** a 24 de los 47 candidatos les faltan. Ejemplos: Eyre, Gilf Kebir, Hoggar, Taklamakan, Pamir, Arizaro, Tunupa, Uturuncu, McMurdo y Svalbard. Usa el vocabulario de `CONTEXT.md`, sección 5, y respáldalas con fuente.
- [ ] **Huecos de variables:** `earth-valles-secos-mcmurdo`, `earth-svalbard-sverrefjellet`, `earth-la-corona-lanzarote` y `earth-manjanggul-jeju` no tienen pendiente ni relieve. Complétalos con fuente o déjalos en `null` documentado.
- [ ] **Inglés (#25), si se decide traducir los datos:** versión en inglés de nombres, países y `notes` de los candidatos (campos `*_en`, acordados con Fernando para no romper el contrato).
- [ ] **L-3, explicaciones (segunda fase):** `web/public/data/explicaciones.json`, de 3 a 4 frases para los 5 mejores pares de cada sitio, revisadas por una persona.
- [ ] **L-4, PDF (segunda fase):** exportar la ficha a PDF en `web/src/features/export/` con estilos de impresión.

## Reglas

- No cambies el contrato de datos (`CONTEXT.md`, sección 6) sin avisar a Fernando.
- Sin secretos ni `.env`. Commits con prefijo `data:` o `feat:`.
- Un PR pequeño por cambio y `git pull --rebase` antes de subir. Nunca subas directo a `main`.
