# Pendientes de Noe (diseño)

Estado revisado sobre `main` en `2517734` (14/11/2026). Fuente de las tareas originales: `TASKS.md`. Marca tus casillas en tu propio PR.

Ya entregado: N-1 a N-4. El foco (#29) y el puesto en la fila (#30) están resueltos.

## Antes de empezar

1. `git checkout main && git pull`
2. Rama propia: `git checkout -b feat/noe-mejora-diseno`
3. Lee `CONTEXT.md`, `GIT.md` y `docs/design/IDENTIDAD.md`.
4. `cd web && npm ci && npm run dev`. Recorre Inicio, Comparar, Descubrimientos, Metodología y el globo (plegable al final de Inicio), a 375 px y en inglés (`?lang=en`).

## Pendientes

- [x] **N-4, accesibilidad sobre el rediseño nuevo (#45):**
  - [x] Contraste mínimo 4.5:1 en todas las pantallas: texto sobre el mapa, leyenda y etiquetas "Nuevo" y "Conocido".
  - [x] Textos alternativos del globo, el mapa y el radar.
  - [ ] Recorrido completo con un lector de pantalla (NVDA o VoiceOver).
  - [x] Zoom al 200 %.
  - [x] Preferencia de "reducir movimiento" activada en el sistema.
- [x] **N-5, material visual del pitch:**
  - [x] Capturas nuevas con el rediseño. Las de `docs/design/` son del diseño anterior: pantalla principal, "Solo Bolivia", comparador, descubrimientos, globo y metodología.
  - [x] Tema de las diapositivas.
  - [x] Póster.
  - [x] Sin menores de 18 años y sin logo de NASA.
- [x] **Textos en inglés:** revisar `web/src/content/en.ts`, los textos de las limitaciones universales y la frase de cada etiqueta. La interfaz debe leerse natural en inglés.
- [x] **Mejoras visuales**, sobre el sistema actual sin reinventarlo:
  - [x] Pantalla principal: jerarquía de la franja superior, espacios entre las tres columnas, densidad del ranking y de la lista de destinos.
  - [x] Comparador: que el anillo de similitud, la tabla, el radar y "dónde falla" se lean mejor; hoy se ven correctos pero planos.
  - [x] Descubrimientos y Metodología: la matriz, las tablas largas y la lectura del documento.
  - [x] Globo: los marcadores se superponen cuando los mejores análogos están agrupados.
  - [x] Estados de carga, vacío y error, y estados de hover y foco.
  - [x] Móvil: revisar todas las pantallas a 375 px y a 768 px, sin desborde horizontal.
  - [x] Movimiento suave y sin excesos; con "reducir movimiento" no debe haber animación.

## Reglas

- Todo color, tipografía, espaciado y borde sale de las variables `--cc-*` de `web/src/styles/tokens.css`. No pongas valores sueltos en el CSS; si hace falta uno nuevo, agrégalo ahí.
- Cambia solo estilos y componentes visuales. No toques cálculos, datos, filtros ni el contrato de datos (`CONTEXT.md`, sección 6).
- Dependencias nuevas solo si son estrictamente necesarias y avisando antes a Fernando.
- Antes de cada PR: `npm run build` y `npm test` deben pasar. `tokens.test.ts` comprueba el contraste de las variables.
- Un PR pequeño por cambio y `git pull --rebase` antes de subir. Nunca subas directo a `main`.

## Resultado del rediseño (local, aún sin PR)

Hecho en local sobre `main`; falta repartirlo en las ramas `feat/noe-*` y abrir los PR.

- **Paleta:** azul noche con cian solo para la interacción y ámbar/naranja solo para el puntaje; coral para "difiere" y verde para "coincide". Todo sale de `tokens.css` (nuevos: `--cc-glass`, `--cc-hud-bg`, `--cc-map-water`, `--cc-control-line`, `--cc-good`, `--cc-moon`, `--cc-mars`, `--cc-earth`, radios y sombra). **Decisión para Fernando:** el pedido original decía mantener grafito y naranja; se eligió el azul.
- **Inicio:** mapa a pantalla completa, selector Luna/Marte compacto, botón "Filtros" con diálogo y etiquetas de filtros activos, panel con los 3 mejores y "Ver todos", detalle con comparación al elegir un lugar; el punto elegido resalta y los demás se atenúan. Las notas técnicas del sitio quedan plegadas.
- **Comparador, Descubrimientos y Metodología:** más jerarquía y espacio, filas que fallan marcadas en coral, radar con la escala del puntaje, matriz con columna fija y puesto 1 destacado, lectura del documento a 1.7 de interlineado.
- **Globo:** ya separaba y numeraba los marcadores (#48); ahora usa los colores de los tokens.
- **Capturas:** `docs/design/capturas/` (se regeneran con `node docs/design/capturar.cjs` y `npm run dev` activo). Póster y tema de diapositivas pasados a `--cc-*`.

### Comprobado (automático)

- `npx tsc --noEmit`, `npm test` (53 pruebas, incluida una nueva de 3:1 para `--cc-control-line`) y `npm run build`.
- Contraste de 826 textos visibles en Inicio, detalle, "Solo Bolivia", dos comparaciones, Descubrimientos, Metodología e inglés: ninguno bajo 4.5:1 (3:1 en texto grande).
- Sin desborde horizontal a 375, 640 (equivale a 1280 px con zoom al 200 %) y 768 px, en español e inglés.
- Teclado: flechas entre Luna y Marte, flechas/Inicio/Fin dentro de la lista de sitios, Esc cierra la lista y devuelve el foco, Esc cierra el diálogo de filtros, Tab llega a los resultados.
- Recorrido sitio → ranking → detalle → comparación → volver, en escritorio y a 375 px.

### Pendiente de prueba manual

- Lector de pantalla real (NVDA o VoiceOver): no se probó.
- "Reducir movimiento" activado en el sistema operativo: el código lo respeta (Motion, mapa, radar, CSS) y se emuló en las capturas, pero no se probó con el ajuste real del sistema.
- Zoom del navegador al 200 %: se comprobó por ancho equivalente, no con el zoom real.
