# Prompt de Lian: datos de la Tierra y Bolivia, fichas, explicaciones y PDF

Uso: en un chat nuevo pega primero `CONTEXT.md` completo y luego todo lo que sigue. IA recomendada: ChatGPT con búsqueda web activada para la literatura, y la IA de código que tengas para los scripts.

---

Actúa como ingeniera de datos geoespaciales y redactora científica en un hackathon de unas 24 horas. Yo soy Lian, del equipo descrito en `CONTEXT.md`. Mi trabajo tiene dos partes: los datos de los candidatos terrestres, y después el contenido de las fichas, las explicaciones y la exportación a PDF.

## Parte 1. `data/candidates.json`

Debo entregar **40 o más lugares de la Tierra**: mínimo 12 **conocidos** (`known: true`, ya documentados como análogos en la literatura, sirven para validar que el índice funciona), mínimo 25 **poco estudiados** (`known: false`) y **mínimo 8 de Bolivia**. El reto dice explícitamente que el objetivo no es redescubrir los sitios famosos, así que el valor está en los poco estudiados.

- **Conocidos para validar:** Atacama (Yungay), Valles Secos de la Antártida, Isla Devon (Haughton), Mars Desert Research Station, Danakil, Islandia (Askja), Mauna Kea, Río Tinto, Valle de la Muerte, Meteor Crater, Svalbard y Lut.
- **Poco estudiados:** no hay lista cerrada. Propón candidatos con una razón basada en datos (por ejemplo, muy árido, frío y de mucho relieve) entre desiertos fríos de altura, campos volcánicos áridos, salares, mesetas polares y periglaciares, cráteres de impacto, cuevas, tubos de lava y minas. Busca en la literatura si ya se estudian como análogos: si sí, pasan a `known: true`.
- **Bolivia (mínimo 8):** Salar de Uyuni, Laguna Colorada, Laguna Verde, Desierto de Siloli, Sud Lípez, Salar de Coipasa, campos volcánicos del Altiplano y otros que encuentres.

Verifica cada uno contra la literatura y descarta o agrega según lo que se pueda citar.

Para cada lugar necesito las 5 variables de `CONTEXT.md` sección 5, en la **ventana común de 10 × 10 km**:

- `slope_deg` y `relief_m` a partir de un modelo de elevación abierto (SRTM u otro), con el mismo remuestreo de unos 250 m por píxel que usa Dante.
- `temp_mean_c` y `precip_mm_year` de NASA POWER (temperatura de superficie y precipitación, climatología).
- `albedo` de un producto abierto (por ejemplo MODIS).

Ayúdame con:

1. Cómo obtener cada dato de la forma más rápida y qué hacer si una fuente exige registro o descarga pesada (por ejemplo, una API de elevación o un servicio de teselas abiertas en lugar de descargar archivos completos).
2. Un script de Python en `pipeline/earth/` que, dada una lista de coordenadas, consulte NASA POWER y calcule pendiente y relieve en la ventana común, y escriba el JSON con el formato del contrato.
3. Para cada candidato: `country`, `is_bolivia`, `known`, `analog_for` (`moon`, `mars` o ambos), `tags` (vocabulario cerrado de `CONTEXT.md` sección 5, solo con respaldo), `why` (una frase) y `reference_urls` con enlaces **que abran y digan lo que se afirma**.

**Entrega por etapas:** versión 1 con 10 candidatos (5 conocidos, 5 poco estudiados, 4 de Bolivia) a las 15:00 para desbloquear a Sebastián; los 40 o más a las 19:00.

## Parte 2. Fichas (F4), hasta las 00:00

`web/public/data/fichas.json`: una ficha por candidato, empezando por los que aparezcan en el top 10 de algún sitio (hasta las 00:00) y el resto hasta las 04:00, con estos campos:

```json
{
  "candidate_id": "earth-salar-de-uyuni",
  "summary": "2 o 3 frases",
  "use_cases": ["pruebas de rovers", "entrenamiento de astronautas"],
  "processes": ["procesos activos que sirven de análogo, por ejemplo erosión eólica"],
  "breaks_down": ["dónde falla la analogía con este sitio concreto"],
  "references": [{"title": "...", "url": "..."}]
}
```

Solo afirmaciones que se puedan respaldar con una referencia que abra. Lo demás se marca "(a verificar)". Los límites son tan importantes como los usos: un jurado técnico los va a buscar.

## Parte 3. Explicaciones (F7, segunda fase), hasta las 04:00

`web/public/data/explicaciones.json`: para los 5 mejores pares de cada sitio (según `results.json`), una explicación de 3 a 4 frases en español que use los `norm_diff` para decir en qué se parecen y en qué se diferencian. Las genero con IA, **las reviso una por una** y se guardan como texto fijo. No hay llamadas a IA en producción.

## Parte 4. Exportar a PDF (F8, segunda fase), hasta las 06:00

Botón en `web/src/features/export/` que exporta la ficha de un análogo a PDF con estilos de impresión (`@media print`) y `window.print()`, o `jsPDF` si hace falta.

## Restricciones

- Solo edito `data/candidates.json`, `pipeline/earth/`, `web/public/data/fichas.json`, `web/public/data/explicaciones.json` y `web/src/features/export/`.
- **Nunca inventes datos ni referencias.** Si un valor no se consigue, va `null` con una nota. Cada valor no nulo lleva su fuente en `sources`.
- Corre `python pipeline/validate.py` antes de cada PR de datos.

## Formato de respuesta

Pasos numerados y mínimos, y código o JSON completo, listo para pegar, con su ruta. Pregunta solo si algo bloquea.

## Primer paso

Dame el script de Python para consultar NASA POWER (temperatura de superficie y precipitación media anual) para una lista de coordenadas, y dime cuál es la forma más rápida de obtener pendiente y relieve de una ventana de 10 × 10 km sin descargar archivos enormes.
