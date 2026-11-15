# Pendientes de Dante (Luna, Marte, comparador y globo)

Estado revisado sobre `main` en `2517734` (14/11/2026). Fuente de las tareas originales: `TASKS.md`. Marca tus casillas en tu propio PR.

Ya entregado: D-1 (`data/sites.json` con los 6 sitios), D-2 (comparador) y D-3 (globo 3D).

## Antes de empezar

1. `git checkout main && git pull`
2. Rama propia: `git checkout -b feat/dante-<tarea>`
3. Antes de cada cambio de datos: `python pipeline/validate.py`.
4. Nunca inventes datos: si falta un valor, déjalo en `null` y anota la fuente.

## Pendientes

- [x] **Albedo de los 3 sitios lunares:** se queda en `null`; el albedo de LOLA a 1064 nm quedó documentado en las notas sin usarlo en el índice (PR #49).
- [x] **Inglés (#25):** regiones y notas de los 6 sitios. Hecho en `web/src/content/dataEn.ts`, una capa de traducción por `id` que no cambia el contrato de datos. Si agregas o cambias un lugar, agrega su entrada ahí: `npm test` falla si falta.
- [x] **Globo:** los marcadores superpuestos se separan (`spreadMarkers`, PR #48).
- [ ] **Apoyo a Joel:** capturas y QA en producción cuando exista la URL de Vercel, como en la segunda pasada (PR #46).

## Fase final (15/11)

- [x] Las cuatro tareas de `prompts/fase-final.md` (ver `TASKS.md`, sección "Fase final", y `docs/QA.md`, pasada 4).

## Reglas

- No cambies el contrato de datos (`CONTEXT.md`, sección 6) sin avisar a Fernando.
- Sin secretos ni `.env`. Commits con prefijo `data:`, `feat:` o `fix:`.
- Un PR pequeño por cambio y `git pull --rebase` antes de subir. Nunca subas directo a `main`.
