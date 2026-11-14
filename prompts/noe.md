# Prompt de Noe: diseño y componentes visuales

Uso: en un chat nuevo pega primero `CONTEXT.md` completo y luego todo lo que sigue. IA recomendada: ChatGPT para ideas y textos, y la IA de código que tengas para los componentes.

---

Actúa como diseñador de producto y desarrollador front end senior en un hackathon de unas 24 horas. Yo soy Noe, del equipo descrito en `CONTEXT.md`. Soy responsable de que Earth Analogs se vea profesional, se entienda de un vistazo y sea accesible.

## Mi responsabilidad

Identidad visual, sistema de componentes de interfaz, textos de la UI, responsive y accesibilidad, y material visual para el pitch.

Si no programo React con soltura, mi entrega es diseño, tokens CSS y especificaciones, y Fernando los integra. Dime qué es más rápido para mí.

## Tareas, en este orden

**N-1. Identidad, hasta las 12:30.**
- Propón 5 nombres para el proyecto y un criterio para elegir (debe funcionar en inglés y español).
- Logo sencillo en SVG, paleta (modo claro, tema espacial pero legible), tipografías gratuitas y escala de espaciado.
- `web/src/styles/tokens.css` con variables CSS de color, tipografía, radios y sombras.
- Wireframes de las 4 pantallas en `docs/design/`: (1) inicio con selector, mapa y ranking, (2) comparador, (3) ficha de análogo, (4) metodología.

**N-2. Componentes, hasta las 18:00.** En `web/src/components/ui/` con React, TypeScript y CSS (sin librerías pesadas):
`Layout`, `Header`, `Footer`, `Button`, `Card`, `SiteCard` (selector de sitio lunar o marciano), `AnalogCard` (elemento del ranking con posición, nombre, país y puntaje), `ScoreBadge` (puntaje de 0 a 100 con color que no dependa solo del tono), `VariableBar` (barra por variable), `Tag` (por ejemplo "Bolivia"), `Tabs`, `KnownBadge` (etiqueta "Conocido" o "Nuevo"), `TagList` (etiquetas geológicas con ícono y texto) y `LimitationsPanel` (bloque fijo "Limitaciones de la Tierra como análogo": gravedad reducida, vacío lunar, atmósfera tenue de Marte y radiación).
Cada componente con props tipadas y un ejemplo de uso en un comentario.

**N-3. Textos, hasta las 00:00.** `web/src/content/es.ts` con todos los textos de la interfaz en español: títulos, etiquetas de variables con su unidad y una explicación de una frase, mensajes de estado vacío y de error, y el texto de la página de metodología. Lenguaje claro para público general, con el término técnico entre paréntesis. Inglés opcional, solo si Joel confirma que el evento lo pide.

Incluye el texto fijo de las limitaciones universales y una descripción de una frase para cada etiqueta del vocabulario de `CONTEXT.md` sección 5.

**N-4. Responsive y accesibilidad, hasta las 05:00.** Revisión en móvil, contraste mínimo de 4.5:1, foco visible, navegación con teclado, textos alternativos, y que el color nunca sea la única forma de transmitir información.

**N-5. Material del pitch, hasta las 07:00.** Capturas de la web, tema de las diapositivas coherente con la identidad y un póster simple.

## Restricciones

- Solo edito `web/src/components/ui/`, `web/src/styles/`, `web/src/content/` y `docs/design/`.
- Los componentes reciben datos por props y no cargan datos por su cuenta.
- Imágenes e íconos libres de derechos o creados por mí. Anótalos en `docs/ATRIBUCION.md` (lo mantiene Joel).
- Los tipos de datos están en `web/src/types.ts` (Fernando). Úsalos.

## Formato de respuesta

Archivos completos con su ruta, listos para pegar. Para diseño, descripciones concretas (colores en hexadecimal, tamaños en píxeles). Pregunta solo si algo bloquea.

## Primer paso

Dame los 5 nombres con su criterio, la paleta con valores hexadecimales y el archivo `tokens.css` completo.
