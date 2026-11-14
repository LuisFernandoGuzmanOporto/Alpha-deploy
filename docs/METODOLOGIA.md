# Metodología del índice de similitud

## 1. Objetivo

El índice ordena lugares de la Tierra según su similitud con un sitio candidato de la Luna o Marte en cinco variables de terreno, temperatura, aridez y reflectividad. Cada resultado muestra qué variables se pudieron comparar y cuánto difieren. El ranking orienta la búsqueda de lugares donde estudiar procesos o ensayar operaciones, y se interpreta junto con las fichas, las coincidencias cualitativas y las limitaciones de cada analogía.

## 2. Variables y su razón física

| Variable | Qué mide | Por qué importa | Fuente usada en la Tierra | Fuente usada en Luna y Marte |
| --- | --- | --- | --- | --- |
| `slope_deg` | Pendiente media del terreno, en grados | Ayuda a comparar la inclinación del terreno para movilidad y emplazamiento. | Mapzen Terrain Tiles (fuentes por tesela en cada registro) | LOLA `LDEM_75S_240M` en la Luna y MOLA MEGDR de 128 píxeles/grado en Marte |
| `relief_m` | Desviación estándar de la elevación en la ventana, en metros | Describe la variación vertical del terreno a escala local. | El mismo modelo de elevación | Los mismos productos de elevación |
| `temp_mean_c` | Temperatura media anual en °C, con una aproximación subsuperficial en la Luna | Compara el entorno térmico medio relevante para equipos y materiales. | NASA POWER, temperatura de superficie | Diviner Polar Resource Product sur, `temp_avg` modelada a 2 cm en la Luna. Mars Climate Database (MCD) v6.2, `tsurf` de superficie modelada en Marte. |
| `precip_mm_year` | Precipitación media anual, en mm/año | Distingue los entornos terrestres por aridez según la precipitación. | NASA POWER, precipitación corregida | Cero por convención del índice, que compara el aporte por lluvia |
| `albedo` | Fracción de radiación solar reflejada por la superficie, de 0 a 1 | Ayuda a comparar cómo interactúa la superficie con la luz solar. | NASA POWER, `ALLSKY_SRF_ALB` (CERES) | Luna: `null`, sin mapa grillado comparable para las ventanas polares. Marte: `ground_albedo` de MCD v6.2, albedo de suelo desnudo del modelo. |

Cada valor no nulo requiere una fuente en `sources` con el producto y su referencia. En `notes` se documenta el sistema de coordenadas extraterrestre, el método de extracción y, cuando corresponda, la resolución, el período o el motivo de un dato faltante. Un valor cuya cobertura o definición impida compararlo se registra como `null`.

## 3. Escala común

La ventana objetivo para pendiente y relieve es de 10 × 10 km, con una resolución de referencia de unos 250 m por píxel. Para los datos disponibles se conservó la resolución de origen: LOLA a 240 m en la Luna y MOLA a unos 463 m en Marte. En ambas ventanas se calcula la pendiente media con Horn (3 × 3, en píxeles interiores) y el relieve como desviación estándar poblacional de la elevación. La malla más gruesa de MOLA suaviza la pendiente y puede reducir el relieve observado. Un remuestreo a 250 m no recuperaría ese detalle. Las elevaciones absolutas dependen de niveles de referencia distintos en cada cuerpo.

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

Cada variable empieza con peso 1. Es una referencia reproducible mientras se evalúa la sensibilidad del ranking y no hay una calibración por objetivo de misión. Dos variables de terreno pueden sumar influencia si están correlacionadas. La disponibilidad también cambia el peso efectivo, dado que el promedio solo incluye las variables compartidas. Mantener las etiquetas fuera del puntaje evita darle el mismo significado a una diferencia medida y a una diferencia en la documentación disponible.

## 6. Sensibilidad y validación

La referencia inicial es mínimo–máximo sobre el catálogo conjunto. Una temperatura lunar extrema ensancha el rango y reduce la separación térmica entre los demás registros. La comparación con una variante basada en cuantiles sigue sin realizarse. Con pocas observaciones, los cuantiles son inestables y el recorte puede ocultar diferencias relevantes en los polos.

### Resultados de sensibilidad (S-3)

Se evaluaron 47 candidatos y seis sitios con los catálogos de `fe45e52`. Las 60 pruebas de pesos modifican una variable a la vez en ±50 %. Las otras 30 retiran una variable y vuelven a exigir al menos tres valores compartidos. El desplazamiento se calcula entre candidatos presentes en ambos rankings. El top 5 se toma del ranking general, con el orden de entrada como desempate de los puntajes redondeados.

| Sitio | ±50 %: top 5 compartido (mín.–máx.) | ±50 %: mayor desplazamiento medio / individual | Omisión: top 5 compartido (mín.–máx.) | Omisión: mayor desplazamiento medio / individual |
| --- | ---: | ---: | ---: | ---: |
| Faustini Rim A | 4–5 | 1,91 / 14 | 2–5 | 4,88 / 20 |
| Peak Near Cabeus B | 4–5 | 1,72 / 13 | 2–5 | 3,91 / 19 |
| Malapert Massif | 3–5 | 1,77 / 13 | 3–5 | 3,86 / 19 |
| Jezero | 4–5 | 3,15 / 11 | 3–5 | 6,55 / 29 |
| Gale | 4–5 | 3,06 / 13 | 2–5 | 6,60 / 31 |
| Arcadia Planitia | 4–5 | 2,04 / 8 | 4–5 | 4,60 / 17 |

Con cambios de peso, 59 de 60 pruebas mantuvieron al menos cuatro nombres del top 5 y 39 conservaron los cinco. La excepción fue Malapert con precipitación al −50 %. Las omisiones conservaron al menos cuatro nombres en 21 de 30 pruebas. Quitar la precipitación dejó solo dos nombres en Faustini y Gale. En Gale, retirar la pendiente movió hasta 31 posiciones a un candidato del ranking. En Marte, quitar temperatura, precipitación o albedo excluyó cuatro pares que ya carecían de pendiente y relieve. El albedo lunar faltante explica que variar o retirar su peso deje intactos los rankings lunares.

Se mantienen los pesos iguales como referencia. Para interpretar candidatos cercanos en puntaje, conviene mirar su cobertura y si se mantienen arriba al retirar una variable. La influencia de los extremos térmicos sobre la escala min–max sigue siendo una limitación. La prueba no compara normalizaciones alternativas.

| Control sintético con terreno y albedo iguales | Puntajes comparados | Resultado |
| --- | ---: | --- |
| Frío y seco frente a cálido y húmedo | 85,8 / 60,0 | Orden esperado |
| Menor precipitación a igual temperatura | 75,1 / 60,0 | Orden esperado |
| Menor diferencia térmica a igual precipitación | 70,7 / 60,0 | Orden esperado |

### Validación por cuerpo y candidatos poco estudiados (S-6)

La validación usa `known: true` y exige que `analog_for` incluya el cuerpo del sitio. El conteo de poco estudiados usa `known: false` dentro del top 5 general. El índice compara los pares con cobertura suficiente, con independencia de `analog_for`. Esta distinción importa en la Luna, donde todos los poco estudiados del top 5 están etiquetados para Marte en el catálogo.

| Sitio | Pares | Conocidos del cuerpo en el top 5 | Poco estudiados en el top 5 (posición y puntaje) |
| --- | ---: | --- | --- |
| Faustini Rim A | 43 | 0 de 4 | 3: Laguna Verde (3.º, 58,7), Uturuncu (4.º, 57,2), Ojos del Salado (5.º, 56,3) |
| Peak Near Cabeus B | 43 | 0 de 4 | 3: Ojos del Salado (2.º, 63,3), Socompa (4.º, 62,0), Sajama (5.º, 60,6) |
| Malapert Massif | 43 | 0 de 4 | 3: Ojos del Salado (2.º, 63,3), Socompa (4.º, 62,0), Pamir (5.º, 60,8) |
| Jezero | 47 | 2 de 20: Gilf Kebir (1.º, 80,8) y Tibesti (2.º, 80,2) | 3: Siloli (3.º, 79,4), Harrat Khaybar (4.º, 79,2), Laguna Colorada (5.º, 78,6) |
| Gale | 47 | 2 de 20: Gilf Kebir (1.º, 83,2) y Tibesti (2.º, 79,0) | 3: Siloli (3.º, 78,9), Laguna Colorada (4.º, 78,1), Namib (5.º, 77,2) |
| Arcadia Planitia | 47 | 3 de 20: Gilf Kebir (3.º, 76,8), Qaidam (4.º, 75,8) y Coipasa (5.º, 74,5) | 2: Taklamakan (1.º, 76,9) y Dasht-e Kavir (2.º, 76,8) |

En los tres rankings lunares, Pinacate queda 14.º, Mauna Kea 16.º y Askja 23.º. Las mayores diferencias normalizadas de esos pares son temperatura o precipitación. La Corona queda excluida porque, sin pendiente, relieve ni albedo lunar, solo comparte dos variables. Los análogos documentados pueden ser útiles por procesos geológicos, como el vulcanismo o los tubos de lava, que quedan fuera del puntaje. En Marte entran al ranking los 20 conocidos pertinentes, pero solo algunos llegan al top 5. McMurdo queda entre 37.º y 45.º con tres variables y la diferencia de albedo como su mayor penalización. El albedo terrestre incluye nieve, agua y vegetación, mientras que el marciano describe suelo desnudo. La validación respalda parcialmente el ranking marciano y deja sin confirmar el lunar.

Gilf Kebir, documentado como análogo de Marte en el informe NASA CR-3611 (El-Baz y Maxwell, 1982), lidera Jezero y Gale por su pendiente cercana y los 0,0 mm/año del producto regional NASA POWER. Ese cero es un valor del producto y no demuestra ausencia local de lluvias. En Arcadia, Taklamakan y Dasht-e Kavir tienen diferencias normalizadas de pendiente inferiores a 0,004 y de relieve inferiores a 0,046, aunque sus diferencias térmicas rondan 0,49–0,52. Siloli aparece tercero en Jezero y Gale. En ambos la diferencia normalizada de albedo es inferior a 0,07 y la de relieve inferior a 0,10. En la Luna, Ojos del Salado y Socompa se mantienen entre los primeros en más de un sitio por la semejanza del terreno, mientras la diferencia térmica de esos pares supera 0,65.

Los poco estudiados ocupan 17 de los 30 puestos del top 5 general, contando repeticiones entre sitios. El catálogo asigna `known: false` a partir de una búsqueda bibliográfica preliminar; Gilf Kebir pasó a `known: true` porque esa búsqueda en Crossref no indexa los informes técnicos de NASA, donde sí figura. Estos resultados sirven para priorizar la revisión de candidatos. Jaccard sigue como indicador aparte para contrastar procesos documentados. La climatología terrestre es regional y varias coordenadas son aproximadas, incluido el punto usado para Yungay, por lo que la comparación debe verificarse antes de atribuir una similitud a un lugar de campo concreto.

## 7. Limitaciones

- El puntaje es relativo al catálogo y a las variables compartidas. Incorporar registros puede cambiar los rangos y los puntajes de pares ya calculados. Dos pares con la misma puntuación pueden tener distinta cobertura. `n_vars_used` indica cuántas variables contribuyen, y `norm_diff` permite comprobar cuáles.
- La referencia térmica del contrato es la media anual de superficie. Para la Luna se acepta provisionalmente `temp_avg` de Diviner como aproximación cercana a la superficie. Es una media anual modelada a 2 cm de profundidad y esa diferencia puede sesgar la comparación entre cuerpos. En Marte, `tsurf` de MCD v6.2 es una temperatura de superficie modelada, promediada sobre horas locales 0–23 y valores de longitud solar Ls de 0° a 345° cada 15°, sin ponderar la duración de las estaciones. Las temperaturas extremas de las regiones lunares en sombra permanente pueden producir diferencias grandes incluso con los mejores candidatos terrestres.
- La comparación de albedo depende de la banda espectral, la geometría de iluminación y observación, y la definición del producto. La reflectancia en una sola banda no equivale al albedo solar de banda ancha. Los tres sitios lunares tienen `albedo: null`. Sus comparaciones usan como máximo cuatro variables y el albedo solo discrimina en pares con Marte cuando el candidato terrestre tiene ese dato.
- La precipitación representa un aspecto de la aridez. El cero convencional para Luna y Marte no describe hielo, escarcha, vapor ni disponibilidad de agua. El índice tampoco mide directamente la gravedad, el vacío lunar, la atmósfera marciana, la radiación, la iluminación, el regolito, el polvo ni las comunicaciones. Las fichas deben explicar para qué sirve cada analogía y dónde deja de ser válida.

## 8. Fuentes

- Tierra — [Terrain Tiles de Mapzen](https://registry.opendata.aws/terrain-tiles/) y [climatología de NASA POWER](https://power.larc.nasa.gov/docs/services/api/temporal/climatology/) (TS, PRECTOTCORR y ALLSKY_SRF_ALB).
- Luna — [LOLA LDEM_75S_240M](https://pds-geosciences.wustl.edu/lro/lro-l-lola-3-rdr-v1/lrolol_1xxx/data/lola_gdr/polar/img/ldem_75s_240m.img) y [Diviner Polar Resource Product sur](https://pds-geosciences.wustl.edu/lro/urn-nasa-pds-lro_diviner_derived1/data_derived_prp/dlre_prp_south.tab).
- Marte — [MOLA MEGDR de 128 píxeles/grado](https://pds-geosciences.wustl.edu/missions/mgs/megdr.html) y [Mars Climate Database v6.2](https://www-mars.lmd.jussieu.fr/mcd_python/).

## 9. Escaneo global (S-7)

Se descarta el escaneo global en cuadrícula de 2° para esta entrega. Falta una vía de datos validada que cubra tierra firme y obtenga variables comparables sin descargas masivas. El escaneo queda como posible trabajo futuro. Esta entrega publica los rankings del catálogo de 47 candidatos y prescinde de `scan.json`.
