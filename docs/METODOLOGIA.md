# Metodología del índice de similitud

## 1. Objetivo

El índice ordena lugares de la Tierra según su similitud con un sitio candidato de la Luna o Marte en cinco variables de terreno, temperatura, aridez y reflectividad. Cada resultado muestra qué variables se pudieron comparar y cuánto difieren. El ranking orienta la búsqueda de lugares donde estudiar procesos o ensayar operaciones, y se interpreta junto con las fichas, las coincidencias cualitativas y las limitaciones de cada analogía.

## 2. Variables y su razón física

| Variable | Qué mide | Por qué importa | Fuente usada en la Tierra | Fuente usada en Luna y Marte |
| --- | --- | --- | --- | --- |
| `slope_deg` | Pendiente media del terreno, en grados | Ayuda a comparar la inclinación del terreno para movilidad y emplazamiento. | Mapzen Terrain Tiles (fuentes por tesela en cada registro); Copernicus DEM GLO-30 en McMurdo, Svalbard, La Corona y Manjanggul | LOLA `LDEM_75S_240M` en la Luna y MOLA MEGDR de 128 píxeles/grado en Marte |
| `relief_m` | Desviación estándar de la elevación en la ventana, en metros | Describe la variación vertical del terreno a escala local. | El mismo modelo de elevación | Los mismos productos de elevación |
| `temp_mean_c` | Temperatura media anual en °C, con una aproximación subsuperficial en la Luna | Compara el entorno térmico medio relevante para equipos y materiales. | NASA POWER, temperatura de superficie | Diviner Polar Resource Product sur, `temp_avg` modelada a 2 cm en la Luna. Mars Climate Database (MCD) v6.2, `tsurf` de superficie modelada en Marte. |
| `precip_mm_year` | Precipitación media anual, en mm/año | Distingue los entornos terrestres por aridez según la precipitación. | NASA POWER, precipitación corregida | Cero por convención del índice, que compara el aporte por lluvia |
| `albedo` | Fracción de radiación solar reflejada por la superficie, de 0 a 1 | Ayuda a comparar cómo interactúa la superficie con la luz solar. | NASA POWER, `ALLSKY_SRF_ALB` (CERES) | Luna: `null`, sin mapa grillado comparable para las ventanas polares. Marte: `ground_albedo` de MCD v6.2, albedo de suelo desnudo del modelo. |

Cada valor no nulo requiere una fuente en `sources` con el producto y su referencia. En `notes` se documenta el sistema de coordenadas extraterrestre, el método de extracción y, cuando corresponda, la resolución, el período o el motivo de un dato faltante. Un valor cuya cobertura o definición impida compararlo se registra como `null`.

## 3. Escala común

La ventana objetivo para pendiente y relieve es de 10 × 10 km, con una resolución de referencia de unos 250 m por píxel. Para los datos disponibles se conservó la resolución de origen: LOLA a 240 m en la Luna y MOLA a unos 463 m en Marte. En ambas ventanas se calcula la pendiente media con Horn (3 × 3, en píxeles interiores) y el relieve como desviación estándar poblacional de la elevación. La malla más gruesa de MOLA suaviza la pendiente y puede reducir el relieve observado. Un remuestreo a 250 m no recuperaría ese detalle. Las elevaciones absolutas dependen de niveles de referencia distintos en cada cuerpo.

En cuatro lugares terrestres (Valles Secos de McMurdo, Svalbard, La Corona y Manjanggul) las teselas de Mapzen solo traían modelos globales gruesos o batimetría marina, y la pendiente y el relieve se calculan con Copernicus DEM GLO-30 (ESA, 30 m), muestreado a 250 m con el mismo método. Donde la ventana incluye mar (el 15,5 % en Svalbard, el 16,0 % en Manjanggul y el 51,7 % en La Corona) el modelo da 0 m sobre el agua, así que se excluye: el relieve usa solo puntos de tierra (elevación mayor de 1 m) y la pendiente solo los puntos con todo su vecindario de tierra. El lector y el método se validaron contra seis lugares ya calculados con Terrain Tiles: las pendientes coincidieron dentro de 0,22° y los relieves dentro de 2,4 m.

Las variables térmicas y radiométricas pueden provenir de productos con huellas mayores que la ventana o con cobertura temporal desigual. Se registra el área efectiva y el período representado. La ventana topográfica común permite comparar la misma extensión, con distinta resolución efectiva.

## 4. Fórmula

1. Aplicamos el logaritmo natural de `1 + x` a `relief_m` y `precip_mm_year`, con los valores en sus unidades pactadas. Esto conserva el cero y reduce la influencia de diferencias grandes en las colas. Las demás variables conservan sus unidades antes de normalizarlas por mínimo y máximo.

   - `slope_deg` mide un ángulo respecto a la horizontal. Una diferencia de 5° representa la misma separación angular en cualquier parte del rango. El índice compara esa geometría y la movilidad real depende también del vehículo, la tracción y la gravedad. [Definición de pendiente, USGS](https://www.usgs.gov/educational-resources/determine-percent-slope-and-angle-slope).
   - `temp_mean_c` compara diferencias de temperatura media en °C. Una diferencia de 10 °C equivale a 10 K en todo el rango. El cálculo lineal da la misma diferencia al expresar los datos en kelvin, porque el desplazamiento del cero se cancela al restar. [Intervalos de temperatura, NIST](https://physics.nist.gov/cuu/Units/register2.html).
   - `albedo` ya es una fracción acotada entre 0 y 1. Bajo definiciones y condiciones comparables, una diferencia de 0,05 equivale a cinco puntos porcentuales de la radiación incidente reflejada, cualquiera sea el albedo de partida. [Albedo superficial, NASA](https://power.larc.nasa.gov/docs/methodology/data/derived/derived-parameters/).
2. Para cada variable calculamos el mínimo y el máximo de los valores disponibles en todo el catálogo, incluidos sitios y candidatos, después de la transformación. Normalizamos mediante `(valor − mínimo) / (máximo − mínimo)`. Si el rango es cero, el código devuelve cero para todos los valores presentes. Si falta el dato, se omite.
3. Para cada par, calculamos la diferencia absoluta entre los valores normalizados de las variables disponibles en ambos registros. El par entra al ranking con al menos tres variables compartidas.
4. La distancia es la suma de las diferencias multiplicadas por sus pesos, dividida por la suma de los pesos de las variables compartidas. El puntaje es `100 × (1 − distancia)` y se exporta redondeado a un decimal. También se exportan `n_vars_used` y `norm_diff` (a cuatro decimales). El ranking ordena por puntaje redondeado y, en caso de empate, conserva el orden de entrada.
5. Las coincidencias cualitativas se muestran junto al puntaje. Si ambos sitios tienen etiquetas documentadas, `tag_overlap` informa el índice de Jaccard, que divide el número de etiquetas compartidas por el número total de etiquetas distintas del par. Si a uno le faltan etiquetas, devuelve `null`.

## 5. Pesos

Cada variable empieza con peso 1. Es una referencia reproducible mientras se evalúa la sensibilidad del ranking y no hay una calibración por objetivo de misión (los perfiles de abajo son ejemplos, no una calibración). Dos variables de terreno pueden sumar influencia si están correlacionadas. La disponibilidad también cambia el peso efectivo, dado que el promedio solo incluye las variables compartidas. Mantener las etiquetas fuera del puntaje evita darle el mismo significado a una diferencia medida y a una diferencia en la documentación disponible.

### Perfiles por objetivo de misión

En "Filtros", cuatro botones fijan los cinco pesos según el objetivo de un ensayo. Son **perfiles de ejemplo**, no una calibración científica: hacen explícito qué variable importa más para cada pregunta y se pueden compartir con el parámetro `pesos` de la URL (el perfil activo se deduce comparando los pesos con la lista de `web/src/lib/profiles.ts`).

| Perfil | Pendiente | Relieve | Temperatura | Precipitación | Albedo | Razón |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Igual (por defecto) | 1 | 1 | 1 | 1 | 1 | Referencia del índice |
| Movilidad de rovers | 3 | 3 | 0,5 | 0,5 | 1 | El terreno decide si un vehículo puede pasar y cómo navega; el albedo cambia la iluminación de las cámaras |
| Energía y sistemas térmicos | 1 | 1 | 3 | 0,5 | 2 | La temperatura manda y el albedo fija cuánta radiación absorbe la superficie |
| Agua y hielo | 0,5 | 0,5 | 2 | 3 | 1 | La aridez y el frío deciden si el agua o el hielo pueden persistir |

Primer puesto con cada perfil (calculado con las diferencias normalizadas de `results.json`):

| Sitio | Igual | Movilidad | Energía | Agua y hielo |
| --- | --- | --- | --- | --- |
| Faustini Rim A | McMurdo (62,7) | Mauna Kea (85,4) | McMurdo (52,4) | Gilf Kebir (59,8) |
| Peak Near Cabeus B | McMurdo (72,1) | McMurdo (90,5) | McMurdo (65,9) | Gilf Kebir (64,2) |
| Malapert Massif | McMurdo (72,2) | McMurdo (91,3) | McMurdo (65,4) | Gilf Kebir (63,8) |
| Jezero | Atacama-Yungay (82,1) | Laguna Colorada (90,4) | Laguna Colorada (81,7) | Gilf Kebir (82,2) |
| Gale | Atacama-Yungay (83,8) | Laguna Colorada (90,0) | Atacama-Yungay (81,1) | Gilf Kebir (83,8) |
| Arcadia Planitia | Gilf Kebir (76,9) | Dasht-e Kavir (91,1) | Coipasa (75,3) | Gilf Kebir (78,2) |

Con "Agua y hielo", Gilf Kebir sube porque su celda de NASA POWER da 0,0 mm/año; ese cero es un valor del producto regional, no una medición local. En la Luna el albedo no tiene dato, así que su peso no cambia esos rankings.

## 6. Sensibilidad y validación

La referencia inicial es mínimo–máximo sobre el catálogo conjunto. Una temperatura lunar extrema ensancha el rango y reduce la separación térmica entre los demás registros. La comparación con una variante basada en cuantiles sigue sin realizarse. Con pocas observaciones, los cuantiles son inestables y el recorte puede ocultar diferencias relevantes en los polos.

### Resultados de sensibilidad (S-3)

Se evaluaron 47 candidatos y seis sitios con el catálogo de esta entrega, en el que cada candidato comparte al menos tres variables con cada sitio. Las 60 pruebas de pesos modifican una variable a la vez en ±50 %. Las otras 30 retiran una variable y vuelven a exigir al menos tres valores compartidos. El desplazamiento se calcula entre candidatos presentes en ambos rankings. El top 5 se toma del ranking general, con el orden de entrada como desempate de los puntajes redondeados.

| Sitio | ±50 %: top 5 compartido (mín.–máx.) | ±50 %: mayor desplazamiento medio / individual | Omisión: top 5 compartido (mín.–máx.) | Omisión: mayor desplazamiento medio / individual |
| --- | ---: | ---: | ---: | ---: |
| Faustini Rim A | 3–5 | 2,30 / 14 | 3–5 | 5,49 / 22 |
| Peak Near Cabeus B | 4–5 | 1,83 / 12 | 2–5 | 4,26 / 20 |
| Malapert Massif | 3–5 | 1,87 / 13 | 3–5 | 4,13 / 21 |
| Jezero | 4–5 | 3,19 / 10 | 2–5 | 6,77 / 29 |
| Gale | 4–5 | 3,23 / 14 | 3–4 | 7,32 / 33 |
| Arcadia Planitia | 4–5 | 2,13 / 9 | 3–5 | 4,21 / 17 |

Con cambios de peso, 58 de 60 pruebas mantuvieron al menos cuatro nombres del top 5 y 38 conservaron los cinco. Las excepciones fueron Faustini con precipitación al +50 % y Malapert con precipitación al −50 %. Las omisiones conservaron al menos cuatro nombres en 19 de 30 pruebas. Quitar la pendiente dejó solo dos nombres en Peak Near Cabeus B, y quitar la precipitación, en Jezero. En Gale, retirar la pendiente movió hasta 33 posiciones a un candidato del ranking. Con el catálogo completo, ninguna prueba hace entrar o salir candidatos del ranking. El albedo lunar faltante explica que variar o retirar su peso deje intactos los rankings lunares.

Se mantienen los pesos iguales como referencia. Para interpretar candidatos cercanos en puntaje, conviene mirar su cobertura y si se mantienen arriba al retirar una variable. La influencia de los extremos térmicos sobre la escala min–max sigue siendo una limitación. La prueba no compara normalizaciones alternativas.

| Control sintético con terreno y albedo iguales | Puntajes comparados | Resultado |
| --- | ---: | --- |
| Frío y seco frente a cálido y húmedo | 85,8 / 60,0 | Orden esperado |
| Menor precipitación a igual temperatura | 75,1 / 60,0 | Orden esperado |
| Menor diferencia térmica a igual precipitación | 70,7 / 60,0 | Orden esperado |

### Robustez del puesto en la interfaz

Cada uno de los tres primeros análogos del ranking, y el análogo elegido, muestra una insignia como "Puesto estable: del 2.º al 4.º en 15 de 15 escenarios". El navegador repite la prueba de `pipeline/sensitivity.py` para ese sitio: cada peso al −50 % y al +50 % y quitar cada variable (volviendo a exigir tres compartidas), con los pesos activos como base. Las diferencias se recalculan a precisión completa con `ranges` y `log_variables` de `results.json`, y los empates se resuelven por el orden del catálogo, como en el pipeline; una prueba (`web/src/lib/robustness.test.ts`) comprueba que los seis rankings base y los 30 escenarios de Jezero y Peak Near Cabeus B coinciden con la salida de `sensitivity.py`. La insignia dice "estable" si el puesto se mueve dos lugares o menos, "algo sensible" hasta cinco y "sensible" si se mueve más o sale del ranking en algún escenario. Con los pesos iguales, el Atacama (Yungay) va del 1.º al 11.º en Jezero y Gilf Kebir del 1.º al 26.º (al quitar la precipitación), mientras Tibesti se queda entre el 2.º y el 4.º.

### Validación por cuerpo y candidatos poco estudiados (S-6)

La validación usa `known: true` y exige que `analog_for` incluya el cuerpo del sitio. El conteo de poco estudiados usa `known: false` dentro del top 5 general. El índice compara los pares con cobertura suficiente, con independencia de `analog_for`. Esta distinción importa en la Luna, donde McMurdo y Laguna Verde, conocidos como análogos de Marte, ocupan puestos del top 5 lunar.

| Sitio | Pares | Conocidos del cuerpo en el top 5 | Poco estudiados en el top 5 (posición y puntaje) |
| --- | ---: | --- | --- |
| Faustini Rim A | 47 | 0 de 7 | 1: Uturuncu (4.º, 57,3) |
| Peak Near Cabeus B | 47 | 0 de 7 | 2: Socompa (4.º, 62,0) y Sajama (5.º, 60,6) |
| Malapert Massif | 47 | 0 de 7 | 2: Socompa (4.º, 62,0) y Pamir (5.º, 60,8) |
| Jezero | 47 | 3 de 26: Atacama-Yungay (1.º, 82,1), Gilf Kebir (2.º, 80,9) y Tibesti (3.º, 80,2) | 2: Siloli (4.º, 79,5) y Harrat Khaybar (5.º, 79,3) |
| Gale | 47 | 3 de 26: Atacama-Yungay (1.º, 83,8), Gilf Kebir (2.º, 83,3) y Tibesti (3.º, 79,0) | 2: Siloli (4.º, 79,0) y Laguna Colorada (5.º, 78,1) |
| Arcadia Planitia | 47 | 3 de 26: Gilf Kebir (2.º, 76,9), Qaidam (4.º, 75,8) y Coipasa (5.º, 74,5) | 2: Dasht-e Kavir (1.º, 76,9) y Taklamakan (3.º, 76,9) |

En los rankings lunares (47 pares cada uno), los 7 análogos lunares conocidos quedan lejos del top 5: Mauna Kea entre el 12.º y el 17.º, Pinacate entre el 15.º y el 17.º, La Corona 20.º, Askja 26.º, Lava Beds 27.º, El Malpaís 33.º y Undara 39.º. Las mayores diferencias normalizadas de esos pares son temperatura o precipitación. Los análogos documentados pueden ser útiles por procesos geológicos, como el vulcanismo o los tubos de lava, que quedan fuera del puntaje. En Marte entran al ranking los 26 conocidos pertinentes y tres de ellos encabezan Jezero y Gale. McMurdo, documentado como análogo de Marte, queda 45.º o 46.º en Marte, pero encabeza los tres sitios lunares (72,1 en Peak Near Cabeus B, 72,2 en Malapert y 62,7 en Faustini) por su pendiente (15,3°), su relieve (418 m) y su frío (−26,7 °C, el más bajo del catálogo). El albedo terrestre incluye nieve, agua y vegetación, mientras que el marciano describe suelo desnudo. La validación respalda el ranking marciano y deja sin confirmar el lunar.

El núcleo hiperárido del Atacama, con el punto del pozo de muestreo de Yungay (Azua-Bustos et al. 2020), lidera Jezero y Gale: sus diferencias normalizadas de pendiente y relieve no superan 0,12 en ambos sitios y la de albedo es 0,01 en Gale. Gilf Kebir, documentado como análogo de Marte en el informe NASA CR-3611 (El-Baz y Maxwell, 1982), queda segundo en ambos, con 0,0 mm/año en el producto regional NASA POWER; ese cero es un valor del producto y no demuestra ausencia local de lluvias. En Arcadia, Dasht-e Kavir y Taklamakan tienen diferencias normalizadas de pendiente inferiores a 0,004 y de relieve inferiores a 0,045, aunque sus diferencias térmicas rondan 0,49–0,52. Siloli aparece cuarto en Jezero y Gale, con diferencias normalizadas de albedo inferiores a 0,07 y de relieve inferiores a 0,10. En la Luna, Ojos del Salado y Socompa se mantienen entre los primeros en más de un sitio por la semejanza del terreno, mientras la diferencia térmica de esos pares supera 0,65.

Los poco estudiados ocupan 11 de los 30 puestos del top 5 general, contando repeticiones entre sitios (12 antes de la auditoría). El catálogo asignó `known: false` a partir de una búsqueda bibliográfica preliminar que falló varias veces: Gilf Kebir pasó a `known: true` porque Crossref no indexa los informes técnicos de NASA, donde sí figura; Ojos del Salado, por dos artículos de *Astrobiology* de 2020 (doi:10.1089/ast.2018.2021 y doi:10.1089/ast.2019.2024); y la auditoría de la fase final (`docs/AUDITORIA_KNOWN.md`) pasó a conocidos a Laguna Verde, Rub' al Khali, Lava Beds, El Malpaís, el lago Eyre y Undara. Los 19 que siguen poco estudiados no tienen una publicación encontrada que los use como análogo de la Luna o de Marte; eso no prueba que no exista. Estos resultados sirven para priorizar la revisión de candidatos. Jaccard sigue como indicador aparte para contrastar procesos documentados. La climatología terrestre es regional, por lo que la comparación debe verificarse antes de atribuir una similitud a un lugar de campo concreto.

## 7. Limitaciones

- El puntaje es relativo al catálogo y a las variables compartidas. Incorporar registros puede cambiar los rangos y los puntajes de pares ya calculados. Dos pares con la misma puntuación pueden tener distinta cobertura. `n_vars_used` indica cuántas variables contribuyen, y `norm_diff` permite comprobar cuáles.
- La referencia térmica del contrato es la media anual de superficie. Para la Luna se acepta provisionalmente `temp_avg` de Diviner como aproximación cercana a la superficie. Es una media anual modelada a 2 cm de profundidad y esa diferencia puede sesgar la comparación entre cuerpos. En Marte, `tsurf` de MCD v6.2 es una temperatura de superficie modelada, promediada sobre horas locales 0–23 y valores de longitud solar Ls de 0° a 345° cada 15°, sin ponderar la duración de las estaciones. Las temperaturas extremas de las regiones lunares en sombra permanente pueden producir diferencias grandes incluso con los mejores candidatos terrestres.
- La comparación de albedo depende de la banda espectral, la geometría de iluminación y observación, y la definición del producto. La reflectancia en una sola banda no equivale al albedo solar de banda ancha. Los tres sitios lunares tienen `albedo: null`. Sus comparaciones usan como máximo cuatro variables y el albedo solo discrimina en pares con Marte cuando el candidato terrestre tiene ese dato.
- En cuatro lugares (McMurdo, Svalbard, La Corona y Manjanggul) la pendiente y el relieve vienen de Copernicus DEM GLO-30, un modelo de superficie de 30 m, y no de Terrain Tiles; en tres de ellos se calculan solo con los puntos de tierra porque la ventana incluye mar. Son menos comparables con el resto, y en la Antártida el modelo de superficie incluye el hielo.
- La precipitación representa un aspecto de la aridez. El cero convencional para Luna y Marte no describe hielo, escarcha, vapor ni disponibilidad de agua. El índice tampoco mide directamente la gravedad, el vacío lunar, la atmósfera marciana, la radiación, la iluminación, el regolito, el polvo ni las comunicaciones. Las fichas deben explicar para qué sirve cada analogía y dónde deja de ser válida.

## 8. Fuentes

- Tierra — [Terrain Tiles de Mapzen](https://registry.opendata.aws/terrain-tiles/) y [climatología de NASA POWER](https://power.larc.nasa.gov/docs/services/api/temporal/climatology/) (TS, PRECTOTCORR y ALLSKY_SRF_ALB).
- Luna — [LOLA LDEM_75S_240M](https://pds-geosciences.wustl.edu/lro/lro-l-lola-3-rdr-v1/lrolol_1xxx/data/lola_gdr/polar/img/ldem_75s_240m.img) y [Diviner Polar Resource Product sur](https://pds-geosciences.wustl.edu/lro/urn-nasa-pds-lro_diviner_derived1/data_derived_prp/dlre_prp_south.tab).
- Tierra (McMurdo, Svalbard, La Corona y Manjanggul) — [Copernicus DEM GLO-30](https://registry.opendata.aws/copernicus-dem/) de ESA y la Unión Europea.
- Marte — [MOLA MEGDR de 128 píxeles/grado](https://pds-geosciences.wustl.edu/missions/mgs/megdr.html) y [Mars Climate Database v6.2](https://www-mars.lmd.jussieu.fr/mcd_python/).

## 9. Escaneo global (S-7)

Se descarta el escaneo global en cuadrícula de 2° para esta entrega. Falta una vía de datos validada que cubra tierra firme y obtenga variables comparables sin descargas masivas. El escaneo queda como posible trabajo futuro. Esta entrega publica los rankings del catálogo de 47 candidatos y prescinde de `scan.json`.
