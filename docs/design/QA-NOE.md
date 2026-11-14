# Verificación de Noe — 14 de noviembre de 2026

## Comprobado

- `npm test`: 54 pruebas pasan (11 archivos), incluidas contraste, marcadores e i18n.
- `npm run build`: TypeScript estricto y compilación de producción correctos.
- Navegador real sobre Vite local: Inicio, Comparador, Descubrimientos, Metodología
  y Globo a 1360, 768 y 375 px, en español e inglés: 30 combinaciones sin desborde
  horizontal de página. Registro: `qa-navegador.json`.
- Reflujo a 680 px (equivalente de ancho de 1360 al 200 %): cuatro rutas sin desborde.
  Esto no sustituye una prueba de zoom real del navegador.
- Teclado: flechas en destinos cambian la opción; Escape cierra pesos y restaura foco
  a «Ajustar pesos»; flecha izquierda rota el globo; botón de recentrar funciona.
- Flujo real: seleccionar sitio, expandir fila, abrir comparación y volver al ranking.
- Filtro Bolivia: activado por interfaz, URL refleja `bolivia=1`, ranking de 10 lugares;
  limpiar filtros restablece el ranking de 43 análogos del sitio inicial.
- Carga observada; comparación inexistente y ruta inexistente conservan navegación.
- Nombres/descripciones de mapa, globo y radar presentes en DOM/árbol de accesibilidad.
- Selector de idioma: menú abierto legible; Escape y foco verificados en la revisión.
- Muestras de consola de las rutas revisadas sin errores de aplicación; mensajes de Vite
  y aviso informativo de React DevTools. No se infiere una prueba completa de red.
- Globo: cinco marcadores separados, numerados y relacionados con la lista real.
- Póster: composición e imágenes revisadas de arriba abajo, sin desborde en escritorio.
- Capturas nuevas de aplicación real (no preview de demostración), sin logos oficiales
  de NASA, personas ni menores.

## Contraste y movimiento

Texto normal ≥ 4.5:1 en tokens de las superficies; foco y bordes de controles ≥ 3:1.
Dos pruebas adicionales cubren los bordes interactivos y los velos sobre un píxel blanco
de la nebulosa (peor caso). Los bordes decorativos mantienen contraste más discreto.
Se corrigió el hover de la pestaña activa del globo: conserva fondo claro y texto oscuro.

Reducir movimiento está conectado en CSS, rutas, ranking, selector de destino, mapa,
radar y adaptadores de los efectos de texto. React Bits queda intacto. La revisión fue
de código y de los estados normales; falta ejecutar la preferencia real del sistema.

## Pendiente de prueba manual / limitaciones

- NVDA o VoiceOver: recorrido completo, anuncio de tablas y manejo del canvas.
- Zoom real al 200 %: los atajos del navegador integrado no cambiaron el zoom.
- Preferencia real de reducir movimiento activada, incluyendo cambios en caliente.
- Falla de red/offline y lista sin resultados: no se simuló la red ni se inventaron datos.
- Vista de impresión A3 del póster en la impresora/destino final.
- Auditor Python de frontend-design-premium no ejecutado: Python no está instalado.
  Esto no impidió TypeScript, Vitest, build ni la inspección del navegador; no se afirma
  certificación completa WCAG ni aprobación de ese auditor.

## Integración y PRs

Ramas encadenadas A → B → C → D para mantener la aplicación completa durante la revisión.
Integrar en ese orden; tras cada integración el siguiente PR hacia main reduce su diff.
Commits con identidad de agente Codex, sin modificar la identidad global de Git.
No se modificaron datos, cálculos de lib, filtros ni parámetros de URL.

Las ramas están publicadas; los PRs no se pudieron crear. La conexión de GitHub devuelve
403 «Resource not accessible by integration» y el navegador no tiene sesión iniciada.
El acceso a credenciales locales para crear PRs fue rechazado por revisión automática
con «blocked by policy». No se insistió por esa vía. Formularios y textos: PRS-NOE.md.
