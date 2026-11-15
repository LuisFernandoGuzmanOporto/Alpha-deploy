# Prompt de la fase final (para Claude Code)

Pega todo este archivo en tu Claude Code, dentro de la carpeta del repositorio. Haz las tareas **en orden**, sin pedir confirmación entre una y otra, y avísame solo si algo te bloquea más de 20 minutos.

## 0. Contexto

Proyecto: **Earth Analogs** (NASA Space Apps Challenge Cochabamba 2026). Es una web que, para 6 sitios de la Luna y Marte, ordena 47 lugares de la Tierra por similitud y muestra dónde falla cada analogía. Repositorio: https://github.com/LuisFernandoGuzmanOporto/Alpha-deploy.

Antes de tocar nada, lee: `CONTEXT.md`, `CLAUDE.md`, `GIT.md`, `TASKS.md`, `docs/METODOLOGIA.md`, `docs/PREGUNTAS_JURADO.md` y `docs/pendientes/`. Luego corre `git pull origin main`.

**Plazos:** congelamiento de código el domingo a las 07:00 (hora de Bolivia); entrega interna antes de las 10:00. **A partir de las 05:00 no empieces funciones nuevas**: solo correcciones.

**Fuera de tu alcance (lo hace Fernando):** Vercel y la URL pública, el video, los ensayos, el envío del formulario, los nombres del equipo en la diapositiva 1 y las pruebas con lector de pantalla.

### Estado actual de `main` (lo que ya está hecho; no lo rehagas)

- Web completa y verificada: selector, mapa a pantalla completa con ranking, filtros (Bolivia y poco estudiados), pesos con sliders, comparador (tabla, radar, "dónde falla", ficha), descubrimientos, metodología ES/EN, globo 3D, selector de idioma. El diseño (paleta azul noche) es de Noe: **no lo cambies**.
- Datos: 6 sitios y 47 candidatos, 47 fichas, todo en español y en inglés. El inglés de los datos vive en `web/src/content/dataEn.ts` (una capa por `id`); un test falla si un lugar o una ficha nuevos no tienen su traducción.
- Pendiente y relieve de McMurdo, Svalbard, La Corona y Manjanggul con Copernicus DEM (`pipeline/earth/copernicus_dem.py`). Con eso los rankings lunares tienen 47 pares y los **Valles Secos de McMurdo son el primero para Cabeus y Malapert**.
- Clasificación `known`: 22 conocidos y 25 poco estudiados. Gilf Kebir y Ojos del Salado se corrigieron a `known: true` porque la búsqueda inicial (solo Crossref) los había clasificado mal. **Por eso la tarea 1 es la más importante.**
- Calidad: 61 pruebas, `tsc`, compilación y validación de datos pasan (0 errores, 6 avisos); pasada de QA con clics reales de 34 comprobaciones.
- Demo oficial de 7 diapositivas en `docs/demo/` y herramientas de verificación en `docs/qa/` y `pipeline/tools/` (ver el final de este archivo).

## 1. Reglas (obligatorias)

1. **Trabajas directo en `main`** (Fernando lo autorizó para esta fase; tu cuenta lo permite por el bypass de administrador). Haz **commits chicos**, uno por subtarea, con prefijo `feat:`, `fix:`, `data:`, `docs:` o `chore:` y termina cada mensaje con la línea `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. Antes de cada `git push origin main`: `git pull --rebase origin main`. **Nunca** `--force`, ni borres ramas, ni reescribas el historial.
2. **`main` siempre debe compilar.** Antes de cada push corre, desde `web/`: `npx tsc --noEmit`, `npm test` y `npm run build`; desde la raíz: `python pipeline/validate.py` (0 errores). Cuando cambies algo visible, corre además la pasada de QA (sección 6).
3. **Nunca inventes datos.** Si un valor no se consigue, queda en `null` con su motivo. Cada afirmación de una ficha o de un documento debe poder citarse. Las cifras de los textos se **calculan de los datos**, no se escriben de memoria (hay herramientas para eso).
4. **Investiga a fondo, no solo en Wikipedia.** Wikipedia sirve para describir un lugar y obtener coordenadas, pero **no** para decidir si algo está documentado como análogo planetario. Usa, en este orden: Crossref (`api.crossref.org/works`), **OpenAlex** (`api.openalex.org/works?search=...`, gratuita y sin clave), Semantic Scholar, el servidor de informes de NASA **NTRS** (`ntrs.nasa.gov/api/citations/search?q=...`), NASA Astrobiology, las páginas de los artículos (resúmenes) y la búsqueda web general. Lee el **resumen** de cada artículo antes de citarlo. Si un resultado de búsqueda dice algo, **verifica en la fuente primaria**: ya nos pasó que un resumen automático mezcló dos artículos distintos (decía que había permafrost en el Licancabur cuando el estudio dice lo contrario).
5. **Imágenes:** nada generado con IA (las reglas oficiales exigen marca de agua y nuestro formulario dice que no hay ninguna). Solo capturas reales de la web o imágenes con licencia y crédito. Sin logos de NASA.
6. **Dependencias nuevas** solo si son indispensables; las de desarrollo son aceptables. El pipeline usa solo la biblioteca estándar de Python.
7. **Tropiezos conocidos en Windows:** en Python usa `PYTHONIOENCODING=utf-8`; para bajar archivos usa `curl` (Python falla con algunos certificados) y **nunca desactives la verificación TLS**; Wikipedia limita las consultas rápidas (espera de 3 a 8 s entre llamadas); para escribir archivos largos usa la herramienta de escritura, no varios heredocs.

### Lista obligatoria cuando cambie `known`, una coordenada o cualquier dato

Si cambias algo que mueve cifras, haz **todo** esto, una sola vez al final de cada bloque de cambios:

1. Edita `pipeline/earth/seed.json` (nunca solo `data/candidates.json`).
2. `python pipeline/earth/build_candidates.py --only <id,id>`; luego `python pipeline/validate.py` y `python pipeline/similarity.py`.
3. Ficha del lugar en `web/public/data/fichas.json` (español) **y** su traducción en `web/src/content/dataEn.ts` (`FICHAS_EN`, y `CANDIDATE_WHY_EN` si el `why` es escrito a mano). Las listas deben tener la misma longitud en ambos idiomas (un test lo comprueba).
4. Recalcula con las herramientas: `python pipeline/tools/validation_summary.py`, `python pipeline/tools/sensitivity_summary.py`, `python pipeline/tools/ficha_rank_claims.py` (revisa que ninguna frase de una ficha sobre puestos o "top 10" haya quedado falsa).
5. Actualiza los textos que citan esas cifras, en **español e inglés** donde existan: `README.md` (conteos), `TASKS.md` (L-1), `docs/METODOLOGIA.md` y `docs/METODOLOGIA.en.md` (tablas S-3 y S-6 y sus párrafos), `docs/INFORME.md`, `docs/PREGUNTAS_JURADO.md` (respuestas 3, 6, 8 y 9), `docs/PITCH.md`, `docs/ENTREGA.md` (hallazgos), `docs/ATRIBUCION.md` si hay fuentes nuevas.
6. Regenera la demo: `SLIDES=docs/demo/slides.html node --experimental-websocket docs/demo/capture.mjs http://localhost:4173 docs/demo/img` (con la build servida) y revisa las 7 diapositivas.
7. Verifica y sube.

## 2. Tarea 1 (la más importante): honestidad científica

**Objetivo:** que ninguna afirmación de "poco estudiado" o "descubrimiento" sea falsa, y que las coordenadas dudosas queden verificadas.

### 1a. Auditar los 24 lugares con `known: false`

Hoy son poco estudiados (en el catálogo): Laguna Colorada, Laguna Verde (Bolivia), Uturuncu, Sajama, Torotoro (Umajalanta), Siloli (Árbol de Piedra), Tunupa, Badain Jaran, Rub' al Khali, Namib, Harrat Khaybar, Socompa, El Malpais, Manjanggul, Undara, Lava Beds, Etosha, Chott el Djerid, Tengger, Dasht-e Kavir, Lago Eyre, Hoggar, Taklamakan, Pamir, Arizaro. (Salvo los que ya se confirmaron, revisa todos.)

**Criterio:** `known: true` solo si una publicación presenta **ese lugar** (o su sitio concreto) como análogo planetario de la Luna o de Marte, y se puede citar con DOI, informe NTRS o enlace estable. Un análogo "de la región" cuenta solo si nombra el lugar; documenta cada decisión dudosa.

**Pistas que ya encontré (verifícalas, no las des por ciertas):**
- **Laguna Verde (Bolivia):** la página de NASA Astrobiology sobre el *High Lakes Project* (Nathalie Cabrol) la incluye, junto con Laguna Blanca, entre los lagos de estudio del Altiplano como análogo de Marte primitivo. Busca los artículos revisados por pares del proyecto (por ejemplo Cabrol et al. 2009, *The High Lakes Project*, JGR) y confirma que hablan de **esta** laguna. Probablemente deba pasar a `known: true`. Está 4.ª en Faustini.
- **Socompa:** Costello et al. 2009 (*Applied and Environmental Microbiology*, ya citado en su ficha) y declaraciones de una astrobióloga de NASA lo describen como análogo terrestre de oasis hidrotermales de Marte. Busca si algún artículo lo enmarca así de forma explícita.
- **Uturuncu / Altiplano-Puna:** hay un resumen de Europlanet 2022 (doi:10.5194/epsc2022-276, "Testing rheological models on Central Andean volcanic geoforms as analogues for Mars") sobre coladas de lava del complejo volcánico; comprueba si incluye al Uturuncu. El artículo de *Remote Sensing* 2022 (doi:10.3390/rs14092081) cubre el norte de Chile.
- **Tubos de lava (El Malpais, Lava Beds, Undara, Manjanggul):** existe una revisión sobre tubos de lava terrestres como análogos de Marte (EGU 2021, doi:10.5194/egusphere-egu21-16044) y un resumen de la GSA 2024 sobre cuevas de Lava Beds (doi:10.1130/abs/2024am-403115). Lee ambos: pueden nombrar esos lugares.
- **Rub' al Khali y Lago Eyre:** NTRS tiene registros de esteras microbianas (ids 20160012254 y 19890016966) que pueden enmarcarlos como análogos. Compruébalo leyendo el resumen.
- **Sin evidencia en mis búsquedas** (revisa más a fondo, con OpenAlex y NTRS): Laguna Colorada, Sajama, Siloli, Torotoro, Tunupa, Namib, Badain Jaran, Taklamakan, Tengger, Dasht-e Kavir, Etosha, Chott el Djerid, Hoggar, Pamir, Arizaro, Harrat Khaybar.

**Método:** para cada lugar, busca (nombre en inglés y en español, y variantes: "analog", "analogue", "Mars", "Martian", "lunar", "planetary") en Crossref, OpenAlex, NTRS y la web; lee los resúmenes; guarda el resultado. Puedes empezar con `python pipeline/tools/audit_known.py`, pero es una primera pasada **débil**: no la tomes como veredicto.

**Entregable:** `docs/AUDITORIA_KNOWN.md` con una tabla (lugar, búsquedas hechas, fuentes encontradas con DOI o id, decisión y motivo). Para los que pasen a `known: true`: en el seed, `known`, `analog_for` correcto, `why` escrito a mano y `references` con los DOI. Después aplica **una vez** la lista obligatoria de la sección 1. Si cambia el podio lunar o los conteos, actualiza todos los textos (no dejes cifras viejas).

### 1b. Verificar las coordenadas marcadas "a verificar"

Tres lugares (busca `verificar` en `pipeline/earth/seed.json`):
- **Núcleo hiperárido del Atacama (Yungay):** el punto actual (−24,5; −69,25) es el centro del desierto, no la estación de Yungay. Es el 1.º de Faustini. Busca las coordenadas del sitio de estudio en los artículos que ya cita su ficha (Navarro-González et al. 2003 y posteriores) o en un gazetteer. Si las mueves, cambian temperatura, precipitación, pendiente y relieve, y **todo el ranking puede cambiar**: aplica la lista obligatoria completa y revisa los textos.
- **Mauna Kea:** el punto es la cumbre, pero las pruebas de análogo lunar se hicieron en las laderas (Nakamura y Smith 2010). Busca el sitio real de la prueba. Decide con criterio: si hay coordenadas citables, muévelo; si no, deja la cumbre y el aviso que ya está en su ficha.
- **Río Tinto:** (37,70; −6,55). Compáralo con la coordenada de Minas de Riotinto en una fuente (Wikipedia, GeoNames) y, si coincide, quita la marca "a verificar" y cita la fuente.

Quita la marca "a verificar" solo cuando exista una fuente citada.

## 3. Tarea 2: entrega y calidad

Haz estas subtareas en este orden y un commit por cada una.

**2a. Metadatos de la web** (`web/index.html` hoy solo tiene `<title>`):
- `lang="en"` (el idioma real lo fija la aplicación al cargar), descripción, `theme-color`, favicon (`web/public/favicon.svg`, partiendo de `docs/design/logo.svg`) y etiquetas Open Graph y Twitter.
- `og:image` necesita una URL absoluta. Inyéctala en el build con `transformIndexHtml` en `web/vite.config.ts`, usando la variable de entorno `VERCEL_PROJECT_PRODUCTION_URL` cuando exista y dejando una ruta relativa si no. La imagen (1200 × 630, en `web/public/`) debe ser una **captura real** de la web (`docs/demo/img/`), no generada.
- Comprueba con una captura de Chrome que la pestaña muestra el favicon y el título.

**2b. Licencia y repositorio:** agrega `LICENSE` (MIT, "© 2026 Earth Analogs team") y en el README una nota: el código es MIT; los datos vienen de fuentes con sus propios términos (`docs/ATRIBUCION.md`). Con `gh repo edit` pon la descripción ("Earth analogs for Moon and Mars landing sites: a ranked, explainable similarity index built on NASA data") y los temas (`nasa-space-apps`, `earth-analogs`, `moon`, `mars`, `react`, `typescript`, `maplibre`). **No pongas la URL de la web** (la agrega Fernando con Vercel).

**2c. README:** agrega capturas (usa `docs/demo/img/`), una sección "Úsalo en 60 segundos" (3 o 4 pasos) y dónde está la metodología. Sin marcadores `[PENDING]`.

**2d. `docs/ENTREGA.md`:** completa el marcador `[PENDING: fact-sheet references from Lian...]` (las 47 fichas ya están publicadas y cada una lista sus referencias: artículos con DOI, informes de NASA y Wikipedia). Los otros `[PENDING]` (URL de Vercel, enlace de la demo) **no los toques**.

**2e. Integración continua:** `.github/workflows/ci.yml`, que corra en `push` a `main` y en `pull_request`: en `web/` (Node 22) `npm ci`, `npx tsc --noEmit`, `npm test` y `npm run build`; y en la raíz (Python 3.12) `python pipeline/validate.py` y una comprobación de que `python pipeline/similarity.py` regenera `web/public/data/` sin diferencias, salvo la marca `generated_at`. Tras subirlo, mira el resultado con `gh run list` y `gh run view`; si falla, corrígelo.

**2f. Exportar la ficha a PDF (F8, el único pendiente del alcance original además de F7):**
- Botón "Exportar a PDF" / "Export to PDF" en la página de comparación que use `window.print()`, con i18n ES/EN y accesible con teclado.
- Hoja de estilos de impresión: sin barra superior, pie ni controles, fondo blanco y texto negro, saltos de página razonables, y que se impriman la comparación, la tabla, "dónde falla", la ficha y las **referencias con su URL visible**.
- Compruébalo generando el PDF con Chrome (`Page.printToPDF`, como en `docs/demo/capture.mjs`) y mirando el resultado. Agrégalo a la matriz de `docs/QA.md`.

## 4. Tarea 3: rendimiento

**Línea base (medida con `docs/qa/perf.mjs`):** escritorio, primer contenido a 0,38 s y 637 KB; móvil lento (4G y CPU 4× más lenta), primer contenido a 2,3 s, unos 1,2 s de bloqueo y 586 KB. Paquete principal: 598 KB (195 KB comprimido).

Medidas a aplicar, **midiendo antes y después de cada una** y descartando las que no ayuden:
1. **Cargar el inglés de los datos bajo demanda:** `dataEn.ts` pesa unos 40 KB y se carga siempre. Impórtalo dinámicamente solo cuando el idioma sea inglés (mientras llega, el estado es "cargando"). Mantén las pruebas.
2. **Precargar los JSON** (`results`, `candidates`, `sites`) con `<link rel="preload" as="fetch" crossorigin>` para evitar la cascada JS → datos.
3. **Motion:** revisa qué usa realmente (`App.tsx` y `RankingList.tsx`). Si no usa animaciones de `layout`, cámbialo a `LazyMotion` con `domAnimation` y componentes `m`; si el ahorro es pequeño, déjalo.
4. **Análisis del paquete:** descompón el paquete principal (por ejemplo con el mapa de fuentes) y decide si conviene separar bibliotecas en fragmentos propios para aprovechar la caché.
5. **MapLibre:** ya se carga aparte; prueba a precargar el fragmento después del primer pintado para que el mapa aparezca antes, sin bloquear.
6. Vigila el desplazamiento de diseño (que nada salte al cargar) y que `prefers-reduced-motion` siga sin animaciones.

**Meta:** móvil lento con primer contenido por debajo de 1,8 s y bloqueo por debajo de 600 ms; si no se alcanza, explica por qué. Anota los valores antes y después en `docs/QA.md`. Al terminar cada medida corre la pasada de QA completa.

## 5. Tarea 4: innovación

Hazlas en este orden. Cada una con pruebas, textos ES/EN, accesibilidad por teclado y documentación breve en `docs/METODOLOGIA.md` y `docs/METODOLOGIA.en.md` donde corresponda. **No cambies la fórmula del índice ni `web/src/lib/score.ts`**; son de Sebastián.

**4a. Perfiles por objetivo de misión.** En el diálogo "Filtros" (donde están los sliders), botones que fijan los pesos de las cinco variables según el objetivo: por ejemplo "Igual (por defecto)", "Movilidad de rovers" (pendiente y relieve con más peso), "Energía y sistemas térmicos" (temperatura con más peso) y "Agua y hielo" (precipitación y temperatura). Define pesos razonables y **justifícalos en un comentario y en la metodología**, dejando claro que son perfiles de ejemplo y no una calibración científica. Reutiliza el parámetro de URL `pesos` (el perfil activo se deduce comparando los pesos con la lista) para que los enlaces se puedan compartir. Muestra el nombre del perfil activo y un botón para volver al valor por defecto. Responde a la pregunta del reto "cómo ayuda a la exploración" y a la limitación que declaramos ("no hay calibración por objetivo de misión").

**4b. Insignia de robustez.** Para cada análogo del ranking, muestra cuánto se mueve su puesto cuando se cambian los pesos, por ejemplo "Puesto estable: 1.º a 2.º en 30 de 30 escenarios". Calcúlalo en el navegador con `rescore` y la misma lógica de `pipeline/sensitivity.py` (cada peso ±50 % una vez, y quitar una variable exigiendo al menos tres compartidas). Reglas: ten cuidado con los empates; no dependas solo del color (incluye texto); memoriza el cálculo para que no ralentice; y **comprueba tu resultado contra el pipeline** con una prueba (usa `python pipeline/sensitivity.py` como referencia para algunos casos). Explícalo en una frase en la interfaz y en la metodología. Es lo que más aporta al criterio de validez científica.

**4c. Comparar varios análogos.** En la comparación, permite elegir hasta 3 análogos para el mismo sitio y dibujar un radar con las tres series superpuestas (con Recharts, que ya está), con una tabla alternativa para lectores de pantalla. Parámetro de URL `analogos=a,b,c`. Si no entra en el tiempo, deja la parte básica funcionando y documenta lo que falte.

**4d. (opcional, solo si sobra tiempo) Explicaciones F7.** Frases de 3 a 4 oraciones generadas **con una plantilla determinista** a partir de `norm_diff` y las etiquetas (no con IA en el navegador, no con llamadas a servidores) para los 5 mejores pares de cada sitio. Revísalas a mano.

**No hagas:** el escaneo global (F12, descartado), fuentes de datos nuevas, cambios de paleta, imágenes generadas con IA ni llamadas a servidores.

## 6. Verificación y entrega

Herramientas del repositorio (leen la web servida con `cd web && npm run build && npx vite preview --port 4173`):
- `node --experimental-websocket docs/qa/qa.mjs http://localhost:4173`: 34 comprobaciones con clics y teclas reales, en español e inglés, móvil y tableta. **Debe dar 34 de 34** (agrega las tuyas para lo nuevo). Si Chrome no está en la ruta habitual: `CHROME=<ruta>`.
- `node --experimental-websocket docs/qa/perf.mjs <url> [mobile]`: rendimiento.
- `node --experimental-websocket docs/qa/overflow.mjs <url>`: busca elementos que se salen de 375 px.
- `python pipeline/tools/validation_summary.py`, `sensitivity_summary.py`, `ficha_rank_claims.py`, `check_ficha_urls.py`, `audit_known.py`.

Al terminar todo:
1. Corre la verificación completa (tipos, pruebas, compilación, validación, QA, rendimiento).
2. Agrega a `docs/QA.md` una "Pasada 4" con lo que cambió y los resultados reales, **incluido lo que no pudiste verificar**.
3. Actualiza `TASKS.md` y `docs/pendientes/` con lo que quedó hecho.
4. `git pull --rebase origin main` y `git push origin main`; confirma con `gh run list` que la integración continua pasó.
5. Escríbele a Fernando un informe corto: qué hiciste en cada tarea, qué cifras cambiaron (antes y después), qué decisiones dudosas tomaste con su fuente, qué dejaste sin hacer y por qué.

## Orden sugerido

1. Tarea 1 completa (la 1a es la que más tiempo lleva; hazla a fondo).
2. Tarea 2: 2a, 2b, 2c, 2d, 2e.
3. Tarea 3 (rendimiento).
4. Tarea 2f (PDF).
5. Tarea 4: 4a, 4b, 4c y, si sobra, 4d.

Si el tiempo no alcanza para todo, corta por el final de la lista, nunca por el principio, y deja `main` en un estado que compile y pase todas las comprobaciones.
