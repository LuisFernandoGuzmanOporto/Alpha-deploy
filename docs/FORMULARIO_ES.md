# Textos del formulario de entrega, versión en español

Respaldo por si el formulario o los jueces piden español. La versión principal está en inglés en `docs/ENTREGA.md`, sección 2. Si cambian los datos, revisar las cifras contra ese archivo.

## Nombre del proyecto
Earth Analogs

## Resumen
Earth Analogs es una herramienta web que ordena lugares de la Tierra según cuánto se parecen a los sitios candidatos para una base lunar y a los sitios de aterrizaje en Marte. Para cada sitio calcula un índice de similitud de 0 a 100 con cinco variables, la mayoría derivadas de datos de la NASA, en una misma ventana de 10 × 10 km: pendiente, relieve local, temperatura media, precipitación y albedo. Muestra lado a lado qué se parece y dónde la analogía falla. Responde al desafío identificando y caracterizando análogos de forma sistemática y no solo por su apariencia. Tiene una vista dedicada a lugares poco estudiados y un filtro de Bolivia, y declara los límites que ningún análogo terrestre puede superar: gravedad reducida, vacío lunar, atmósfera tenue de Marte y radiación.

## Enlace a la demostración
https://github.com/LuisFernandoGuzmanOporto/Alpha-deploy/blob/main/docs/demo/earth-analogs-demo-es.pdf

Versión en inglés: https://github.com/LuisFernandoGuzmanOporto/Alpha-deploy/blob/main/docs/demo/earth-analogs-demo.pdf

## Enlace al proyecto
https://earth-analogs-coral.vercel.app

Repositorio: https://github.com/LuisFernandoGuzmanOporto/Alpha-deploy

## Detalles del proyecto

**Qué hace.** Se elige un sitio candidato: tres regiones candidatas de Artemis III cerca del polo sur lunar (Peak Near Cabeus B y Malapert Massif de la lista actual de la NASA, y Faustini Rim A de su lista de 2022) o tres sitios de Marte (los cráteres Jezero y Gale, y Arcadia Planitia). La aplicación muestra un mapa y una lista ordenada de análogos terrestres con su índice de similitud. Los filtros permiten ver solo lugares de Bolivia o solo lugares poco estudiados. Una vista de comparación pone ambos lugares lado a lado: valor por valor, un radar de similitud, etiquetas cualitativas compartidas (geología, hielo, polvo) y un panel de "dónde falla la analogía". Una vista de descubrimientos lista los cinco mejores análogos poco estudiados por sitio. Se puede cambiar el peso de cada variable y ver el ranking recalculado. Un globo 3D de la Tierra, la Luna y Marte muestra el sitio y sus mejores análogos.

**Cómo funciona.** Cada lugar se describe con cinco variables en una ventana de 10 × 10 km. El relieve y la precipitación se pasan a logaritmo, todas las variables se normalizan mín–máx sobre todo el catálogo, y el índice es 100 × (1 − media ponderada de las diferencias absolutas normalizadas), usando solo las variables que ambos lugares tienen (al menos tres). Las etiquetas cualitativas se comparan aparte con el índice de Jaccard. Cada valor no nulo cita su fuente; los valores que faltan quedan vacíos y nunca se estiman. Todo se calcula sin conexión en Python (solo biblioteca estándar) y la aplicación web (React, TypeScript, MapLibre) solo lee archivos JSON estáticos.

**Beneficios y objetivos.** Ayuda a equipos de misión e investigadores a elegir dónde probar en la Tierra rovers, instrumentos y operaciones, y deja explícito para qué sirve cada análogo y dónde falla. También da visibilidad a lugares poco estudiados del Altiplano boliviano.

**Herramientas.** Python, TypeScript, React, Vite, MapLibre GL JS, Recharts, Motion, Radix UI, GitHub y Vercel.

**Hallazgos (versión 1, 6 sitios y 56 candidatos terrestres).** Para los sitios del polo sur lunar, el terreno frío, empinado y seco es el que mejor coincide: los Valles Secos de McMurdo (Antártida), ya documentados como análogo de Marte, quedan primeros en los tres sitios lunares (72,1 en Peak Near Cabeus B, 72,3 en Malapert Massif y 62,7 en Faustini Rim A), seguidos del volcán Licancabur (segundo en los tres) y del volcán Ollagüe, en la frontera Bolivia–Chile, un lugar poco estudiado (tercero en los tres), y luego Ojos del Salado y Socompa (cuarto y quinto en Peak Near Cabeus B y Malapert). La temperatura y la precipitación de las montañas y volcanes provienen de una malla regional gruesa y están sesgadas; el ranking lunar de estos lugares se apoya sobre todo en pendiente y relieve. Para Marte, el núcleo hiperárido del desierto de Atacama cerca de Yungay (Chile), un análogo de Marte documentado, queda primero para Jezero (82,1) y Gale (83,8), seguido de la meseta de Gilf Kebir (Egipto y Libia), que un informe de la NASA de 1982 ya comparaba con Marte, y luego las montañas Tibesti en Jezero y el desierto de Kumtag (China), poco estudiado, en Gale: señal de que el índice pone arriba a los análogos documentados. Lugares de Bolivia aparecen en el top 5 de los seis sitios, incluidos algunos poco estudiados como el volcán Ollagüe (tercero en los tres sitios lunares) y el desierto de Siloli (cuarto en Jezero, quinto en Gale). La analogía falla sobre todo en temperatura (el candidato terrestre más frío promedia −27 °C, los sitios lunares entre −126 y −160 °C) y en precipitación. Los siete análogos lunares conocidos quedan solo entre los puestos 16 y 46 de 56, lo que sugiere que se eligen por propiedades que nuestras cinco variables no miden.

## Uso de Superinteligencia (SI)
Sí. El equipo usó asistentes de IA (Claude y ChatGPT) como herramientas: para ayudar a escribir y revisar código, para buscar y comprobar literatura científica y para redactar y traducir textos. La idea, el método y las decisiones sobre los datos son del equipo. Cada valor de los datos cita una fuente original que un integrante abrió y comprobó. La aplicación no hace llamadas a IA y el proyecto no contiene imágenes, video ni audio generados por IA.

(Confirmar que las herramientas nombradas son las que el equipo usó de verdad.)

## Datos de la NASA
Cada fila es texto del enlace → URL.

- LRO LOLA, modelo de elevación polar (LDEM_75S_240M): pendiente y relieve de los sitios lunares → https://pds-geosciences.wustl.edu/lro/lro-l-lola-3-rdr-v1/lrolol_1xxx/data/lola_gdr/polar/float_img/
- LRO Diviner, Polar Resource Product: temperatura media anual y profundidad de estabilidad del hielo de los sitios lunares → https://pds-geosciences.wustl.edu/lro/urn-nasa-pds-lro_diviner_derived1/data_derived_prp/
- MGS MOLA MEGDR 128 píxeles/grado: pendiente y relieve de los sitios de Marte → https://pds-geosciences.wustl.edu/mgs/mgs-m-mola-5-megdr-l3-v1/mgsl_300x/meg128/
- Mosaicos regionales LROC NAC: coordenadas de los sitios lunares → https://data.lroc.im-ldi.com/lroc/
- NASA GIBS (Blue Marble): textura del globo → https://gibs.earthdata.nasa.gov/
- NASA Moon Trek (mosaico LRO WAC): textura del globo → https://trek.nasa.gov/moon/
- NASA Mars Trek (mosaico Viking MDIM 2.1): textura del globo → https://trek.nasa.gov/mars/
- NASA POWER, climatología 2001–2025 (MERRA-2 y CERES): temperatura de superficie, precipitación corregida y albedo de los candidatos terrestres → https://power.larc.nasa.gov/
- SRTM (NASA) mediante Terrain Tiles en AWS: pendiente y relieve de los candidatos terrestres → https://registry.opendata.aws/terrain-tiles/

## Socios de agencias espaciales y otros datos
- Mars Climate Database v6.2 (LMD/LATMOS/OU/IAA/ESA/CNES): temperatura y albedo de la superficie de Marte → https://www-mars.lmd.jussieu.fr/mcd_python/
- Copernicus DEM GLO-30 (ESA y Unión Europea): pendiente y relieve de cuatro candidatos terrestres (Valles Secos de McMurdo, Svalbard, La Corona y Manjanggul) → https://registry.opendata.aws/copernicus-dem/
- Gazetteer of Planetary Nomenclature de la UAI y el USGS: coordenadas de Arcadia Planitia → https://planetarynames.wr.usgs.gov/
- Colaboradores de OpenStreetMap (ODbL): mapa base → https://www.openstreetmap.org/copyright
- Fotos de Wikimedia Commons de los lugares terrestres (autor y licencia junto a cada foto) → https://commons.wikimedia.org/
- Tipografías Inter y Space Grotesk (SIL Open Font License 1.1) → https://github.com/rsms/inter y https://github.com/floriankarsten/space-grotesk
- Lista completa con enlaces y licencias → https://github.com/LuisFernandoGuzmanOporto/Alpha-deploy/blob/main/docs/ATRIBUCION.md

Literatura: Paige et al. 2010 (Science 330, 479); Vasavada et al. 2014 (JGR Planets, doi:10.1002/2014JE004622); Goudge et al. 2015; Farley et al. 2022; Vaniman et al. 2014; Bridges et al. 2018; Bramson et al. 2015; Colaprete et al. 2010; Kring et al. 2025.

Software: React, React Router, MapLibre GL JS, Recharts, react-markdown, Motion, Radix UI, Vite, TypeScript, Vitest, three.js, React Three Fiber y Drei (MIT).

Fichas de los 56 lugares (`web/public/data/fichas.json`): cada una lista sus propias referencias, 115 enlaces distintos en total (artículos y resúmenes con DOI, informes técnicos de la NASA en NTRS, páginas de datos de NASA POWER y PDS, y Wikipedia para descripciones y coordenadas). Las fuentes de cada análogo documentado están en `docs/AUDITORIA_KNOWN.md`.

Nota de Copernicus: Produced using Copernicus WorldDEM-30 © DLR e.V. 2010-2014 and © Airbus Defence and Space GmbH 2014-2018 provided under COPERNICUS by the European Union and ESA; all rights reserved.
