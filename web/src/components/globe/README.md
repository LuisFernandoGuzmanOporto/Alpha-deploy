# Globo 3D (F6)

Dueño: Dante. Sin dependencias nuevas: el globo se dibuja en un `<canvas>` con proyección ortográfica, así que los sitios del polo sur lunar (84° a 88° S) se ven sin el corte de ±85° de los mapas Mercator.

## Uso

```tsx
import { GlobeView } from "../components/globe/GlobeView";

<GlobeView site={site} analogs={top5} />
```

- `site`: el sitio elegido (`Site | null`). Se marca en el globo de su cuerpo y esa pestaña se abre sola.
- `analogs`: los mejores análogos en orden de ranking (normalmente los 5 primeros, ya filtrados y con los pesos actuales). Se marcan numerados en la Tierra.

Se gira arrastrando o con las flechas del teclado; las pestañas se recorren con ← y →. Debajo de cada globo hay una lista en texto con los marcadores y sus coordenadas, que es el equivalente accesible del dibujo.

## Texturas

Equirectangulares de 2048 × 1024 (longitud −180 a 180, norte arriba), armadas a partir de servicios abiertos de NASA:

| Archivo | Fuente | Cómo se obtuvo |
| --- | --- | --- |
| `textures/earth.jpg` | NASA Blue Marble Next Generation, capa `BlueMarble_NextGeneration` de NASA GIBS | WMS `GetMap` EPSG:4326, 2048 × 1024: https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi |
| `textures/moon.jpg` | Mosaico global LRO WAC 303 ppd v02 (NASA/GSFC/Arizona State University), Moon Trek | Nivel 2 (8 × 4 teselas) de https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/ |
| `textures/mars.jpg` | Mosaico color Viking MDIM 2.1 (NASA/USGS), Mars Trek | Nivel 2 (8 × 4 teselas) de https://trek.nasa.gov/tiles/Mars/EQ/Mars_Viking_MDIM21_ClrMosaic_global_232m/ |

Las teselas se unieron y se guardaron como JPEG de calidad 82 con Pillow. Son imágenes para orientarse, no datos científicos: los valores de las variables salen de `data/sites.json`.

## Límites

- Cerca de los polos la textura de 2048 px se estira y se ven estrías radiales; los marcadores de los sitios polares están en su lugar, pero el detalle del terreno ahí es pobre.
- El dibujo calcula cada píxel en JavaScript (unos 40 ms a 360 px); al arrastrar usa bloques de 2 × 2 para que el giro sea fluido y al soltar vuelve a la resolución completa.
