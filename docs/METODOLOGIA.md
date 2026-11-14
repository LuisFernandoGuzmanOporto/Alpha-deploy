# Metodología del índice de similitud

## 1. Objetivo

El índice ordena lugares de la Tierra según su similitud con un sitio candidato de la Luna o Marte en cinco variables de terreno, temperatura, aridez y reflectividad. Cada resultado muestra qué variables se pudieron comparar y cuánto difieren. El ranking orienta la búsqueda de lugares donde estudiar procesos o ensayar operaciones, y se interpreta junto con las fichas, las coincidencias cualitativas y las limitaciones de cada analogía.

## 2. Variables y su razón física

| Variable | Qué mide | Por qué importa | Fuente candidata en la Tierra | Fuente usada en Luna y Marte |
| --- | --- | --- | --- | --- |
| `slope_deg` | Pendiente media del terreno, en grados | Ayuda a comparar la inclinación del terreno para movilidad y emplazamiento. | SRTM u otro modelo digital de elevación con cobertura local | LOLA `LDEM_75S_240M` en la Luna y MOLA MEGDR de 128 píxeles/grado en Marte |
| `relief_m` | Desviación estándar de la elevación en la ventana, en metros | Describe la variación vertical del terreno a escala local. | El mismo modelo de elevación | Los mismos productos de elevación |
| `temp_mean_c` | Temperatura media anual en °C, con una aproximación subsuperficial en la Luna | Compara el entorno térmico medio relevante para equipos y materiales. | NASA POWER, temperatura de superficie | Diviner Polar Resource Product sur, `temp_avg` modelada a 2 cm en la Luna. Mars Climate Database (MCD) v6.2, `tsurf` de superficie modelada en Marte. |
| `precip_mm_year` | Precipitación media anual, en mm/año | Distingue los entornos terrestres por aridez según la precipitación. | NASA POWER, precipitación corregida | Cero por convención del índice, que compara el aporte por lluvia |
| `albedo` | Fracción de radiación solar reflejada por la superficie, de 0 a 1 | Ayuda a comparar cómo interactúa la superficie con la luz solar. | MODIS MCD43A3 | Luna: `null`, sin mapa grillado comparable para las ventanas polares. Marte: `ground_albedo` de MCD v6.2, albedo de suelo desnudo del modelo. |

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

El análisis de sensibilidad (S-3) aún no se ha realizado. Incluye cambios de posición y del top 5 al variar cada peso ±50 % y al omitir variables. El código actual cuenta una variable constante como compartida y le asigna diferencia cero, lo que puede aumentar el puntaje y ayudar a alcanzar el mínimo de tres variables sin aportar capacidad de distinguir candidatos.

La validación y el análisis de descubrimientos (S-6) aún no se han realizado. Evalúan la posición de los análogos conocidos para el cuerpo indicado en `analog_for` y cuántos candidatos poco estudiados aparecen en el top 5 de cada sitio.

## 7. Limitaciones

- El puntaje es relativo al catálogo y a las variables compartidas. Incorporar registros puede cambiar los rangos y los puntajes de pares ya calculados. Dos pares con la misma puntuación pueden tener distinta cobertura. `n_vars_used` indica cuántas variables contribuyen, y `norm_diff` permite comprobar cuáles.
- La referencia térmica del contrato es la media anual de superficie. Para la Luna se acepta provisionalmente `temp_avg` de Diviner como aproximación cercana a la superficie. Es una media anual modelada a 2 cm de profundidad y esa diferencia puede sesgar la comparación entre cuerpos. En Marte, `tsurf` de MCD v6.2 es una temperatura de superficie modelada, promediada sobre horas locales 0–23 y valores de longitud solar Ls de 0° a 345° cada 15°, sin ponderar la duración de las estaciones. Las temperaturas extremas de las regiones lunares en sombra permanente pueden producir diferencias grandes incluso con los mejores candidatos terrestres.
- La comparación de albedo depende de la banda espectral, la geometría de iluminación y observación, y la definición del producto. La reflectancia en una sola banda no equivale al albedo solar de banda ancha. Los tres sitios lunares tienen `albedo: null`. Sus comparaciones usan como máximo cuatro variables y el albedo solo discrimina en pares con Marte cuando el candidato terrestre tiene ese dato.
- La precipitación representa un aspecto de la aridez. El cero convencional para Luna y Marte no describe hielo, escarcha, vapor ni disponibilidad de agua. El índice tampoco mide directamente la gravedad, el vacío lunar, la atmósfera marciana, la radiación, la iluminación, el regolito, el polvo ni las comunicaciones. Las fichas deben explicar para qué sirve cada analogía y dónde deja de ser válida.

## 8. Fuentes

- Tierra (fuentes candidatas) — [SRTM, NASA Earthdata](https://doi.org/10.5067/MEaSUREs/SRTM/SRTMGL1.003), [variables meteorológicas y de superficie de NASA POWER](https://power.larc.nasa.gov/docs/methodology/data/sources_hydrology/), [precipitación corregida de NASA POWER](https://power.larc.nasa.gov/docs/methodology/data/sources_validation/), [MODIS MCD43A3 de NASA](https://ladsweb.modaps.eosdis.nasa.gov/missions-and-measurements/products/MCD43A3).
- Luna — [LOLA LDEM_75S_240M](https://pds-geosciences.wustl.edu/lro/lro-l-lola-3-rdr-v1/lrolol_1xxx/data/lola_gdr/polar/img/ldem_75s_240m.img) y [Diviner Polar Resource Product sur](https://pds-geosciences.wustl.edu/lro/urn-nasa-pds-lro_diviner_derived1/data_derived_prp/dlre_prp_south.tab).
- Marte — [MOLA MEGDR de 128 píxeles/grado](https://pds-geosciences.wustl.edu/missions/mgs/megdr.html) y [Mars Climate Database v6.2](https://www-mars.lmd.jussieu.fr/mcd_python/).
