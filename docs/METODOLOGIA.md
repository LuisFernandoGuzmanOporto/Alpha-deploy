# Metodología del índice de similitud

## 1. Objetivo

El índice ordena lugares de la Tierra según su similitud con un sitio candidato de la Luna o Marte en cinco variables de terreno, temperatura, aridez y reflectividad. Cada resultado muestra qué variables se pudieron comparar y cuánto difieren. El ranking orienta la búsqueda de lugares donde estudiar procesos o ensayar operaciones, y se interpreta junto con las fichas, las coincidencias cualitativas y las limitaciones de cada analogía.

## 2. Variables y su razón física

| Variable | Qué mide | Por qué importa | Fuente candidata en la Tierra | Fuente candidata en Luna y Marte |
| --- | --- | --- | --- | --- |
| `slope_deg` | Pendiente media del terreno, en grados | Ayuda a comparar la inclinación del terreno para movilidad y emplazamiento. | SRTM u otro modelo digital de elevación con cobertura local | LOLA en la Luna y MOLA en Marte |
| `relief_m` | Desviación estándar de la elevación en la ventana, en metros | Describe la variación vertical del terreno a escala local. | El mismo modelo de elevación | Los mismos productos de elevación |
| `temp_mean_c` | Temperatura media anual de la superficie, en °C | Compara el entorno térmico medio relevante para equipos y materiales. | NASA POWER, temperatura de superficie | Diviner en la Luna y observaciones térmicas TES en Marte, si permiten estimar la media comparable |
| `precip_mm_year` | Precipitación media anual, en mm/año | Distingue los entornos terrestres por aridez según la precipitación. | NASA POWER, precipitación corregida | Cero por convención del índice, que compara el aporte por lluvia |
| `albedo` | Fracción de radiación solar reflejada por la superficie, de 0 a 1 | Ayuda a comparar cómo interactúa la superficie con la luz solar. | MODIS MCD43A3 | Radiometría LOLA como fuente lunar candidata, sujeta a comparabilidad espectral. Mapa de albedo bolométrico TES en Marte. |

Cada valor no nulo requiere una fuente en `sources` con el producto y su referencia. En `notes` se documenta el sistema de coordenadas extraterrestre, el método de extracción y, cuando corresponda, la resolución, el período o el motivo de un dato faltante. Un valor cuya cobertura o definición impida compararlo se registra como `null`.

## 3. Escala común

Para pendiente y relieve, la referencia inicial es una ventana de 10 × 10 km centrada en el sitio y una malla de unos 250 m por píxel. Se remuestrea el modelo de elevación a esa malla en una proyección local en metros. Con los píxeles válidos se obtiene la media de la pendiente y, por separado, la desviación estándar de la elevación. Se conserva la resolución efectiva del producto como parte de la procedencia, pues el remuestreo por sí solo no recupera detalle. Las elevaciones absolutas dependen de niveles de referencia distintos en cada cuerpo.

Las variables térmicas y radiométricas pueden provenir de productos con huellas mayores que la ventana o con cobertura temporal desigual. Se registra el área efectiva y el período representado. La comparabilidad de 10 × 10 km a 250 m depende de la resolución y la cobertura de los datos que entreguen los responsables.

## 4. Fórmula

1. Aplicamos el logaritmo natural de `1 + x` a `relief_m` y `precip_mm_year`, con los valores en sus unidades pactadas. Esto conserva el cero y reduce la influencia de diferencias grandes en las colas. Las demás variables conservan sus unidades antes de normalizarlas por mínimo y máximo.

   - `slope_deg` mide un ángulo respecto a la horizontal. Una diferencia de 5° representa la misma separación angular en cualquier parte del rango. El índice compara esa geometría y la movilidad real depende también del vehículo, la tracción y la gravedad. [Definición de pendiente, USGS](https://www.usgs.gov/educational-resources/determine-percent-slope-and-angle-slope).
   - `temp_mean_c` compara diferencias de temperatura de superficie. Una diferencia de 10 °C equivale a 10 K en todo el rango. El cálculo lineal da la misma diferencia al expresar los datos en kelvin, porque el desplazamiento del cero se cancela al restar. [Intervalos de temperatura, NIST](https://physics.nist.gov/cuu/Units/register2.html).
   - `albedo` ya es una fracción acotada entre 0 y 1. Bajo definiciones y condiciones comparables, una diferencia de 0,05 equivale a cinco puntos porcentuales de la radiación incidente reflejada, cualquiera sea el albedo de partida. [Albedo superficial, NASA](https://power.larc.nasa.gov/docs/methodology/data/derived/derived-parameters/).
2. Para cada variable calculamos el mínimo y el máximo de los valores disponibles en todo el catálogo, incluidos sitios y candidatos, después de la transformación. Normalizamos mediante `(valor − mínimo) / (máximo − mínimo)`. Si el rango es cero, el código devuelve cero para todos los valores presentes. Si falta el dato, se omite.
3. Para cada par, calculamos la diferencia absoluta entre los valores normalizados de las variables disponibles en ambos registros. El par entra al ranking con al menos tres variables compartidas.
4. La distancia es la suma de las diferencias multiplicadas por sus pesos, dividida por la suma de los pesos de las variables compartidas. El puntaje es `100 × (1 − distancia)` y se exporta redondeado a un decimal. También se exportan `n_vars_used` y `norm_diff` (a cuatro decimales). El ranking ordena por puntaje redondeado y, en caso de empate, conserva el orden de entrada.
5. Las coincidencias cualitativas se muestran junto al puntaje. Si ambos sitios tienen etiquetas documentadas, `tag_overlap` informa el índice de Jaccard, que divide el número de etiquetas compartidas por el número total de etiquetas distintas del par. Si a uno le faltan etiquetas, devuelve `null`.

## 5. Pesos

Cada variable empieza con peso 1. Es una referencia reproducible mientras se evalúa la sensibilidad del ranking y no hay una calibración por objetivo de misión. Dos variables de terreno pueden sumar influencia si están correlacionadas. La disponibilidad también cambia el peso efectivo, dado que el promedio solo incluye las variables compartidas. Mantener las etiquetas fuera del puntaje evita darle el mismo significado a una diferencia medida y a una diferencia en la documentación disponible.

## 6. Sensibilidad y validación

La referencia inicial es mínimo–máximo sobre el catálogo conjunto. Una temperatura lunar extrema ensancha el rango y reduce la separación térmica entre los demás registros. Con datos reales, compararemos esa escala con una variante robusta basada en cuantiles, registrando cuántos valores quedarían recortados y si cambian las posiciones. Con pocas observaciones, los cuantiles son inestables y el recorte puede ocultar diferencias relevantes en los polos.

Mediremos el cambio de posiciones y del top 5 al variar cada peso ±50 % y al omitir cada variable. Revisaremos por separado el efecto de cobertura y de rangos constantes. El código actual cuenta una variable constante como compartida y le asigna diferencia cero, lo que puede aumentar el puntaje y ayudar a alcanzar el mínimo de tres variables sin aportar capacidad de distinguir candidatos.

Contrastaremos las posiciones de análogos conocidos para el cuerpo indicado en `analog_for` y examinaremos qué variables explican sus posiciones. Para cada sitio, contaremos cuántos candidatos poco estudiados entran al top 5 y revisaremos qué sostiene el parecido. Las posiciones y los resultados de estas comprobaciones quedan pendientes hasta contar con datos de producción.

## 7. Limitaciones

- El puntaje es relativo al catálogo y a las variables compartidas. Incorporar registros puede cambiar los rangos y los puntajes de pares ya calculados. Dos pares con la misma puntuación pueden tener distinta cobertura. `n_vars_used` indica cuántas variables contribuyen, y `norm_diff` permite comprobar cuáles.
- La media térmica requiere temperatura de superficie y un muestreo que represente el ciclo diario y estacional de cada cuerpo. Una observación a una única hora local o un mínimo polar no estima esa media. Las temperaturas extremas de las regiones lunares en sombra permanente pueden producir diferencias grandes incluso con los mejores candidatos terrestres.
- La comparación de albedo depende de la banda espectral, la geometría de iluminación y observación, y la definición del producto. La reflectancia en una sola banda no equivale al albedo solar de banda ancha.
- La precipitación representa un aspecto de la aridez. El cero convencional para Luna y Marte no describe hielo, escarcha, vapor ni disponibilidad de agua. El índice tampoco mide directamente la gravedad, el vacío lunar, la atmósfera marciana, la radiación, la iluminación, el regolito, el polvo ni las comunicaciones. Las fichas deben explicar para qué sirve cada analogía y dónde deja de ser válida.

## 8. Fuentes candidatas

- Tierra — [SRTM, NASA Earthdata](https://doi.org/10.5067/MEaSUREs/SRTM/SRTMGL1.003), [variables meteorológicas y de superficie de NASA POWER](https://power.larc.nasa.gov/docs/methodology/data/sources_hydrology/), [precipitación corregida de NASA POWER](https://power.larc.nasa.gov/docs/methodology/data/sources_validation/), [MODIS MCD43A3 de NASA](https://ladsweb.modaps.eosdis.nasa.gov/missions-and-measurements/products/MCD43A3).
- Luna — [topografía LOLA](https://pds-geosciences.wustl.edu/missions/lro/lola.htm), [observaciones térmicas Diviner](https://pds-geosciences.wustl.edu/missions/lro/diviner.htm), [radiometría LOLA](https://doi.org/10.17189/1520639).
- Marte — [topografía MOLA](https://pds-geosciences.wustl.edu/missions/mgs/mola.html), [observaciones TES](https://pds-geosciences.wustl.edu/missions/mgs/tes.html), [mapa de albedo bolométrico TES](https://pds-geosciences.wustl.edu/missions/mgs/tesspecial.html).
