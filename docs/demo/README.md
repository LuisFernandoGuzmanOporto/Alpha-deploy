# Demo oficial: 7 diapositivas en español y en inglés

Hay dos PDF de 7 diapositivas con capturas reales de la web: `earth-analogs-demo-es.pdf` (español, el que se envía en "Link to Project Demo") y `earth-analogs-demo.pdf` (inglés). El contenido sigue `docs/PITCH.md`, sección 3, con las cifras contrastadas con `web/public/data/results.json`.

| Archivo | Qué es |
| --- | --- |
| `slides.es.html` | Las 7 diapositivas en español (1280 × 720), con las capturas de `img-es/`. |
| `slides.html` | Las 7 diapositivas en inglés (1280 × 720). Usa los mismos colores y tipografías que la web (`web/src/styles/tokens.css`). |
| `img-es/` | Las mismas capturas con la web en español (`LANG_UI=es`). |
| `img/` | Capturas de la web en inglés, generadas por `capture.mjs`: `hero`, `home-malapert`, `bolivia-jezero`, `compare-malapert-licancabur`, `discoveries`, `methodology`, `globe-moon` y `globe-earth`. Regeneradas el 15/11 con el rediseño 3D. |
| `capture.mjs` | Saca las capturas y exporta el PDF con Chrome (sin instalar nada más). |
| `earth-analogs-demo-es.pdf`, `earth-analogs-demo.pdf` | Los PDF finales (español e inglés). |

## Cómo regenerarlo

Hace falta Chrome, Node 20 o más y la web servida en local.

```bash
cd web && npm run build && npx vite preview --port 4173
```

En otra terminal, desde la raíz del repositorio:

```bash
SLIDES=docs/demo/slides.html node --experimental-websocket docs/demo/capture.mjs http://localhost:4173 docs/demo/img
```

Versión en español (capturas con la web en español y su PDF):

```bash
LANG_UI=es SLIDES=docs/demo/slides.es.html PDF=docs/demo/earth-analogs-demo-es.pdf node --experimental-websocket docs/demo/capture.mjs http://localhost:4173 docs/demo/img-es
```

Si Chrome no está en la ruta de siempre, se indica con `CHROME=<ruta>`. Cada vez que cambien los datos o la web hay que regenerar las capturas y revisar que las cifras de las diapositivas 6 y 7 sigan siendo ciertas.

## Pendiente antes de subirlo

- La diapositiva 1 indica quiénes exponen (Lian Demian Linares Gutierrez y Noelia Lolita Gonzales Jaldin). Los demás integrantes aparecen por nombre de pila.
- Los textos que vienen de los datos (nombres de lugares, notas) siguen en español en la web (#25); en las capturas se ven en las tablas del comparador y de descubrimientos.
- Subirlo a Google Drive o YouTube con acceso público y probar el enlace en una ventana privada.
- Máximo 7 diapositivas, sin logos de NASA ni menores de 18 años.
