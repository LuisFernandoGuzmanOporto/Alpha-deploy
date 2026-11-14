# Atribuciones y licencias

Dueño: Joel. Cada persona le pasa sus fuentes. Se muestra en el pie de la web y es la base del campo "Space Agency Partner Data and Other References" del formulario de entrega, que exige listar todo dato, código, texto e imagen usados (ver `docs/REQUISITOS.md`).

## Datos e imágenes

| Recurso | Quién lo aporta | URL | Licencia o condición de uso | Texto de crédito |
| --- | --- | --- | --- | --- |
| LRO LOLA, elevación polar sur LDEM_75S_240M | Dante | https://pds-geosciences.wustl.edu/lro/lro-l-lola-3-rdr-v1/lrolol_1xxx/data/lola_gdr/polar/img/ | Datos de NASA: no sujetos a copyright en EE. UU.; reconocer a NASA como fuente | NASA/GSFC, LRO LOLA (PDS Geosciences Node) |
| LRO Diviner, Polar Resource Product (temperatura y estabilidad de hielo) | Dante | https://pds-geosciences.wustl.edu/lro/urn-nasa-pds-lro_diviner_derived1/data_derived_prp/ | Datos de NASA; reconocer a NASA como fuente | NASA/UCLA, LRO Diviner; Paige et al. 2010, Science 330, 479-482 |
| LRO LOLA, albedo normal a 1064 nm LDAM_50S_1000M_FLOAT (documentado en `notes`, no usado en el índice) | Dante | https://pds-geosciences.wustl.edu/lro/lro-l-lola-3-rdr-v1/lrolol_1xxx/data/lola_gdr/polar/float_img/ | Datos de NASA; reconocer a NASA como fuente | NASA/GSFC, LRO LOLA; Lemelin et al. 2016, Icarus 273, 315-328 |
| MGS MOLA MEGDR 128 px/grado (elevación de Marte) | Dante | https://pds-geosciences.wustl.edu/mgs/mgs-m-mola-5-megdr-l3-v1/mgsl_300x/meg128/ | Datos de NASA; reconocer a NASA como fuente | NASA/GSFC, MGS MOLA (PDS Geosciences Node) |
| Mars Climate Database v6.2 (temperatura y albedo de Marte) | Dante | https://www-mars.lmd.jussieu.fr/mcd_python/ | Su página no publica licencia; pide crédito | Mars Climate Database (c) LMD/LATMOS/OU/IAA/ESA/CNES |
| Mosaicos LROC NAC (coordenadas de los sitios lunares) | Dante | https://data.lroc.im-ldi.com/lroc/ | Datos de NASA; reconocer la fuente | NASA/GSFC/Arizona State University |
| Gazetteer of Planetary Nomenclature (coordenadas de Arcadia Planitia) | Dante | https://planetarynames.wr.usgs.gov/ | Servicio público de IAU/USGS | IAU WGPSN / USGS Astrogeology Science Center |
| Moon Trek (NASA), mosaico LRO WAC para el globo | Dante | https://trek.nasa.gov/moon/ | Datos de NASA; reconocer a NASA como fuente | NASA/GSFC/Arizona State University, vía NASA Moon Trek |
| Mars Trek (NASA), mosaico color Viking MDIM 2.1 para el globo | Dante | https://trek.nasa.gov/mars/ | Datos de NASA; reconocer a NASA como fuente | NASA/USGS (a verificar), vía NASA Mars Trek |
| Texturas del globo, Tierra: Blue Marble Next Generation | Dante | https://gibs.earthdata.nasa.gov/ | Datos de NASA; GIBS pide un agradecimiento | We acknowledge the use of imagery provided by services from NASA's Global Imagery Browse Services (GIBS), part of NASA's Earth Science Data and Information System (ESDIS). |
| Mapa base: teselas de OpenStreetMap | Fernando | https://www.openstreetmap.org/copyright | Datos bajo Open Database License (ODbL); el crédito debe verse en el mapa | © OpenStreetMap contributors |
| NASA POWER (temperatura TS, precipitación PRECTOTCORR y albedo ALLSKY_SRF_ALB de la Tierra, climatología 2001-2025) | Lian | https://power.larc.nasa.gov/ | Datos de NASA; reconocer a NASA como fuente | NASA Langley Research Center POWER Project (MERRA-2 y CERES SYN1deg) |
| Terrain Tiles en AWS (pendiente y relieve de la Tierra; SRTM y otros modelos) | Lian | https://registry.opendata.aws/terrain-tiles/ | Atribución según https://github.com/tilezen/joerd/blob/master/docs/attribution.md (texto exacto abajo, en Notas) | Terrain Tiles was accessed on 14/11/2026 from https://registry.opendata.aws/terrain-tiles |
| Coordenadas de los candidatos terrestres | Lian | Artículo de Wikipedia de cada lugar (ver `pipeline/earth/seed.json`) | Coordenadas: dato factual; citar la fuente | Wikipedia |
| Referencias de las fichas (`fichas.json`) | Lian | | | Pendiente: Lian |
| Tipografías, logo e imágenes | Noe | `docs/design/IDENTIDAD.md` | Fuentes del sistema (Segoe UI, system-ui), sin descarga; símbolo SVG original del equipo; sin recursos gráficos externos | No requiere crédito |

## Software

Versiones instaladas en `web/`; licencias leídas del `package.json` de cada paquete.

| Paquete | Versión | Licencia | Uso |
| --- | --- | --- | --- |
| React y React DOM | 19.3.1 | MIT | Interfaz |
| React Router | 7.18.5 | MIT | Rutas |
| MapLibre GL JS | 6.18.0 | BSD-3-Clause | Mapa del ranking |
| Recharts | 3.10.1 | MIT | Radar del comparador |
| react-markdown y remark-gfm | 10.1.0 y 4.0.1 | MIT | Página de metodología |
| Motion | 14.14.0 | MIT | Transiciones entre pantallas, indicador del destino y reordenado del ranking |
| Radix UI (dialog, select, slider, switch) | ver `web/package.json` | MIT | Controles accesibles con estilo propio (en lugar de shadcn/ui, que exige Tailwind) |
| React Bits (`DecryptedText`, `CountUp`) | copiados en `web/src/components/reactbits/` | MIT + Commons Clause | Efecto del título y contadores de la franja superior; se usan dentro de la app, no se redistribuyen |
| Vite | 8.3.8 | MIT | Compilación |
| TypeScript | 7.0.2 | Apache-2.0 | Lenguaje |
| Vitest | 4.1.12 | MIT | Pruebas |

El pipeline (`pipeline/`) usa solo la biblioteca estándar de Python.

## Uso de herramientas de IA

El equipo usó asistentes de IA (Claude y ChatGPT) para escribir y revisar código, buscar y revisar literatura y redactar textos. Las reglas oficiales piden declararlo y marcar con marca de agua cualquier imagen o video generado por IA. Hoy el proyecto no tiene imágenes ni videos generados por IA.

## Notas

- **Material de NASA:** se usa sin permiso explícito siempre que no dé a entender que NASA nos respalda. Los logos e insignias de NASA no son de dominio público: no los usemos. Fuente: https://www.nasa.gov/nasa-brand-center/images-and-media/
- **GIBS:** texto de agradecimiento copiado de la sección "Data Use Guidance and Acknowledgements" de https://www.earthdata.nasa.gov/engage/open-data-services-software/earthdata-developer-portal/gibs-api. Va en inglés porque todo material enlazado debe estar en inglés.
- **OpenStreetMap:** la web hoy muestra "© colaboradores de OpenStreetMap". Al pasar la web a inglés (issue #25) debe decir "© OpenStreetMap contributors".
- **A verificar:** el crédito exacto del mosaico Viking MDIM 2.1 ("NASA/USGS").
- Detalle de los productos de la Luna y Marte: `pipeline/moon_mars/README.md` y `web/src/components/globe/README.md`.

## Atribución requerida de Terrain Tiles

Texto copiado de https://github.com/tilezen/joerd/blob/master/docs/attribution.md (consultado el 14/11/2026). Las fuentes que realmente aportaron a cada candidato figuran en su campo `sources` de `data/candidates.json`; este bloque cubre todas las posibles.

```text
* ArcticDEM terrain data DEM(s) were created from DigitalGlobe, Inc., imagery and
  funded under National Science Foundation awards 1043681, 1559691, and 1542736;
* Australia terrain data © Commonwealth of Australia (Geoscience Australia) 2017;
* Austria terrain data © offene Daten Österreichs – Digitales Geländemodell (DGM)
  Österreich;
* Canada terrain data contains information licensed under the Open Government
  Licence – Canada;
* Europe terrain data produced using Copernicus data and information funded by the
  European Union - EU-DEM layers;
* Global ETOPO1 terrain data U.S. National Oceanic and Atmospheric Administration
* Mexico terrain data source: INEGI, Continental relief, 2016;
* New Zealand terrain data Copyright 2011 Crown copyright (c) Land Information New
  Zealand and the New Zealand Government (All rights reserved);
* Norway terrain data © Kartverket;
* United Kingdom terrain data © Environment Agency copyright and/or database right
  2015. All rights reserved;
* United States 3DEP (formerly NED) and global GMTED2010 and SRTM terrain data
  courtesy of the U.S. Geological Survey.
```
