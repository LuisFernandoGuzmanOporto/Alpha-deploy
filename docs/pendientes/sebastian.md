# Pendientes de Sebastián (índice, validación y metodología)

Estado revisado sobre `main` en `2517734` (14/11/2026). Fuente de las tareas originales: `TASKS.md`. Marca tus casillas en tu propio PR.

Ya entregado: S-1 a S-4 (revisión del índice, validación, sensibilidad y `web/src/lib/score.ts`). Los resultados de sensibilidad están en `docs/METODOLOGIA.md`.

## Antes de empezar

1. `git checkout main && git pull`
2. Rama propia: `git checkout -b feat/sebastian-<tarea>`
3. Corre `python pipeline/validate.py` antes del pipeline.

## Pendientes

- [ ] **S-5, preguntas del jurado:** cerrar `docs/PREGUNTAS_JURADO.md`. La pregunta 8 dice que la validación con datos reales sigue pendiente, y ya hay catálogo terrestre integrado. Después, ensayar con Joel el rol de jurado.
- [ ] **S-6, tesis de descubrimiento:** confirmar que está escrita: los `known: true` aparecen arriba para sus sitios, y cuántos poco estudiados entran al top 5 y por qué.
- [ ] **Re-correr el pipeline** cuando Lian complete etiquetas y variables faltantes, validar y commitear `web/public/data/*.json`. Hoy hay 24 candidatos sin etiquetas.
- [ ] **S-7, escaneo global (F12):** no existe `scan.json`. Decidir y dejar escrito si se descarta, porque solo vale con un camino de datos que no exija descargas enormes.
- [x] **Recalculado con el catálogo completo:** los cuatro lugares que no tenían pendiente ni relieve ya los tienen (Copernicus DEM), así que los rankings lunares pasan de 43 a 47 pares. Se volvió a correr `pipeline/sensitivity.py` y se actualizaron las tablas de sensibilidad y validación de `METODOLOGIA.md` y `METODOLOGIA.en.md` (59 de 60 pruebas de pesos con al menos cuatro nombres; 14 de 30 puestos del top 5 son poco estudiados).
- [x] **Inglés (#25):** `docs/METODOLOGIA.en.md` y la web lo muestra con `?lang=en`. Si cambias `METODOLOGIA.md`, actualiza también la versión en inglés.

## Reglas

- No cambies el contrato de datos (`CONTEXT.md`, sección 6) sin avisar a Fernando.
- Commits con prefijo `feat:`, `fix:`, `docs:` o `data:`.
- Un PR pequeño por cambio y `git pull --rebase` antes de subir. Nunca subas directo a `main`.
