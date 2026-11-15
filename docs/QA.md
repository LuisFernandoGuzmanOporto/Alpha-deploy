# QA: matriz de pruebas

Dueño: Joel. Cada fallo va como issue de GitHub con pasos para reproducir. Pasadas previstas: sábado ~14:30 (local), 04:00 y 07:00 (producción).

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
