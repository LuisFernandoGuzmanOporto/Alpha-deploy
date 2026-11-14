# Entrega por bloques — formularios y textos de PR

Las cuatro ramas están subidas. **No hay PRs abiertos por esta sesión**: el conector
rechaza la creación con 403 y no hay sesión de GitHub en el navegador integrado.
Los enlaces siguientes son formularios de comparación, no PRs ya creados.

Las ramas se construyeron en cadena A → B → C → D. Integrar en ese orden hacia main.
Antes de integrar cada siguiente bloque, actualizar/rebasar para que su diff quede reducido
a su bloque. No se ha fusionado ni publicado directamente en main.

## A — mejora visual

[Abrir formulario A](https://github.com/LuisFernandoGuzmanOporto/Alpha-deploy/compare/main...feat/noe-mejora-visual?expand=1)

Título: `feat: refinar interfaz y tema espacial de Noe`

Refina la jerarquía de Inicio, amplía el espacio del mapa, compacta el ranking y mejora
la lectura del comparador, Descubrimientos y Metodología. Conserva el cielo de nebulosa
aprobado por Noe, con textura decorativa original documentada. Mantiene la separación
y numeración de marcadores del globo ya existente. No altera datos, cálculo, filtros ni URLs.

Validación del bloque: 52 pruebas y build correctos. Revisión integrada final: 54 pruebas,
30 combinaciones de pantalla/idioma/ancho sin desborde; evidencia en QA-NOE.md.
Pendiente de prueba manual: NVDA/VoiceOver.

## B — accesibilidad

[Abrir formulario B](https://github.com/LuisFernandoGuzmanOporto/Alpha-deploy/compare/main...feat/noe-accesibilidad?expand=1)

Título: `fix: mejorar contraste teclado y movimiento reducido`

Contraste de bordes interactivos y texto sobre la nebulosa, descripciones de mapa/globo/radar,
regiones de tabla con foco y adaptadores de efectos para reducir movimiento sin editar React Bits.
Home y App solo cambian integración visual; no hay cambios de filtros ni lógica científica.

Validación: 54 pruebas, TypeScript y build; flechas en destinos, Escape/restauración de foco,
expandir/comparar/volver y globo con teclado. Revisión ES/EN a 1360, 768 y 375 px.
Pendiente manual: NVDA/VoiceOver, zoom real 200 %, preferencia real de reducir movimiento,
offline/fallas de red. Reflujo equivalente a 680 px comprobado; no se afirma zoom real.

## C — textos ingleses

[Abrir formulario C](https://github.com/LuisFernandoGuzmanOporto/Alpha-deploy/compare/main...feat/noe-textos-ingles?expand=1)

Título: `fix: pulir inglés de interfaz y ayudas`

Mejora titular, etiquetas, vacíos, errores, instrucciones de globo y pesos y limitaciones
universales. Conserva claves, parámetros, nombres y textos procedentes de los datos.
No traduce la metodología ni las fichas científicas (#25).

Validación: 54 pruebas, build y revisión de cinco pantallas en inglés en tres anchos.
Pendiente: decisión del equipo sobre traducir los contenidos de datos, fuera de este bloque.

## D — material del pitch y evidencia final

[Abrir formulario D](https://github.com/LuisFernandoGuzmanOporto/Alpha-deploy/compare/main...feat/noe-material-pitch?expand=1)

Título: `docs: actualizar capturas póster y tema del pitch`

Capturas reales nuevas de Inicio, Bolivia, comparación completa, descubrimientos, globo
y metodología a viewport de 1440 px, y principal a 375 px. Póster HTML y tema CSS consumen
los tokens actuales; incluye procedencia de la imagen y reporte de verificación.
Sin menores ni logos oficiales de NASA. No sustituye el PDF oficial de Joel en docs/demo.

La revisión visual final también corrige el hover de la pestaña seleccionada del globo
y conecta sus colores/tipografía de marcadores con los tokens compartidos.
Validación: QA-NOE.md y CAPTURAS.md; no se afirma revisión con NVDA ni impresión física.

## Decisiones de Fernando

- Revisar e integrar A → B → C → D; conservar la decisión visual aprobada por Noe.
- Asignar las pruebas manuales abiertas en QA-NOE.md antes de la entrega.
- Resolver el alcance de traducción de datos (#25) y regenerar la demo de Joel si corresponde.
- Añadir el crédito de la textura decorativa generada a la atribución general; la procedencia
  y el prompt ya están en NEBULA-ASSET.md.
