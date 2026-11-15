# Pendientes de Lian (datos de la Tierra)

Estado revisado sobre `main` en `2517734` (14/11/2026). Fuente de las tareas originales: `TASKS.md`. Marca tus casillas en tu propio PR.

Ya entregado: L-1. `data/candidates.json` tiene 47 candidatos (20 conocidos, 27 poco estudiados y 10 de Bolivia), así que cumple las metas.

## Antes de empezar

1. `git checkout main && git pull`
2. Rama propia: `git checkout -b feat/lian-<tarea>`
3. Antes de cada cambio de datos: `python pipeline/validate.py`. Hoy da 0 errores y 6 avisos (3 sin etiqueta citable y el albedo lunar).
4. Nunca inventes datos: si falta un valor, déjalo en `null` y anota la fuente.

## Pendientes

- [x] **L-2, fichas:** `web/public/data/fichas.json` tiene 47 fichas, una por candidato: las 31 del top 10 (#52) y 16 más investigadas con Crossref y Wikipedia (todos los enlaces comprobados). Los lugares sin estudio planetario publicado dicen "propuesta del equipo". Si agregas un candidato, escribe su ficha y su entrada en `dataEn.ts`; `npm test` falla si falta.
- [x] **Etiquetas (`tags`):** 21 de los 24 que faltaban tienen etiquetas con fuente: 20 en #51 y MDRS después, con `evaporite` e `hydrated-minerals` según Stoker et al. 2011 (doi:10.1017/s1473550411000115). Las otras 3 se buscaron en literatura científica y siguen sin etiqueta, con el motivo en sus notas: Licancabur (el único estudio de suelos, Gjorup et al. 2019, no halla permafrost y no tiene glaciares; es un estratovolcán), Laguna Verde (lago salado sin evaporitas documentadas) y Tunupa (estratovolcán; solo hay glaciares pasados).
- [x] **Huecos de variables:** McMurdo, Svalbard, La Corona y Manjanggul ya tienen pendiente y relieve, calculados con Copernicus DEM GLO-30 (30 m) en `pipeline/earth/copernicus_dem.py` (solo con puntos de tierra donde la ventana incluye mar). El lector se validó contra seis lugares con Terrain Tiles. Con eso los cuatro entran al ranking lunar y los Valles Secos de McMurdo pasan a ser el primero para Cabeus y Malapert (ver `docs/METODOLOGIA.md`). Se rehacen con `python pipeline/earth/build_candidates.py --only <id>`.
- [x] **Inglés (#25):** nombres, países, `why` y las 47 fichas. Hecho en `web/src/content/dataEn.ts`, una capa de traducción por `id` que no cambia el contrato de datos. Si agregas o cambias un lugar, agrega su entrada ahí: `npm test` falla si falta. Las `notes` de los candidatos no se muestran y no se tradujeron.
- [ ] **L-3, explicaciones (segunda fase):** `web/public/data/explicaciones.json`, de 3 a 4 frases para los 5 mejores pares de cada sitio, revisadas por una persona.
- [ ] **L-4, PDF (segunda fase):** exportar la ficha a PDF en `web/src/features/export/` con estilos de impresión.

## Reglas

- No cambies el contrato de datos (`CONTEXT.md`, sección 6) sin avisar a Fernando.
- Sin secretos ni `.env`. Commits con prefijo `data:` o `feat:`.
- Un PR pequeño por cambio y `git pull --rebase` antes de subir. Nunca subas directo a `main`.
