# Atribuciones y licencias

Dueño: Joel. Cada persona le pasa sus fuentes. Se muestra en el pie de la web y es la base del campo "Space Agency Partner Data and Other References" del formulario de entrega, que exige listar todo dato, código, texto e imagen usados (ver `docs/REQUISITOS.md`).

## Datos e imágenes

| Recurso | Quién lo aporta | URL | Licencia o condición de uso | Texto de crédito |
| --- | --- | --- | --- | --- |
| LRO LOLA, elevación polar sur LDEM_75S_240M | Dante | https://pds-geosciences.wustl.edu/lro/lro-l-lola-3-rdr-v1/lrolol_1xxx/data/lola_gdr/polar/img/ | Datos de NASA: no sujetos a copyright en EE. UU.; reconocer a NASA como fuente | NASA/GSFC, LRO LOLA (PDS Geosciences Node) |
| LRO Diviner, Polar Resource Product (temperatura y estabilidad de hielo) | Dante | https://pds-geosciences.wustl.edu/lro/urn-nasa-pds-lro_diviner_derived1/data_derived_prp/ | Datos de NASA; reconocer a NASA como fuente | NASA/UCLA, LRO Diviner; Paige et al. 2010, Science 330, 479-482 |
| MGS MOLA MEGDR 128 px/grado (elevación de Marte) | Dante | https://pds-geosciences.wustl.edu/mgs/mgs-m-mola-5-megdr-l3-v1/mgsl_300x/meg128/ | Datos de NASA; reconocer a NASA como fuente | NASA/GSFC, MGS MOLA (PDS Geosciences Node) |
| Mars Climate Database v6.2 (temperatura y albedo de Marte) | Dante | https://www-mars.lmd.jussieu.fr/mcd_python/ | Su página no publica licencia; pide crédito | Mars Climate Database (c) LMD/LATMOS/OU/IAA/ESA/CNES |
| Mosaicos LROC NAC (coordenadas de los sitios lunares) | Dante | https://data.lroc.im-ldi.com/lroc/ | Datos de NASA; reconocer la fuente | NASA/GSFC/Arizona State University |
| Gazetteer of Planetary Nomenclature (coordenadas de Arcadia Planitia) | Dante | https://planetarynames.wr.usgs.gov/ | Servicio público de IAU/USGS | IAU WGPSN / USGS Astrogeology Science Center |
| Moon Trek (NASA), mosaico LRO WAC para el globo | Dante | https://trek.nasa.gov/moon/ | Datos de NASA; reconocer a NASA como fuente | NASA/GSFC/Arizona State University, vía NASA Moon Trek |
| Mars Trek (NASA), mosaico color Viking MDIM 2.1 para el globo | Dante | https://trek.nasa.gov/mars/ | Datos de NASA; reconocer a NASA como fuente | NASA/USGS (a verificar), vía NASA Mars Trek |
| Texturas del globo, Tierra: Blue Marble Next Generation | Dante | https://gibs.earthdata.nasa.gov/ | Datos de NASA; GIBS pide un agradecimiento | We acknowledge the use of imagery provided by services from NASA's Global Imagery Browse Services (GIBS), part of NASA's Earth Science Data and Information System (ESDIS). |
| Mapa base: teselas de OpenStreetMap | Fernando | https://www.openstreetmap.org/copyright | Datos bajo Open Database License (ODbL); el crédito debe verse en el mapa | © OpenStreetMap contributors |
| NASA POWER (temperatura y precipitación de la Tierra) | Lian | | | Pendiente: Lian |
| Modelo digital de elevación de la Tierra | Lian | | | Pendiente: Lian |
| Producto de albedo de la Tierra | Lian | | | Pendiente: Lian |
| Referencias de las fichas (`fichas.json`) | Lian | | | Pendiente: Lian |
| Íconos, tipografías e imágenes | Noe | | | Pendiente: Noe |

## Software

Versiones instaladas en `web/`; licencias leídas del `package.json` de cada paquete.

| Paquete | Versión | Licencia | Uso |
| --- | --- | --- | --- |
| React y React DOM | 19.3.1 | MIT | Interfaz |
| React Router | 7.18.5 | MIT | Rutas |
| MapLibre GL JS | 6.18.0 | BSD-3-Clause | Mapa del ranking |
| Recharts | 3.10.1 | MIT | Radar del comparador |
| react-markdown y remark-gfm | 10.1.0 y 4.0.1 | MIT | Página de metodología |
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
