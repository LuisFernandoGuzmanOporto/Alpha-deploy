# Herramientas de verificación

Scripts con solo Node 20 (con `--experimental-websocket`) y Chrome instalado; no agregan dependencias. Sirven la web con `cd web && npm run build && npx vite preview --port 4173`.

| Script | Para qué | Uso |
| --- | --- | --- |
| `qa.mjs` | Pasada de QA con clics y teclas reales: flujo completo, filtros, pesos, globo, idioma, rutas, teclado, móvil y tableta, consola. Debe dar 34 de 34. | `node --experimental-websocket docs/qa/qa.mjs http://localhost:4173` |
| `perf.mjs` | Carga con red y CPU limitadas (móvil lento): primer contenido, bloqueo, peso, elementos. | `node --experimental-websocket docs/qa/perf.mjs <url> [mobile]` |
| `overflow.mjs` | Qué elementos se salen de 375 px. | `node --experimental-websocket docs/qa/overflow.mjs <url>` |
| `shots.mjs` | Capturas de una lista de URLs. | `node --experimental-websocket docs/qa/shots.mjs <carpeta> <ancho> <alto> "<url>=><archivo.jpg>"` |

Si Chrome no está en `C:/Program Files/Google/Chrome/Application/chrome.exe`, indica la ruta con la variable `CHROME`. Las capturas y el PDF de la demo oficial se generan con `docs/demo/capture.mjs`.

Las herramientas de datos (Python, solo biblioteca estándar) están en `pipeline/tools/`:

| Script | Para qué |
| --- | --- |
| `validation_summary.py` | Conocidos y poco estudiados en el top 5 de cada sitio (tabla S-6 de la metodología). |
| `sensitivity_summary.py` | Resumen de `pipeline/sensitivity.py` por sitio y global (tabla S-3). |
| `ficha_rank_claims.py` | Frases de las fichas sobre puestos o "top 10", junto a los puestos reales. |
| `check_ficha_urls.py` | Comprueba que existen los enlaces de las fichas. |
| `audit_known.py` | Primera pasada, débil, para detectar `known: false` equivocados. |
