# Bloque B — accesibilidad

- Bordes de controles separados de los decorativos: token con contraste ≥ 3:1.
- Texto sobre nebulosa y navbar: velos oscuros comprobados incluso sobre píxel blanco.
- Mapa: nombre y descripción ES/EN, alternativa de selección mediante ranking.
- Globo: nombre, instrucciones asociadas y estado de textura con región viva estable.
- Radar: descripción de valores y leyenda asociada; sin animación si se solicita reducir movimiento.
- Tablas desplazables de Comparar/Descubrimientos: foco y región identificada.
- Adaptadores visuales para CountUp y DecryptedText, sin editar React Bits.
- Transiciones de rutas, filas, selección de destino y mapa respetan reducir movimiento.

Las únicas modificaciones de Home.tsx y Discoveries.tsx son integración visual/accesible:
imports de adaptadores y atributos de la región desplazable. App.tsx solo cambia la transición.
Sin cambios de datos, filtros, cálculo ni parámetros URL.

54 pruebas y build correctos. La verificación de anchos, idiomas y teclado se registra
en QA-NOE.md al terminar. NVDA/VoiceOver y cambio real de preferencia del sistema:
pendientes de prueba manual; no se afirma una auditoría completa WCAG.
