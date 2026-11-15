# Demo oficial: 7 diapositivas en inglés

`earth-analogs-demo.pdf` es la demo oficial ("Link to Project Demo"): 7 diapositivas, en inglés, con capturas reales de la web. El contenido sigue `docs/PITCH.md`, sección 3, con las cifras contrastadas con `web/public/data/results.json`.

| Archivo | Qué es |
| --- | --- |
| `slides.html` | Las 7 diapositivas (1280 × 720). Usa los mismos colores y tipografías que la web (`web/src/styles/tokens.css`). |
| `img/` | Capturas de la web en inglés, generadas por `capture.mjs`: `hero`, `home-malapert`, `bolivia-jezero`, `compare-malapert-licancabur`, `discoveries`, `methodology`, `globe-moon` y `globe-earth`. Regeneradas el 15/11 con el rediseño 3D. |
| `capture.mjs` | Saca las capturas y exporta el PDF con Chrome (sin instalar nada más). |
| `earth-analogs-demo.pdf` | El PDF final. |

## Cómo regenerarlo

Hace falta Chrome, Node 20 o más y la web servida en local.

```bash
cd web && npm run build && npx vite preview --port 4173
```

En otra terminal, desde la raíz del repositorio:

```bash
SLIDES=docs/demo/slides.html node --experimental-websocket docs/demo/capture.mjs http://localhost:4173 docs/demo/img
```

Si Chrome no está en la ruta de siempre, se indica con `CHROME=<ruta>`. Cada vez que cambien los datos o la web hay que regenerar las capturas y revisar que las cifras de las diapositivas 6 y 7 sigan siendo ciertas.

## Pendiente antes de subirlo

- Nombres completos del equipo y nombre del equipo en la diapositiva 1 (hoy solo están los nombres de pila).
- Los textos que vienen de los datos (nombres de lugares, notas) siguen en español en la web (#25); en las capturas se ven en las tablas del comparador y de descubrimientos.
- Subirlo a Google Drive o YouTube con acceso público y probar el enlace en una ventana privada.
- Máximo 7 diapositivas, sin logos de NASA ni menores de 18 años.
