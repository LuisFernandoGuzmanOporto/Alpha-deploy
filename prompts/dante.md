# Prompt de Dante: datos de la Luna y Marte, comparador y globo 3D

Uso: en un chat nuevo pega primero `CONTEXT.md` completo y luego todo lo que sigue. IA recomendada: Claude.

---

Actúa como ingeniero de datos geoespaciales y desarrollador front end senior en un hackathon de unas 24 horas. Yo soy Dante, del equipo descrito en `CONTEXT.md`. Mi trabajo tiene dos partes: primero los datos de los sitios de la Luna y Marte, y después el comparador lado a lado y el globo 3D.

## Parte 1. `data/sites.json`

Debo entregar 6 sitios: Faustini Rim A, Peak Near Cabeus B y Malapert Massif (Luna, polo sur); Jezero, Gale y Arcadia Planitia (Marte). Confirma conmigo si alguno no tiene datos y proponme el reemplazo.

Para cada sitio necesito las 5 variables de `CONTEXT.md` sección 5, calculadas en la **ventana común de 10 × 10 km** alrededor del punto, con el modelo de elevación remuestreado a unos 250 m por píxel:

- `slope_deg`: pendiente media del terreno.
- `relief_m`: desviación estándar de la elevación en la ventana.
- `temp_mean_c`: temperatura media anual de superficie.
- `precip_mm_year`: 0, con la fuente "sin precipitación atmosférica".
- `albedo`: reflectividad de la superficie, de 0 a 1.

Ayúdame con:

1. De dónde sale cada dato (Moon Trek, Mars Trek, LOLA, MOLA, HRSC, Diviner, y los productos de temperatura y albedo de Marte) y cómo obtenerlo con los menos pasos posibles. Para la temperatura lunar prioriza los productos polares de Diviner, que el reto destaca como recurso oficial. Si una fuente exige una descarga pesada o un registro, dime la alternativa más rápida.
2. Un procedimiento reproducible y, si conviene, un script de Python en `pipeline/moon_mars/` para calcular pendiente y relieve en la ventana común a partir de un recorte del modelo de elevación.
3. Las coordenadas de cada sitio con su sistema (planetocéntrico o planetográfico) anotado en `notes`.
4. `tags` de cada sitio con el vocabulario cerrado de `CONTEXT.md` sección 5 (geología, hielo, cuevas o tubos de lava, polvo...), solo con lo que la literatura o los datos de misión respalden, y en `notes` la evidencia de hielo cuando exista (Diviner, LEND, Mini-RF).
5. El JSON final con el formato exacto del contrato, incluidos los `tags`.

**Entrega por etapas:** versión 1 con 3 sitios a las 15:00 para desbloquear a Sebastián; los 6 sitios a las 17:00.

## Parte 2. Comparador (F3), hasta las 23:00

Componente `Comparador` en `web/src/components/compare/` con React y TypeScript:

- Entrada: el sitio, el candidato, sus valores por variable y `norm_diff` de `results.json`.
- Dos columnas lado a lado con los valores y la unidad de cada variable.
- Barras por variable y un gráfico de radar con Recharts.
- La diferencia por variable en palabras sencillas (por ejemplo, "mucho más árido").
- Variables sin dato mostradas como "sin dato", nunca como 0.
- Bloque "Coincidencias cualitativas": los `tags` compartidos y los exclusivos de cada lado (de `tag_overlap`).
- Bloque "Dónde falla la analogía": las variables con mayor diferencia y los límites universales de la Tierra como análogo.
- Accesible: contraste, texto alternativo y navegación con teclado.

## Parte 3. Globo 3D (F6, segunda fase), hasta las 05:00

Componente en `web/src/components/globe/` con `globe.gl`: pestañas Tierra, Luna y Marte, el sitio seleccionado resaltado y sus 5 mejores análogos marcados. Usa texturas de NASA de uso público y anótalas en `docs/ATRIBUCION.md`. Solo se empieza si el núcleo está cerrado.

## Restricciones

- Solo edito `data/sites.json`, `pipeline/moon_mars/`, `web/src/components/compare/` y `web/src/components/globe/`.
- **Nunca inventes datos.** Si un valor no se consigue, va `null` con una nota. Cada valor no nulo lleva su fuente en `sources`.
- Corre `python pipeline/validate.py` antes de cada PR de datos.

## Formato de respuesta

Pasos numerados y mínimos, y código o JSON completo, listo para pegar, con su ruta. Pregunta solo si algo bloquea.

## Primer paso

Dime, para cada una de las 5 variables y para Luna y Marte por separado, la fuente exacta más rápida y cómo obtener el valor de un sitio. Después el procedimiento para Faustini Rim A.
