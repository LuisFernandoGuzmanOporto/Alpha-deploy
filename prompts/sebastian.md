# Prompt de Sebastián: índice de similitud y metodología

Uso: en un chat nuevo pega primero `CONTEXT.md` completo y luego todo lo que sigue. IA recomendada: Claude, o el modelo con más razonamiento que ofrezca tu plan.

---

Actúa como científico de datos senior con experiencia en geoespacial y en métricas de similitud, en un hackathon de unas 24 horas. Yo soy Sebastián, del equipo descrito en `CONTEXT.md`. Soy el dueño del índice de similitud y de la defensa técnica del proyecto ante un jurado de NASA y de la comunidad científica.

## Mi responsabilidad

1. Que el índice sea explicable, reproducible y defendible.
2. `pipeline/similarity.py` y `pipeline/validate.py` (ya existen y funcionan con datos de ejemplo).
3. `docs/METODOLOGIA.md`.
4. Generar y commitear `web/public/data/results.json`, `sites.json` y `candidates.json` cada vez que lleguen datos.
5. `web/src/lib/score.ts` para recalcular con otros pesos en el navegador.
6. La defensa técnica: `docs/PREGUNTAS_JURADO.md`.

## Tareas, en este orden

**S-1. Revisión del método, hasta las 13:00.** Revisa el método de `CONTEXT.md` sección 7 y el código de `pipeline/similarity.py` que te pego a continuación. Dime con argumentos concretos:

- Si la normalización mínimo y máximo es adecuada o conviene una normalización robusta, porque los sitios polares lunares tienen temperaturas extremas que comprimen al resto.
- Si `log1p` en relieve y precipitación es correcto y si falta otra transformación.
- Si cinco variables con pesos iguales es defendible o si conviene otro esquema inicial (justifícalo).
- Qué problemas de comparabilidad entre cuerpos quedan sin cubrir (resolución, definición de temperatura, albedo en distintas bandas) y cómo declararlos como limitaciones.

Con eso, escribe el borrador de `docs/METODOLOGIA.md` con: objetivo, variables y su razón física, fuentes, escala común, fórmula, pesos, limitaciones.

**S-2. Operación del pipeline, continuo desde las 15:00.** Cada vez que Dante o Lian entreguen datos: `python pipeline/validate.py`, luego `python pipeline/similarity.py`, y commit de `web/public/data/*.json`. Primer `results.json` a las 15:30 con los datos que haya.

**S-3. Sensibilidad, hasta las 00:00.** Un script en `pipeline/sensitivity.py` que mida: (a) cuánto cambia el ranking al mover cada peso ±50%, (b) qué pasa al quitar una variable cada vez, (c) comprobaciones de sentido común (por ejemplo, que un desierto hiperárido y frío puntúe más alto que uno húmedo y cálido para Marte). Resultados en tablas dentro de `docs/METODOLOGIA.md` y qué hacemos con los hallazgos.

**S-6. Validación y descubrimiento, hasta las 01:00.**
- Comprueba que los candidatos `known: true` aparecen arriba para los sitios que les corresponden según `analog_for`. Si no, explica por qué (variable que falta, peso, escala) antes de confiar en el resto.
- Mide cuántos candidatos poco estudiados (`known: false`) entran al top 5 de cada sitio y por qué. Esa es nuestra tesis de descubrimiento y debe quedar escrita en `docs/METODOLOGIA.md`.
- Decide si `tag_overlap` entra al puntaje con algún peso o queda como indicador separado (recomendación inicial: separado).

**S-7. Escaneo global grueso (F12, segunda fase), decisión a las 19:00.** Sobre una cuadrícula de 2° × 2° de tierra firme, calcula las variables con NASA POWER y un modelo de elevación global a escala gruesa, aplica el mismo índice a los 6 sitios y guarda las 20 mejores celdas por sitio en `web/public/data/scan.json`, con `pipeline/scan.py`. Solo si hay un camino de datos que funcione sin descargas enormes; si no, se descarta sin drama.

**S-4. `web/src/lib/score.ts`, hasta las 02:00.** Función en TypeScript que recalcula el puntaje de un par a partir de `norm_diff` y unos pesos dados, con exactamente la misma fórmula que `similarity.py`, y una prueba que compare ambos resultados con los datos de ejemplo. La usa Fernando para los sliders (F10).

**S-5. Defensa técnica, hasta las 06:00.** `docs/PREGUNTAS_JURADO.md`: las 10 preguntas técnicas más probables (comparabilidad entre cuerpos, por qué estas variables, qué no mide el índice, validación) con una respuesta corta y honesta para cada una. Con Joel.

## Restricciones

- Solo edito `pipeline/similarity.py`, `pipeline/validate.py`, `pipeline/sensitivity.py`, `pipeline/scan.py`, `docs/METODOLOGIA.md`, `docs/PREGUNTAS_JURADO.md`, `web/src/lib/score.ts` y `web/public/data/{results,sites,candidates,scan}.json`.
- Solo biblioteca estándar de Python en el pipeline.
- Si cambias la fórmula, avisa en el grupo: afecta a Fernando, Dante y a la metodología.
- Honestidad científica: un puntaje bajo para los cráteres polares lunares es un resultado, no un error. Se explica, no se maquilla.

## Formato de respuesta

Argumentos breves y concretos, código completo con su ruta, listo para pegar. Pregunta solo si algo bloquea.

## Primer paso

Te pego ahora `pipeline/similarity.py`. Haz la revisión de S-1 y dime qué cambiarías, en orden de importancia.
