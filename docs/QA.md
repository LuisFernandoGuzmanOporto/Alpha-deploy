# QA: matriz de pruebas

Dueño: Joel. Cada fallo va como issue de GitHub con pasos para reproducir. Pasadas previstas: sábado ~14:30 (local), 04:00 y 07:00 (producción).

## Pasada 5: domingo 15/11, ~07:30 (local, revisión de Fernando y Claude)

- **Versión:** `main` + revisión de la fase final (Undara, Socompa, Rub' al Khali y nueve lugares nuevos; ver `docs/INFORME_FASE_FINAL.md`, "Revisión posterior"). Build de producción con `vite preview`; sigue sin estar en Vercel.
- **Navegador:** Google Chrome sin interfaz, clics y teclas reales por CDP (`docs/qa/qa.mjs`). Firefox, Safari, lector de pantalla y teléfono real **no se probaron**.
- **Datos:** 56 candidatos (31 conocidos, 25 poco estudiados, 13 de Bolivia), 6 sitios. `validate.py`: 0 errores, 10 avisos (ya se cumplen las metas del contrato; los avisos son etiquetas sin respaldo citable). Poco estudiados en el top 5 general: 10 de 30. Las 14 URL nuevas de las fichas responden.
- **Código:** `tsc` sin errores, **76 de 76 pruebas** (se regeneraron los valores de referencia de `robustness.test.ts` con `pipeline/sensitivity.py`, porque el cambio de punto de Rub' al Khali movió el rango de temperatura del catálogo), build sin errores.
- **Resultado: 47 de 47 OK** (se actualizaron dos expectativas de `qa.mjs` al nuevo catálogo: "1.º de 56" y 13 resultados del filtro de Bolivia).
- **Accesibilidad (`docs/qa/a11y.mjs`, 6 rutas en español e inglés):** sin hallazgos tras corregir tres cosas que la herramienta encontró: los radares tenían un elemento enfocable dentro de contenido oculto (`accessibilityLayer={false}`) y los enlaces de fuentes "[1] [2] [3]" no tenían nombre descriptivo ni 24 px. Foco visible en todo el recorrido con Tab, reflujo sin desborde a 320 y 640 px, contraste de texto sin fallas en los textos medibles (los que están sobre degradados o mapas no se miden).
- **Revisado a ojo con capturas:** inicio con la insignia de robustez, comparación con la explicación, el radar de tres análogos y su tabla, y la vista de impresión de la comparación (fondo claro, sin barra superior; el PDF tiene 6 páginas).
- **Rendimiento (móvil lento, esta máquina):** primer contenido ≈ 2,2 s, bloqueo ≈ 470 ms, 580 KB. Con la medición de la fase final (1,74 s) la diferencia es de máquina y de ruido; no se afirma la meta de 1,8 s.
- **Sin verificar:** Vercel, otros navegadores, lector de pantalla, zoom al 200 %, impresión en papel, la CI de GitHub (no corre por facturación).

## Pasada 4: domingo 15/11, ~01:15 (local, fase final)

- **Versión:** `main` con las tareas 1 a 4 de `prompts/fase-final.md` (PR #59 a #63 y el PR de cierre). Build de producción con `vite preview`. **Sigue sin estar en Vercel**, así que la pasada es local.
- **Navegador:** Microsoft Edge sin interfaz (motor Chromium); Chrome no está instalado en esta máquina. Clics y teclas reales por CDP.
- **Datos:** 47 candidatos (28 conocidos, 19 poco estudiados), 6 sitios. `validate.py`: 0 errores, 7 avisos (el de metas cuenta "25 o más poco estudiados", que ya no se cumple tras la auditoría: son 19). `similarity.py` regenera `web/public/data/` sin diferencias salvo `generated_at`. `check_ficha_urls.py`: 99 URL, ninguna con problema.
- **Código:** `tsc` sin errores, **76 de 76 pruebas**, build sin errores. Paquete principal 475 KB (154 KB comprimido).
- **Resultado: 47 de 47 OK** (dos corridas seguidas). Las 34 anteriores siguen pasando; la de "Marte: el ranking cambia" ahora espera al Atacama primero, por la auditoría.

| Nuevo en esta pasada | Comprobación | Estado |
| --- | --- | --- |
| Exportar a PDF (F8) | Enter en el botón llama a `window.print`; en `print` no hay barra, pie ni botones y las referencias muestran su URL | OK |
| Perfiles de misión (4a) | "Rover mobility" fija `pesos=3,3,0.5,0.5,1` y queda marcado; "Equal" limpia la URL | OK |
| Robustez (4b) | Los 3 primeros de Marte llevan la insignia con texto ("… in 15 of 15 scenarios") | OK |
| Varios análogos (4c) | El segundo selector guarda `analogos=` y dibuja 2 series; tabla con 5 variables y el puntaje; sin desborde a 375 px con 3 análogos | OK |
| Explicaciones (F7) | El primer análogo de Gale trae el párrafo; un par fuera del top 5 no lo trae | OK |
| Movimiento reducido | Con `prefers-reduced-motion: reduce` la transición entre pantallas no desplaza; sin esa preferencia sí (control) | OK |
| Saltos de diseño | CLS del inicio < 0,1 (medido 0,001) | OK |
| Desborde | `overflow.mjs` en inicio, comparación con 3 análogos y metodología: 0 elementos | OK |

**Errores encontrados y corregidos en esta pasada:**
- La ficha del Atacama seguía diciendo que el punto era el centro del desierto (falso desde la auditoría). Corregido en español e inglés.
- En inglés, cuatro títulos de referencias de fuentes de datos seguían en español (por ejemplo "NASA POWER, API de climatología", en las 47 fichas). La comprobación de idioma de `qa.mjs` no los detectaba porque son nombres propios mezclados; ahora se traducen en `dataEn.ts` y una prueba lo cubre.
- `qa.mjs` mandaba Enter sin el carácter, así que no activaba botones; corregido.

**No probado en esta pasada:**
- **Producción:** URL de Vercel, enlaces directos recargando `/comparar/...`, la imagen de Open Graph en una red social real (necesita la URL pública) y la red móvil de un teléfono real.
- **Integración continua:** el flujo de GitHub Actions no arrancó porque la cuenta dueña del repositorio está bloqueada por facturación ("The job was not started because your account is locked due to a billing issue"). Las mismas comprobaciones pasan en local.
- Chrome, Firefox y Safari (solo Edge); lector de pantalla real (NVDA o VoiceOver) y zoom real al 200 %.
- Imprimir en papel y el diálogo de impresión de Firefox y Safari.
- La pestaña del navegador con el favicon: Edge sin interfaz no dibuja pestañas, así que se comprobó el título del documento, que `/favicon.svg` responde como SVG y cómo se ve el icono abierto directamente.

## Rendimiento (fase final, tarea 3)

Medido con `docs/qa/perf.mjs` contra el build servido con `vite preview` y Edge sin interfaz (Chrome no está instalado en esta máquina). "Móvil lento" es 4G lenta y CPU 4× más lenta. Cada valor es la mediana de 2 o 3 corridas; el bloqueo varía ±60 ms entre corridas.

| Paso | Paquete principal | Móvil lento: primer contenido | Móvil lento: bloqueo | Decisión |
| --- | ---: | ---: | ---: | --- |
| Línea base del prompt | 598 KB | 2,3 s | ~1,2 s | — |
| Línea base al empezar (mismo build, esta máquina) | 618 KB | 2,01 s | ~610 ms | — |
| 1. Textos en inglés de los datos bajo demanda (`dataEn.ts` en su propio fragmento) | 565 KB | 1,90 s | ~550 ms | Se queda |
| 2. Precargar `sites`, `candidates` y `results` con `<link rel="preload">` | 565 KB | 2,03 s | ~560 ms | **Descartado**: compite con el JS y retrasa el primer contenido ~150 ms |
| 3. `LazyMotion` con `domAnimation` | — | — | — | **No aplicado** como pedía el prompt: el ranking usa `layout="position"`, que necesita `domMax` |
| 4. Análisis del paquete (mapa de fuentes): react-dom 202 KB, Motion 138 KB, react-router 37 KB, Radix + floating-ui ~50 KB. Motion con `LazyMotion` y `domMax` cargado aparte (`web/src/lib/motionFeatures.ts`) | 466 KB | 1,72 s | ~370 ms | Se queda. No se separaron más bibliotecas en fragmentos propios: con un solo despliegue no mejora la primera carga |
| 5. Pedir el fragmento del mapa después del primer pintado, en paralelo con los datos | 466 KB | 1,72 s | ~410 ms | Se queda: el mapa aparece a 2,87 s en vez de 3,01 s |
| 6. Desplazamiento de diseño: `main` ocupa al menos la pantalla y `scrollbar-gutter: stable` | 466 KB | 1,72 s | ~400 ms | Se queda: CLS del inicio de 0,16 a 0,001 (0 en descubrimientos, comparación y metodología, también en móvil) |

**Meta cumplida:** móvil lento con primer contenido a 1,72 s (meta < 1,8 s) y bloqueo de unos 400 ms (meta < 600 ms). Escritorio: primer contenido entre 0,46 y 0,74 s, 626 KB transferidos.

**Movimiento reducido:** `qa.mjs` comprueba ahora que con `prefers-reduced-motion: reduce` la transición entre pantallas no desplaza nada (y, como control, que sin esa preferencia sí lo hace). Con `LazyMotion` aparecía un cuadro suelto con el desplazamiento inicial; se corrigió poniendo el desplazamiento inicial a 0 cuando el usuario pide reducir movimiento.

## Exportar a PDF (F8, fase final, tarea 2f)

| Qué se comprobó | Cómo | Estado |
| --- | --- | --- |
| Botón "Exportar a PDF" / "Export to PDF" en la comparación, con Enter desde el teclado | `qa.mjs` (enfoca el botón, pulsa Enter y comprueba que se llamó a `window.print`) | OK |
| Hoja de impresión: sin barra superior, pie ni controles; referencias con su URL visible | `qa.mjs` con `Emulation.setEmulatedMedia` en `print` | OK |
| PDF real de Jezero–Atacama (inglés) y Malapert–Licancabur (español) | `Page.printToPDF` en Edge; 5 páginas cada uno, revisado a ojo: fondo blanco y texto negro, comparación, tabla, radar, "dónde falla", límites, ficha y referencias con URL; ninguna tarjeta partida | OK |

Durante la revisión del PDF apareció un texto viejo en la ficha del Atacama ("el punto usado es el centro del desierto y no la estación de Yungay"), falso desde que el punto es el pozo de Yungay. Corregido en español y en inglés.

**No probado:** imprimir en papel y el diálogo de impresión de Firefox y Safari.

## Pasada 3: sábado 14/11, noche (local, `main` después de #57, #58 y el inglés de los datos)

- **Versión:** `main` en `a36532c` más la corrección de la metodología en móvil (ver abajo). Build de producción con `vite preview`. **Sigue sin estar en Vercel**, así que la pasada es local.
- **Cómo:** 34 comprobaciones automáticas con Chrome y **clics y teclas reales** (no eventos simulados), en español e inglés. Chequeos sobre la web en inglés: `?lang=en`.
- **Datos:** reales (6 sitios, 47 candidatos, 47 fichas desde la ampliación posterior a esta pasada). `python pipeline/validate.py`: 0 errores. `npm test` 61/61; `tsc` y `npm run build` sin errores.
- **Resultado: 34 de 34 OK.**
- **Repetida después de completar los datos** (pendiente y relieve de McMurdo, Svalbard, La Corona y Manjanggul con Copernicus DEM, etiquetas de MDRS y el crédito de Copernicus en el pie): 34 de 34 OK otra vez, también a 375 y 768 px. Esos cambios mueven los rankings lunares (47 pares; McMurdo es primero en Cabeus y Malapert).

| Grupo | Qué se comprobó | Estado |
| --- | --- | --- |
| Flujo principal | Inicio → elegir Marte (URL guarda `sitio`, el ranking pasa a Gilf Kebir) → elegir Crater Gale en el selector → elegir un análogo (URL guarda `analogo`) → enlace a la comparación con el sitio correcto → comparación con tabla de 5 variables, radar, "dónde falla" y ficha → "Back to ranking" | OK |
| Filtros y pesos | El diálogo abre; el interruptor "solo Bolivia" deja 10 resultados y guarda `bolivia=1`; con el teclado la flecha cambia un peso y la URL guarda `pesos=`; "Reset" la limpia; Esc cierra y devuelve el foco al botón "Filters" | OK |
| Globo | Se carga solo al abrir el plegable y trae las 3 pestañas | OK |
| Idioma | El selector pasa a español y `<html lang>` cambia a `es` | OK |
| Rutas | Descubrimientos (6 sitios), Metodología en inglés y en español, ruta inexistente y comparación inexistente | OK |
| Inglés (#25) | Sin textos en español en inicio, comparación, descubrimientos y metodología con `?lang=en` | OK |
| Teclado | El primer Tab enfoca "Skip to content" y Enter lleva el foco al contenido | OK |
| Responsive | Sin desborde horizontal a 375 px (inicio, ranking con análogo, comparación, descubrimientos, metodología) y a 768 px | OK, tras el arreglo de abajo |
| Consola | Sin errores durante toda la pasada | OK |

**Error encontrado y corregido:** la página de Metodología se salía del ancho en móvil (410 px sobre 375) porque las fórmulas en `code` no se partían (`white-space: nowrap`). Ocurría en español y en inglés. Arreglado en `web/src/styles/app.css` (`overflow-wrap: anywhere`); ahora mide 375 px en ambos. La primera versión de mi comprobación no lo detectó porque comparaba el ancho con el de la ventana ampliada por el desborde; ahora compara con 375.

**Peso (compilado):** paquete principal 598 KB (195 KB comprimido; subió desde 562 KB por los textos en inglés de los datos), Compare 307 KB, Metodología 196 KB, mapa 1.070 KB y globo 7 KB (los tres últimos se cargan solo al entrar a su pantalla).

**No probado en esta pasada:**
- Lector de pantalla real (NVDA o VoiceOver), zoom real al 200 % y la preferencia de "reducir movimiento" del sistema (Noe).
- Carga lenta y lista vacía.
- **Producción:** URL de Vercel, enlace directo recargando `/comparar/...` y desde otra red o un teléfono con datos móviles. Bloqueante hasta desplegar.

## Pasada 2: sábado 14/11, ~16:00

- **Versión:** `main` en `2517734`, después del rediseño (#44 y #45) y del selector de idioma (#40). Build de producción con `npm run build` y `npm run preview`.
- **La web sigue sin estar en Vercel** (0 despliegues), así que la pasada es local otra vez.
- **Datos:** reales, de `main` (6 sitios y 47 candidatos). `python pipeline/validate.py`: 0 errores.
- **Pruebas y build:** `npm test` 48/48; `npm run build` sin errores. El paquete principal pasó de 270 KB a 592 KB (194 KB comprimido) con el rediseño.
- **Navegador:** Chromium, escritorio y emulación de móvil de 375 × 812, en **español y en inglés**.

| # | Función | Resultado | Estado |
| --- | --- | --- | --- |
| 1 | F1 Selector de sitio | Las 6 tarjetas funcionan como grupo de radio; el ranking de Malapert coincide con `results.json` (Licancabur 69.8) y la URL guarda `?sitio=` | OK |
| 2 | F2 Mapa y ranking | 43 análogos para Malapert y 47 para Jezero; el puesto aparece dentro de la fila (#30 resuelto); crédito "© OpenStreetMap contributors" | OK |
| 3 | F5 Solo Bolivia | 10 análogos para Malapert (los datos dan 10); los interruptores tienen etiqueta accesible | OK |
| 4 | F11 Solo poco estudiados y combinado | 26 solos y 7 con Bolivia; coincide con los datos; los filtros quedan en la URL | OK |
| 5 | F11 Descubrimientos | Top 5 de poco estudiados por sitio; coincide con la validación de Sebastián | OK |
| 6 | F3 Comparador | Malapert ↔ Licancabur: 69.8/100, tabla, radar, coincidencias, "Where the analogy breaks down", límites y **aviso de dato sesgado** (#36) | OK |
| 7 | F4 Ficha | "This place has no published fact sheet yet." | Pendiente: falta `fichas.json` (L-2, Lian) |
| 8 | F9 Metodología | Se muestra completa, con 4 tablas; en inglés avisa que el documento está en español | OK, pero el texto sigue en español (#25) |
| 9 | F10 Pesos | Con teclado: temperatura a 1.5, cambian los puntajes, la URL guarda `pesos=` y "Reset weights" vuelve a los valores originales | OK |
| 10 | F6 Globo 3D | Abre en Marte para Jezero, con el sitio marcado y textos en inglés | OK |
| 11 | Idioma | El selector cambia `lang` a `en`, traduce la interfaz y recuerda la elección | OK para la interfaz; los textos de los datos siguen en español (ver abajo) |
| 12 | Comparación y ruta inexistentes | "That comparison does not exist" y "Page not found." | OK |
| 13 | Error de datos | Sin `results.json`: mensaje con `role="alert"` y botón "Retry"; al restaurar el archivo, "Retry" recupera los datos | OK |
| 14 | Teclado y foco | La fila del ranking muestra un contorno sólido de 2 px con Tab (#29 resuelto); hay enlace "Skip to content" | OK |
| 15 | Título animado | El título aparece dos veces en el texto, pero la copia animada lleva `aria-hidden`; un lector lo lee una vez | OK |
| 16 | Movimiento reducido | Las animaciones respetan `prefers-reduced-motion` | OK |
| 17 | Móvil 375 px | Inicio, comparador, descubrimientos y metodología sin desplazamiento horizontal | OK |
| 18 | Consola | Sin errores en todas las rutas | OK |
| 19 | Lista vacía y carga lenta | No probado | No probado |
| 20 | Producción y enlace directo | No probado | **Bloqueante: falta desplegar en Vercel (F-1)** |

**Sigue en español en modo inglés** (requisito de inglés, #25). Son textos que vienen de los datos, no de la interfaz:
- regiones de los sitios ("Polo sur lunar", "Isidis Planitia, Marte", "Llanuras del norte, Marte") en `data/sites.json`;
- nombres y países de los candidatos ("Volcán Licancabur y su lago de cumbre", "Egipto y Libia") en `data/candidates.json`;
- notas técnicas (`notes`) de sitios y candidatos;
- el documento de metodología.

## Pasada 1: sábado 14/11, ~14:30

- **Versión:** `main` en `2b9d241`, build de producción (`npm run build` y `npm run preview`). La web **aún no está en Vercel**, así que no se pudo probar la URL de producción.
- **Datos:** DEMO (`npm run data:demo`, inventados). `data/candidates.json` todavía está vacío.
- **Navegador:** Chromium (navegador integrado), escritorio y emulación de móvil de 375 × 812.

Estados: **OK**, **Falla** (con issue o PR), **No probado** (con motivo).

| # | Función | Pasos | Resultado esperado | Escritorio | Móvil | Estado |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | F1 Selector de sitio | Cambiar de un sitio lunar a uno marciano | El ranking cambia y la URL guarda `?sitio=` | OK | OK | OK |
| 2 | F2 Mapa y ranking | Abrir `/` | Marcadores en el mapa y lista ordenada por puntaje; crédito de OpenStreetMap visible | OK | OK | Falla visual: el número de puesto aparece junto al país (#30) |
| 3 | F5 Filtro Bolivia | Marcar "Solo Bolivia" | Solo candidatos de Bolivia, en el mismo orden; URL `bolivia=1` | OK | No probado | OK |
| 4 | F11 Solo poco estudiados | Marcar "Solo lugares poco estudiados", y luego también "Solo Bolivia" | Solo candidatos "Nuevo"; los dos filtros se combinan | OK | No probado | OK |
| 5 | F11 Descubrimientos | Abrir `/descubrimientos` | Los 5 mejores poco estudiados por sitio | OK | No probado | OK |
| 6 | Selección de análogo | Clic en un análogo de la lista | Queda resaltado, la URL guarda `analogo=` y aparece "Ver comparación" | OK | No probado | OK |
| 7 | F3 Comparador | "Ver comparación" | Tabla por variable, radar, coincidencias, "Dónde falla", limitaciones y "Volver al ranking" | OK | Falla: la página se ensanchaba a 568 px | Arreglado en PR #28 |
| 8 | F4 Ficha | En el comparador, bajar hasta la ficha | Ficha del análogo, o un aviso si aún no tiene | OK (estructura) | No probado | Contenido pendiente: falta `fichas.json` (Lian) |
| 9 | F9 Metodología | Abrir `/metodologia` | Se lee `docs/METODOLOGIA.md` con títulos y tablas | OK | No probado | OK |
| 10 | F10 Pesos | Subir "Temperatura" a 3 y luego "Restablecer pesos" | Cambian los puntajes, la URL guarda `pesos=`; al restablecer vuelven los valores originales | OK | No probado | OK |
| 11 | F6 Globo 3D | Abrir "Ver en el globo 3D" | Se abre en el cuerpo del sitio, con el sitio marcado y pestañas Tierra, Luna y Marte | OK | OK (359 px, pestaña Luna) | OK |
| 12 | Comparación inexistente | Abrir `/comparar/demo-moon-a/no-existe` | "No existe esa comparación" y enlace al inicio | OK | No probado | OK |
| 13 | Ruta inexistente | Abrir `/no-existe` | "Página no encontrada" | OK | No probado | OK |
| 14 | Error de datos | Quitar `results.json` del build y recargar | Mensaje de error, sin pantalla en blanco | OK | No probado | OK (*) |
| 15 | Lista vacía | Filtros que no dejan candidatos | Mensaje de lista vacía | No probado | No probado | No probado: los datos DEMO siempre dejan al menos uno |
| 16 | Carga lenta | Red lenta (DevTools, "Slow 3G") | "Cargando…" mientras llegan los datos y el mapa | No probado | No probado | No probado |
| 17 | Teclado y foco | Recorrer la página con Tab | El control enfocado se ve | Falla | No probado | Falla: el foco no se ve en la lista del ranking (#29) |
| 18 | Ancho en móvil | Inicio y comparador a 375 px | Sin desplazamiento horizontal de la página | — | Inicio OK; comparador arreglado en PR #28 | OK tras PR #28 |
| 19 | Consola | Recorrer todas las rutas | Sin errores en la consola | OK | No probado | OK |
| 20 | Idioma | Revisar textos de la web | En inglés, como exige la entrega | Falla | Falla | Falla: la web está en español (#25) |
| 21 | Enlace directo | Recargar estando en `/comparar/...` en producción | Abre la misma pantalla (regla de `vercel.json`) | No probado | No probado | No probado: falta desplegar |
| 22 | Producción | Abrir la URL de Vercel desde otra red y desde un teléfono | Carga sin login | No probado | No probado | **Bloqueante: la web aún no está en Vercel (F-1)** |

(*) En `vite preview`, un JSON que falta devuelve `index.html` y el mensaje dice "no es un JSON válido". En Vercel la regla de `vercel.json` excluye `data/`, así que debería dar 404 y el mensaje "No se pudo cargar". Confirmar en la pasada de producción.

## Pasadas siguientes

Repetir la matriz completa en producción a las **04:00** y a las **07:00**, con datos reales. Agregar:

- [ ] URL de producción desde otra red y desde un teléfono real.
- [ ] Ranking con los candidatos reales: los análogos conocidos (`known: true`) aparecen arriba para su cuerpo.
- [ ] Fichas reales de Lian en el comparador.
- [ ] Versión en inglés (#25).
- [ ] Crédito "© OpenStreetMap contributors" en inglés.
- [ ] Contraste mínimo 4.5:1 y textos alternativos (N-4, Noe).
- [ ] Enlaces del formulario de entrega abiertos en ventana privada: demo, proyecto y repositorio.
