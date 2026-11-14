# Pendientes de Noe (diseño)

Estado revisado sobre `main` en `2517734` (14/11/2026). Fuente de las tareas originales: `TASKS.md`. Marca tus casillas en tu propio PR.

Ya entregado: N-1 a N-4. El foco (#29) y el puesto en la fila (#30) están resueltos.

## Antes de empezar

1. `git checkout main && git pull`
2. Rama propia: `git checkout -b feat/noe-mejora-diseno`
3. Lee `CONTEXT.md`, `GIT.md` y `docs/design/IDENTIDAD.md`.
4. `cd web && npm ci && npm run dev`. Recorre Inicio, Comparar, Descubrimientos, Metodología y el globo (plegable al final de Inicio), a 375 px y en inglés (`?lang=en`).

## Pendientes

- [ ] **N-4, accesibilidad sobre el rediseño nuevo (#45):**
  - [x] Contraste mínimo 4.5:1 en todas las pantallas: texto sobre el mapa, leyenda y etiquetas "Nuevo" y "Conocido".
  - [x] Textos alternativos del globo, el mapa y el radar.
  - [ ] Recorrido completo con un lector de pantalla (NVDA o VoiceOver).
  - [ ] Zoom al 200 %.
  - [ ] Preferencia de "reducir movimiento" activada en el sistema.
- [x] **N-5, material visual del pitch:**
  - [x] Capturas nuevas con el rediseño. Las de `docs/design/` son del diseño anterior: pantalla principal, "Solo Bolivia", comparador, descubrimientos, globo y metodología.
  - [x] Tema de las diapositivas.
  - [x] Póster.
  - [x] Sin menores de 18 años y sin logo de NASA.
- [x] **Textos en inglés:** revisar `web/src/content/en.ts`, los textos de las limitaciones universales y la frase de cada etiqueta. La interfaz debe leerse natural en inglés.
- [ ] **Mejoras visuales**, sobre el sistema actual sin reinventarlo:
  - [x] Pantalla principal: jerarquía de la franja superior, espacios entre las tres columnas, densidad del ranking y de la lista de destinos.
  - [x] Comparador: que el anillo de similitud, la tabla, el radar y "dónde falla" se lean mejor; hoy se ven correctos pero planos.
  - [x] Descubrimientos y Metodología: la matriz, las tablas largas y la lectura del documento.
  - [x] Globo: los marcadores se superponen cuando los mejores análogos están agrupados.
  - [ ] Estados de carga, vacío y error, y estados de hover y foco.
  - [x] Móvil: revisar todas las pantallas a 375 px y a 768 px, sin desborde horizontal.
  - [ ] Movimiento suave y sin excesos; con "reducir movimiento" no debe haber animación.

## Reglas

- Todo color, tipografía, espaciado y borde sale de las variables `--cc-*` de `web/src/styles/tokens.css`. No pongas valores sueltos en el CSS; si hace falta uno nuevo, agrégalo ahí.
- Cambia solo estilos y componentes visuales. No toques cálculos, datos, filtros ni el contrato de datos (`CONTEXT.md`, sección 6).
- Dependencias nuevas solo si son estrictamente necesarias y avisando antes a Fernando.
- Antes de cada PR: `npm run build` y `npm test` deben pasar. `tokens.test.ts` comprueba el contraste de las variables.
- Un PR pequeño por cambio y `git pull --rebase` antes de subir. Nunca subas directo a `main`.

## Revisión local del 14/11/2026

Ver docs/design/QA-NOE.md, CAPTURAS.md y PRS-NOE.md. Se conserva el cielo aprobado por Noe.
Las casillas manuales (NVDA, zoom real, preferencia del sistema y fallas de red) siguen abiertas.
La separación y numeración del globo ya existían y se verificaron sin cambiar coordenadas.
