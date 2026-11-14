# Datos de la Tierra (`data/candidates.json`)

Scripts con solo la biblioteca estándar de Python. Generan los candidatos terrestres a partir de una lista curada a mano.

## Cómo reproducir

```bash
python pipeline/earth/build_candidates.py   # unos 3-5 min la primera vez; luego usa data/raw/ (ignorada por Git)
python pipeline/validate.py
python pipeline/similarity.py
```

- `seed.json`: la lista curada. Cada candidato lleva sus coordenadas con su fuente, `known`, etiquetas y referencias. **Es lo que se edita a mano**; `data/candidates.json` se regenera. Cada etiqueta lleva su fuente en `tag_sources` (etiqueta → URL) y, si no hay etiqueta con respaldo, `tags_pending` explica por qué; las dos cosas terminan en `notes`.
- `terrain_tiles.py`: pendiente y relieve en la ventana de 10 × 10 km (Terrain Tiles de Mapzen en AWS, Terrarium, zoom 10). Mismo método que `pipeline/moon_mars/`: cuadrícula de 250 m, pendiente de Horn (3 × 3) y desviación estándar poblacional de la elevación.
- `power.py`: temperatura de superficie (`TS`), precipitación (`PRECTOTCORR` × 365,25) y albedo (`ALLSKY_SRF_ALB`) de NASA POWER, climatología 2001-2025.
- `build_candidates.py`: une todo, escribe la fuente exacta de cada valor en `sources` y los motivos de cada `null` en `notes`.

## Reglas que aplica el script

- **Modelos gruesos:** si las teselas solo aportan ETOPO1 o GMTED (sin SRTM ni otro modelo fino), pendiente y relieve quedan `null`. Pasa en la Antártida y en latitudes altas como Svalbard.
- **Costas:** si la ventana incluye mar con batimetría de ETOPO1, pendiente y relieve quedan `null`. Las depresiones de tierra bajo el nivel del mar (Danakil, lago Eyre) se marcan con `land_below_sea_level` en el seed.
- **Sesgo de elevación:** si la celda de NASA POWER difiere más de 500 m de la elevación real del punto, `notes` lo avisa con `ATENCION`. No se corrige.

## Límites que conviene conocer

- **Resolución de POWER:** MERRA-2 (unos 0,5 × 0,625°) y CERES SYN1deg (1°) describen la región, no la ventana de 10 km. En volcanes y montañas la temperatura puede estar sesgada (por ejemplo, la celda de Mauna Kea está a unos 640 m y la cumbre a 4160 m).
- **Albedo:** incluye vegetación, nieve y agua; no es comparable de forma directa con el albedo de suelo desnudo de Marte (MCD) ni con la Luna, donde es `null`.
- **`known`:** `true` solo con una referencia que documente el lugar (o su región) como análogo planetario, verificada en Crossref. `false` significa que una búsqueda en Crossref del 14/11/2026 no encontró un estudio; falta una revisión bibliográfica completa.
- **Coordenadas:** son del artículo de Wikipedia del lugar (centro aproximado para regiones). Las marcadas "a verificar" en el seed no se pudieron comprobar contra un gazetteer.
