# Entrega de Noe a Fernando

Esta entrega crea componentes, estilos y textos dentro del alcance de Noe. No modifica App, rutas ni componentes de otros dueños. Por tanto todavía no cambia la aplicación visible.

## Integrar

1. Importar los componentes desde `./components/ui` (o la ruta relativa correspondiente). El módulo importa `styles/ui.css`, que carga tokens.
2. En App, sustituir la cabecera y el main exteriores por `<Layout>…</Layout>`. Mantener ErrorBoundary, Suspense y Routes dentro. Layout necesita BrowserRouter, que ya existe en main.tsx. Importar ui.css después de layout.css si se importa de forma explícita.
3. Sustituir las importaciones de KnownBadge y LimitationsPanel desde placeholders por las de ui. Conservan sus props actuales.
4. Integrar SiteCard y AnalogCard usando los datos existentes; sus callbacks reciben id. Mantener la navegación y filtros en los componentes de Fernando. Card y Button permiten props nativas; Button usa type="button" por defecto.
5. VariableBar muestra un valor real y su unidad. min/max definen una escala explícita de la visualización; no introducir límites arbitrarios como si fueran resultados científicos.
6. Tabs es controlado: pasar items con ids únicos y estables, value y onChange. Incluye flechas, Inicio y Fin, foco y relaciones ARIA. No eliminar la lógica de teclado al integrar.
7. Textos y descripciones de variables y tags disponibles en `content/es.ts`. El Markdown científico de Sebastián sigue siendo la fuente de la página de metodología; estos textos son acompañamiento editorial.

## Verificación restante tras integrar

- Revisar 360, 768 y 1440 px: sin desbordamiento del documento; tablas con desplazamiento propio.
- Recorrer toda la pantalla con Tab y activar acciones con Enter/Espacio. Probar flechas en Tabs y enlace Saltar al contenido.
- Revisar contraste de texto normal mínimo 4.5:1 con los fondos finales; tokens elegidos con colores oscuros sobre fondos claros.
- Revisar mapa con alternativa en lista; no comunicar selección ni estado solo con color.
- Validar lectores de pantalla, zoom 200 %, datos vacíos, errores y nombres largos.
- Tomar capturas y cerrar el material de pitch únicamente después de revisar la web integrada.

Implementado: identidad base, 14 componentes, textos y estilos responsive. La vista de diseño fue verificada en navegador a 360, 768 y 1440 px, con capturas, comprobación de teclado y contraste. Ver QA-RESULTADOS.md. Pendiente: integración de Fernando y QA de la aplicación integrada, incluido lector de pantalla.

## Vista previa y material visual

Con Vite activo, abrir `/src/components/ui/preview.html`. Esta entrada está aislada de producción y permite recorrer las cuatro pantallas de diseño. No contiene datos científicos inventados. Las capturas `captura-diseno-*.png` corresponden a esa vista y deben identificarse como diseño cuando se usen en el pitch.

Póster imprimible A3 en `docs/design/poster.html`. Tema reutilizable para las diapositivas de Joel en `docs/design/tema-pitch.css`. Los resultados y capturas de producción deben incorporarse una vez integrada la web.
