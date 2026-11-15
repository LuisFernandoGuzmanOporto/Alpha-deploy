# Tareas por persona (versión 2)

Fuente de verdad del avance. Cada quien marca sus casillas en su propio PR. Horas en hora de Bolivia. Suposición: arranque sábado 08:00, entrega domingo antes de las 10:00 (ver `CONTEXT.md`, sección 2). Repositorio: https://github.com/LuisFernandoGuzmanOporto/Alpha-deploy.git

Dependencias clave: todos trabajan contra el contrato de datos (`CONTEXT.md`, sección 6). Mientras no haya datos reales, todos usan `data/examples/`.

## Hitos del equipo

| Hora | Hito |
| --- | --- |
| Sáb 12:30 | Repositorio clonado por todos, esqueleto de la web desplegado, requisitos del evento confirmados |
| Sáb 15:30 | Primer `results.json` con datos parciales |
| Sáb 19:00 | Datos completos versión 1 y decisión sobre F12 (escaneo global) |
| Dom 00:00 | Núcleo F1 a F5, F9 y F11 en producción |
| Dom 02:00 | Revisión de segunda fase: sigue o se descarta |
| Dom 05:00 | Segunda fase integrada y QA completo |
| Dom 07:00 | Congelamiento de código |
| Dom 10:00 | Entrega enviada |

**Turnos de sueño (tres horas cada uno):** Turno A, de 00:30 a 03:30: Fernando, Lian y Joel. Turno B, de 03:30 a 06:30: Dante, Sebastián y Noe. Todos despiertos a las 06:30.

---

## Fernando: líder técnico, interfaz y mapa

IA recomendada: Claude. Prompt: `prompts/fernando.md`.

- [ ] **F-1 (ya, 45 min).** Subir el starter al repositorio Alpha-deploy (pasos en `GIT.md`), invitar al equipo, conectar Vercel (carpeta raíz `web`) y proteger `main`. _Estado: equipo invitado y `main` protegida con un ruleset; falta conectar Vercel._
- [x] **F-2 (hasta 12:30).** Esqueleto de `web/` con Vite, React y TypeScript; instalar `maplibre-gl`, `recharts` y `react-router-dom`. Publicar `web/src/types.ts` con los tipos del contrato (incluidos `known`, `tags` y `tag_overlap`) y las rutas `/`, `/comparar/:siteId/:candidateId`, `/metodologia`. Desplegado en Vercel con los datos de demostración.
- [x] **F-3 (hasta 18:00).** F1 selector de sitio, F2 mapa con el ranking (marcadores por puntaje) y lista lateral, F5 filtro Bolivia.
- [x] **F-4 (hasta 00:00).** Integrar los componentes de Noe, Dante y Lian. F9 página de metodología que muestra `docs/METODOLOGIA.md`. **F11 descubrimientos:** interruptor "solo poco estudiados", etiqueta Nuevo o Conocido y vista de los 5 mejores poco estudiados por sitio. Panel fijo de limitaciones universales en fichas y comparador. Estados de carga y de error. _Estado: todo integrado en `main` (selector, mapa, comparador, globo, descubrimientos, metodología, limitaciones, estados de carga y error)._
- [ ] **F-5 (continuo).** Revisar PRs en menos de 15 minutos y mantener `main` siempre desplegable.
- [x] **F-6 (segunda fase, desde 00:00).** F10 sliders de pesos con `web/src/lib/score.ts` de Sebastián. F12 capa del escaneo global si existe `scan.json`. Rendimiento y revisión final en móvil. _Estado: sliders de pesos (F10), selector ES/EN y rendimiento hechos; F12 descartado (S-7)._

## Dante: datos de la Luna y Marte, comparador y globo 3D

IA recomendada: Claude. Prompt: `prompts/dante.md`.

- [x] **D-1 (versión 1 con 3 sitios a las 15:00; completo a las 17:00).** `data/sites.json` con los 6 sitios: coordenadas, las 5 variables en la ventana común, fuente por variable, `tags` con respaldo y nota de evidencia de hielo cuando exista. Temperatura lunar con los productos polares de Diviner. Scripts de apoyo en `pipeline/moon_mars/`.
- [x] **D-2 (hasta 23:00).** F3 componente `Comparador` en `web/src/components/compare/`: dos columnas, barras por variable, radar, bloque de coincidencias cualitativas y bloque "dónde falla la analogía".
- [x] **D-3 (segunda fase, hasta 05:00).** F6 globo 3D en `web/src/components/globe/` con pestañas Tierra, Luna y Marte, el sitio elegido y sus 5 mejores análogos. Atribución de texturas en `docs/ATRIBUCION.md`.

## Lian: datos de la Tierra y Bolivia, descubrimiento, fichas, explicaciones y PDF

IA recomendada: ChatGPT con búsqueda web para la literatura, y la IA de código que tengas para los scripts. Prompt: `prompts/lian.md`.

- [x] **L-1 (versión 1 con 10 candidatos a las 15:00; completo a las 19:00).** `data/candidates.json` con 40 o más: 12 o más conocidos, 25 o más poco estudiados y 8 o más de Bolivia. Variables, fuentes, `known`, `tags` y referencias. Scripts de apoyo en `pipeline/earth/`. _Estado: 47 candidatos (29 conocidos, 18 poco estudiados, 10 de Bolivia; la auditoría de la fase final pasó 7 a conocidos, ver `docs/AUDITORIA_KNOWN.md`); 6 avisos de `validate.py` (3 sin etiqueta citable y el albedo lunar). McMurdo, Svalbard, La Corona y Manjanggul ya tienen pendiente y relieve (Copernicus DEM)._
- [x] **L-2 (hasta 00:00 para los del top 10 de algún sitio; el resto hasta 04:00).** F4 `web/public/data/fichas.json` con resumen, procesos, usos, **dónde falla la analogía** y referencias. Solo afirmaciones citables. _Estado: 47 fichas, una por candidato (las 31 del top 10 de #52 y 16 más). Los lugares sin estudio planetario publicado dicen "propuesta del equipo"._
- [x] **L-3 (segunda fase, hasta 04:00).** F7 `web/public/data/explicaciones.json`: explicación de 3 a 4 frases, con lo que se parece y dónde falla, para los 5 mejores pares de cada sitio, redactada con IA y revisada por una persona. _Hecho en la fase final de otra forma: plantilla fija en `web/src/lib/explain.ts` (sin IA ni JSON aparte), 30 pares en español e inglés revisados a mano; se muestra en la comparación._
- [x] **L-4 (segunda fase, hasta 06:00).** F8 exportar ficha a PDF en `web/src/features/export/` con estilos de impresión. _Hecho en la fase final: botón "Exportar a PDF" en la comparación (`window.print()`) y hoja de impresión en `web/src/styles/app.css`; verificado con `Page.printToPDF`._

## Sebastián: índice, validación y metodología

IA recomendada: Claude o el modelo con más razonamiento que tenga tu plan. Prompt: `prompts/sebastian.md`.

- [x] **S-1 (hasta 13:00).** Revisar `pipeline/similarity.py`, confirmar variables, transformaciones, ventana común, pesos y el papel de `tag_overlap`. Primer borrador de `docs/METODOLOGIA.md`.
- [x] **S-2 (continuo desde 15:00).** Correr el pipeline cada vez que lleguen datos, validar con `validate.py` y commitear `web/public/data/*.json`. Primer `results.json` a las 15:30. _Estado: `results.json` regenerado con el catálogo integrado (47 candidatos)._
- [x] **S-3 (hasta 00:00).** Análisis de sensibilidad: estabilidad del ranking al mover los pesos y al quitar una variable. Resultados en `docs/METODOLOGIA.md`.
- [x] **S-6 (hasta 01:00).** Validación y descubrimiento: los `known: true` aparecen arriba para sus sitios; cuántos poco estudiados entran al top 5 y por qué. Esa es nuestra tesis de descubrimiento y debe quedar escrita.
- [x] **S-4 (hasta 02:00).** `web/src/lib/score.ts`: recalcular el puntaje con otros pesos a partir de `norm_diff`, idéntico al pipeline, con una prueba.
- [x] **S-5 (hasta 06:00).** `docs/PREGUNTAS_JURADO.md`: las 10 preguntas técnicas más probables con su respuesta, junto con Joel. _Estado: las 10 respuestas están con resultados reales; falta el ensayo con Joel._
- [x] **S-7 (segunda fase, decisión a las 19:00).** F12 escaneo global grueso en `pipeline/scan.py` con `web/public/data/scan.json`. Solo si hay un camino de datos que funcione sin descargas enormes; si no, se descarta. _Estado: descartado y registrado en `docs/METODOLOGIA.md`, sección 9._

## Noe: diseño y componentes visuales

IA recomendada: ChatGPT para ideas y textos, y la IA de código que tengas para los componentes. Prompt: `prompts/noe.md`.

- [x] **N-1 (hasta 12:30).** Identidad: nombre, logo SVG, paleta, tipografías y `web/src/styles/tokens.css`. Wireframes de las 4 pantallas en `docs/design/`.
- [x] **N-2 (hasta 18:00).** Componentes en `web/src/components/ui/`: Layout, Header, Footer, Button, Card, SiteCard, AnalogCard, ScoreBadge, VariableBar, Tag, Tabs, **KnownBadge**, **TagList** y **LimitationsPanel**. Si no programas React, entregas diseño y CSS y Fernando integra.
- [x] **N-3 (hasta 00:00).** Textos de la interfaz en `web/src/content/es.ts`, incluido el texto de las limitaciones universales y una frase por cada tag. Estilo de la página de metodología.
- [ ] **N-4 (hasta 05:00).** Responsive en móvil y accesibilidad: contraste mínimo 4.5:1, foco visible, textos alternativos. _Estado: entregado; falta verificarlo sobre el rediseño #45 (`docs/pendientes/noe.md`)._
- [ ] **N-5 (hasta 07:00).** Material visual para el pitch: capturas, tema de las diapositivas y póster. _Estado: las capturas de `docs/design/` son del diseño anterior._

## Joel: requisitos, README, pitch, video, informe, QA y entrega

IA recomendada: ChatGPT. Prompt: `prompts/joel.md`.

- [x] **J-1 (en la primera hora).** `docs/REQUISITOS.md`: entregables, formato, idioma, duración del pitch y del video, plazo, plataforma de envío y criterios de evaluación. Revisar la pestaña Resources del reto. Avisar al grupo de cualquier cambio.
- [x] **J-2 (hasta 18:00).** `README.md` principal y `docs/ATRIBUCION.md` con fuentes, licencias y créditos de NASA.
- [ ] **J-3 (hasta 00:00).** `docs/QA.md`: matriz de pruebas. Primera pasada de QA sobre producción en escritorio y móvil; bugs como Issues de GitHub. _Estado: primera y segunda pasada hechas; falta la pasada sobre producción (necesita Vercel)._
- [ ] **J-4 (hasta 06:00).** `docs/PITCH.md`: guion con el lenguaje del reto (identificar, caracterizar, qué es análogo, dónde falla, conexión con la exploración), diapositivas y guion gráfico del video. _Estado: guion con cifras verificadas; faltan oradores confirmados, URL de Vercel y las capturas._
- [x] **J-4b (hasta 06:00).** `docs/INFORME.md`: informe público de 2 a 3 páginas con método, hallazgos (mejores análogos por sitio, los inesperados, el caso de Bolivia) y dónde falla la analogía.
- [ ] **J-5 (07:00 a 09:00).** Grabar el video y ensayar el pitch 3 veces con el equipo.
- [ ] **J-6 (09:00).** Lista de verificación de entrega y envío antes de las 10:00.

---

## Fase final (`prompts/fase-final.md`, domingo 15/11 de 00:00 a 01:15, Dante con Claude)

- [x] **Tarea 1:** auditoría de `known` (6 lugares pasan a conocidos, `docs/AUDITORIA_KNOWN.md`) y coordenadas verificadas del Atacama (Yungay), Mauna Kea y Río Tinto. Textos y demo actualizados.
- [x] **Tarea 2:** metadatos y favicon, `LICENSE` (MIT), README con capturas y uso en 60 segundos, referencias de las fichas en la entrega, integración continua (`.github/workflows/ci.yml`) y exportar a PDF (F8). **Pendiente de Fernando:** descripción y temas del repositorio (`gh repo edit`, la cuenta de Dante no tiene permiso) y desbloquear GitHub Actions (cuenta bloqueada por facturación).
- [x] **Tarea 3:** rendimiento. Móvil lento: primer contenido de 2,0 a 1,7 s y bloqueo de ~610 a ~410 ms; sin saltos de diseño al cargar. Detalle en `docs/QA.md`.
- [x] **Tarea 4:** perfiles por objetivo de misión, insignia de robustez comprobada contra `sensitivity.py`, comparar hasta 3 análogos y explicaciones F7.

## Regla de oro

Si te bloqueas más de 20 minutos, avisa en el grupo. Si una tarea se atrasa, avisa antes de la hora límite, no después.
