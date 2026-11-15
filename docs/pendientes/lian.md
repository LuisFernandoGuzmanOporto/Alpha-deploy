# Pendientes de Lian (datos de la Tierra)

Estado revisado sobre `main` en `2517734` (14/11/2026). Fuente de las tareas originales: `TASKS.md`. Marca tus casillas en tu propio PR.

Ya entregado: L-1. `data/candidates.json` tiene 47 candidatos (20 conocidos, 27 poco estudiados y 10 de Bolivia), así que cumple las metas.

## Antes de empezar

1. `git checkout main && git pull`
2. Rama propia: `git checkout -b feat/lian-<tarea>`
3. Antes de cada cambio de datos: `python pipeline/validate.py`. Hoy da 0 errores y 31 avisos.
4. Nunca inventes datos: si falta un valor, déjalo en `null` y anota la fuente.

## Pendientes

- [x] **L-2, fichas:** `web/public/data/fichas.json` tiene 47 fichas, una por candidato: las 31 del top 10 (#52) y 16 más investigadas con Crossref y Wikipedia (todos los enlaces comprobados). Los lugares sin estudio planetario publicado dicen "propuesta del equipo". Si agregas un candidato, escribe su ficha y su entrada en `dataEn.ts`; `npm test` falla si falta.
- [x] **Etiquetas (`tags`):** 20 de los 24 que faltaban se completaron con fuente (#51). Los otros 4 se revisaron otra vez y siguen sin etiqueta, a propósito: MDRS (ninguna fuente describe su geología con el vocabulario), Licancabur y Tunupa (son estratovolcanes, no campos volcánicos) y Laguna Verde (las fuentes la describen como lago salado, sin evaporitas documentadas). Solo se completan con una fuente citable.
- [x] **Huecos de variables:** `earth-valles-secos-mcmurdo` y `earth-svalbard-sverrefjellet` (solo hay modelos de elevación globales gruesos) y `earth-la-corona-lanzarote` y `earth-manjanggul-jeju` (la ventana de 10 × 10 km incluye mar) siguen sin pendiente ni relieve. Se dejan en `null` documentado en sus notas; completarlos exigiría un modelo de elevación de alta resolución que no usamos.
- [x] **Inglés (#25):** nombres, países, `why` y las 31 fichas. Hecho en `web/src/content/dataEn.ts`, una capa de traducción por `id` que no cambia el contrato de datos. Si agregas o cambias un lugar, agrega su entrada ahí: `npm test` falla si falta. Las `notes` de los candidatos no se muestran y no se tradujeron.
- [ ] **L-3, explicaciones (segunda fase):** `web/public/data/explicaciones.json`, de 3 a 4 frases para los 5 mejores pares de cada sitio, revisadas por una persona.
- [ ] **L-4, PDF (segunda fase):** exportar la ficha a PDF en `web/src/features/export/` con estilos de impresión.

## Reglas

- No cambies el contrato de datos (`CONTEXT.md`, sección 6) sin avisar a Fernando.
- Sin secretos ni `.env`. Commits con prefijo `data:` o `feat:`.
- Un PR pequeño por cambio y `git pull --rebase` antes de subir. Nunca subas directo a `main`.
