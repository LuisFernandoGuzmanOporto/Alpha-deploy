# Preguntas técnicas del jurado

1. **¿Qué significa el puntaje de similitud?** Es una escala de 0 a 100 que resume la cercanía entre dos lugares en las variables comparables del catálogo. El mapa ayuda a elegir lugares para estudiar procesos o ensayar operaciones. El puntaje no representa una probabilidad de éxito de una misión.

2. **¿Por qué eligieron esas cinco variables?** La pendiente y el relieve describen el terreno. La temperatura y la precipitación aproximan el entorno térmico y la aridez. El albedo describe la fracción de luz reflejada. Las etiquetas respaldadas por fuentes complementan el índice con procesos y rasgos como dunas, hielo o volcanismo.

3. **¿Cómo comparan terrenos medidos con resoluciones distintas?** Usamos ventanas de 10 × 10 km y medimos el relieve local con respecto a la variación dentro de cada ventana. Los datos lunares usan LOLA a 240 m por píxel y los marcianos MOLA a unos 463 m. La malla marciana puede suavizar la pendiente y el relieve. Remuestrearla a una resolución más fina no recuperaría detalle.

4. **¿Las temperaturas y los albedos son directamente comparables?** La referencia térmica es la media anual de superficie. En la Luna usamos provisionalmente la media modelada a 2 cm de Diviner. En Marte usamos la temperatura de superficie modelada por MCD. El albedo marciano describe el suelo desnudo del modelo y su comparación depende de la banda y la geometría de observación. Los tres sitios lunares carecen de albedo en este catálogo.

5. **¿Por qué usan logaritmos y normalización por mínimo y máximo?** Aplicamos `log1p` al relieve y a la precipitación para conservar el cero y reducir la influencia de las colas largas. La normalización conjunta pone las diferencias en una escala de 0 a 1. Los extremos polares lunares pueden comprimir las diferencias térmicas entre otros sitios, y añadir registros puede cambiar la escala del catálogo.

6. **¿Por qué pesan igual las variables y qué pasa si cambian los pesos?** El peso inicial es 1 para cada variable como referencia reproducible. El análisis cambia un peso a la vez en ±50 % y retira cada variable por separado. Compara el desplazamiento en posiciones y la coincidencia del top 5. La estabilidad observada se informa con el catálogo de producción, cuando estén disponibles ambos conjuntos de datos.

7. **¿Cómo manejan los datos faltantes y las coincidencias cualitativas?** Omitimos la variable del promedio cuando falta en uno de los registros y exigimos al menos tres variables compartidas. Mostramos cuántas se usaron para que el lector pueda juzgar la cobertura. Jaccard compara las etiquetas en un indicador separado, con valor nulo cuando falta uno de los conjuntos.

8. **¿Cómo comprueban que el ranking tiene sentido?** Contrastamos las posiciones de los análogos documentados para cada cuerpo según `analog_for`. Si aparecen abajo, revisamos la cobertura, los pesos y la escala antes de interpretar los descubrimientos. Esa comparación con datos reales sigue pendiente mientras falte el catálogo terrestre integrado.

9. **¿Cómo distinguen un candidato poco estudiado de un descubrimiento demostrado?** Usamos el campo `known` respaldado por referencias. Un candidato poco estudiado que entra al top 5 merece revisar las variables que explican su posición y las limitaciones de la comparación. La evidencia de campo o bibliográfica adicional determinaría su utilidad para un ensayo concreto.

10. **¿Dónde deja de ser válida la analogía y para qué sirve aun así?** El índice no reproduce la gravedad reducida, el vacío lunar, la atmósfera marciana ni la radiación. Una similitud en pendientes, por ejemplo, puede orientar la elección de un recorrido para ensayar navegación y maniobras. La tracción, la dinámica del vehículo y la seguridad de la misión requieren evaluaciones propias.

Referencias del proyecto: [metodología](METODOLOGIA.md), [desafío oficial](DESAFIO_OFICIAL.md) y [extracción lunar y marciana](../pipeline/moon_mars/README.md).
