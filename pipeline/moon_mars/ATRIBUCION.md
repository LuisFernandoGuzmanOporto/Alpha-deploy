# Atribución de las fuentes de Dante

**Para Joel:** estas filas van en `docs/ATRIBUCION.md` (tu archivo). Reemplazan las 3 filas que están a nombre de Dante (Moon Trek, Mars Trek y texturas del globo) y agregan las fuentes de datos de `data/sites.json`. Mismas columnas que tu tabla, listas para copiar.

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
| Texturas del globo, Tierra: Blue Marble Next Generation | Dante | https://gibs.earthdata.nasa.gov/ | Datos de NASA; GIBS pide un agradecimiento | Usamos imágenes de los servicios Global Imagery Browse Services (GIBS) de NASA, parte del Earth Science Data and Information System (ESDIS) |

## Notas

- **Uso de material de NASA:** se puede usar sin permiso explícito siempre que no dé a entender que NASA nos respalda. Los logos e insignias de NASA no son de dominio público: no los usemos. Fuente: https://www.nasa.gov/nasa-brand-center/images-and-media/
- **GIBS:** el texto de crédito es una traducción del agradecimiento que pide GIBS en https://www.earthdata.nasa.gov/gibs. Si se prefiere el original en inglés, copiarlo de esa página.
- **Mars Climate Database:** la línea de crédito sale de https://www-mars.lmd.jussieu.fr/mcd_python/credit.html. Esa página no publica licencia ni un artículo para citar, así que no se agregó ninguno.
- **A verificar:** el crédito exacto del mosaico Viking MDIM 2.1 ("NASA/USGS"). Tampoco se agregaron artículos de referencia para LOLA y MOLA porque no se pudieron comprobar.
- Detalle de cada producto y método: `pipeline/moon_mars/README.md` y `web/src/components/globe/README.md`.
