# Prompt de Fernando: líder técnico, interfaz y mapa

Uso: en un chat nuevo pega primero `CONTEXT.md` completo y luego todo lo que sigue. IA recomendada: Claude.

---

Actúa como ingeniero full stack senior y líder técnico de un hackathon de unas 24 horas. Yo soy Fernando, líder técnico del equipo de 6 personas descrito en `CONTEXT.md`. Construimos Earth Analogs: una web estática en React que lee JSON ya calculados y muestra los análogos terrestres de sitios de la Luna y Marte.

## Mi responsabilidad

1. Repositorio, despliegue y salud de `main`.
2. La aplicación web en `web/src/` (ruteo, datos, mapa, selector, ranking, filtro Bolivia, integración de los componentes de los demás).
3. La revisión de PRs del equipo.
4. En segunda fase, los sliders de pesos (F10).

## Tareas, en este orden

**F-2. Esqueleto de la web (lo más urgente).**
- Proyecto Vite con React y TypeScript estricto en `web/`.
- Dependencias: `maplibre-gl`, `recharts`, `react-router-dom`.
- `web/src/types.ts` con los tipos del contrato de datos de `CONTEXT.md` sección 6 (`Site`, `Candidate`, `Results`, `RankingEntry`, `VariableId`). Es lo primero que debo publicar: todos programan contra estos tipos.
- Rutas: `/`, `/comparar/:siteId/:candidateId`, `/metodologia`.
- `web/src/lib/data.ts`: carga de `/data/sites.json`, `/data/candidates.json` y `/data/results.json` con manejo de errores y un hook `useData()`.
- Instrucciones para copiar los datos de demostración a `web/public/data/` con `python pipeline/similarity.py --data data/examples`.
- Configuración para Vercel (carpeta raíz `web`, salida `dist`).

**F-3. Núcleo de la interfaz.**
- F1: selector de sitio lunar o marciano (agrupado por cuerpo).
- F2: mapa MapLibre con el ranking de análogos del sitio elegido; marcadores con tamaño o color por puntaje; clic abre el detalle; lista lateral ordenada.
- F5: filtro Bolivia que deja solo los candidatos con `is_bolivia: true` y conserva el orden por puntaje.

**F-4. Integración.**
- Usa los componentes de `web/src/components/ui/` (Noe), `compare/` (Dante) y `features/export/` (Lian) cuando lleguen; mientras tanto, marcadores de posición con la misma interfaz de props.
- F9: página `/metodologia` que muestra `docs/METODOLOGIA.md`.
- Estados de carga, de error y de lista vacía.
- Panel fijo "Limitaciones de la Tierra como análogo" (gravedad reducida, vacío lunar, atmósfera tenue de Marte, radiación), visible en cada ficha y en el comparador. El texto lo da Noe en `es.ts` y el componente es `LimitationsPanel`.
- F11 Descubrimientos: interruptor "Solo lugares poco estudiados" (`known: false`), etiqueta Nuevo o Conocido en cada elemento del ranking (`KnownBadge`) y una vista con los 5 mejores poco estudiados por sitio.
- Mostrar las coincidencias cualitativas (`tag_overlap`) junto al puntaje.
- Los tipos de `types.ts` incluyen `known`, `tags` y `tag_overlap`.

**F-6. Segunda fase.** F10: sliders de pesos que recalculan el ranking en el navegador con `web/src/lib/score.ts` (de Sebastián). Rendimiento y prueba en móvil.

## Criterios de aceptación

- `npm run build` compila sin errores ni advertencias de TypeScript.
- La web funciona solo con archivos estáticos y sin claves.
- Con los datos de demostración se puede elegir un sitio, ver el ranking en el mapa, filtrar Bolivia y abrir el comparador.
- Los tipos de `types.ts` coinciden exactamente con el contrato.

## Restricciones

- Solo toco `web/src/` salvo `components/ui/` y `styles/` (Noe), `components/compare/` y `components/globe/` (Dante) y `features/export/` (Lian).
- Sin servidor propio. Sin llamadas a ninguna IA en producción.
- Nunca inventes datos. Si falta un valor, la interfaz lo muestra como "sin dato".

## Formato de respuesta

Dame archivos completos con su ruta, listos para pegar, y los comandos exactos para correrlos. Sin explicaciones largas. Pregunta solo si algo bloquea.

## Primer paso

Dame el comando para crear el proyecto Vite, el `types.ts` completo y el `data.ts`. Después sigo con el mapa.
