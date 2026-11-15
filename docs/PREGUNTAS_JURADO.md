# Preguntas técnicas del jurado

1. **¿Qué significa el puntaje de similitud?** Es una escala de 0 a 100 que resume la cercanía entre dos lugares en las variables comparables del catálogo. El mapa ayuda a elegir lugares para estudiar procesos o ensayar operaciones. El puntaje no representa una probabilidad de éxito de una misión.

2. **¿Por qué eligieron esas cinco variables?** La pendiente y el relieve describen el terreno. La temperatura y la precipitación aproximan el entorno térmico y la aridez. El albedo describe la fracción de luz reflejada. Las etiquetas respaldadas por fuentes complementan el índice con procesos y rasgos como dunas, hielo o volcanismo.

3. **¿Cómo comparan terrenos medidos con resoluciones distintas?** La pendiente y el relieve se calculan en ventanas de 10 × 10 km. En la Tierra usamos una malla de 250 m (Terrain Tiles y, en cuatro lugares donde esa fuente no sirve, el modelo Copernicus de 30 m muestreado a 250 m), en la Luna LOLA a 240 m y en Marte MOLA a unos 463 m. La malla marciana puede suavizar la pendiente y el relieve. Remuestrear a una malla más fina no recupera detalle.

4. **¿Las temperaturas y los albedos son directamente comparables?** La referencia térmica es la media anual de superficie. En la Luna usamos provisionalmente la media modelada a 2 cm de Diviner. En Marte usamos la temperatura de superficie modelada por MCD. El albedo marciano describe el suelo desnudo del modelo y su comparación depende de la banda y la geometría de observación. Los tres sitios lunares carecen de albedo en este catálogo.

5. **¿Por qué usan logaritmos y normalización por mínimo y máximo?** Aplicamos `log1p` al relieve y a la precipitación para conservar el cero y reducir la influencia de las colas largas. La normalización conjunta pone las diferencias en una escala de 0 a 1. Los extremos polares lunares pueden comprimir las diferencias térmicas entre otros sitios, y añadir registros puede cambiar la escala del catálogo.

6. **¿Por qué pesan igual las variables y qué pasa si cambian los pesos?** El peso 1 para cada variable da una referencia reproducible. Con 47 candidatos, seis sitios y 282 comparaciones en el ranking base, el top 5 conservó al menos cuatro candidatos en 58 de 60 cambios de un peso en ±50 % y en 19 de 30 pruebas que retiraron una variable.

7. **¿Cómo manejan los datos faltantes y las coincidencias cualitativas?** Omitimos la variable del promedio cuando falta en uno de los registros y exigimos al menos tres variables compartidas. Mostramos cuántas se usaron para que el lector pueda juzgar la cobertura. Jaccard compara las etiquetas en un indicador separado, con valor nulo cuando falta uno de los conjuntos.

8. **¿Cómo comprueban que el ranking tiene sentido?** Usamos `analog_for` para evaluar los análogos documentados por cuerpo. El núcleo hiperárido del Atacama (Yungay), Gilf Kebir y Tibesti ocupan los tres primeros puestos en Jezero y Gale, y Gilf Kebir, Qaidam y Coipasa ocuparon los puestos segundo, cuarto y quinto en Arcadia. Ninguno de los siete conocidos lunares entró en el top 5 lunar: Mauna Kea quedó entre el 12.º y el 17.º, Pinacate entre el 15.º y el 17.º, La Corona 20.º, Askja 27.º, Lava Beds 28.º, El Malpaís 33.º y Undara 39.º. Las diferencias térmicas y de precipitación, y la ausencia de procesos como el vulcanismo en el puntaje, limitan la validación lunar.

9. **¿Cómo distinguen un candidato poco estudiado de un descubrimiento demostrado?** Los candidatos marcados como poco estudiados ocuparon 9 de los 30 puestos del top 5 general, contando repeticiones entre sitios. Esa clasificación procede de una búsqueda bibliográfica preliminar, revisada en la fase final (`AUDITORIA_KNOWN.md`): siete lugares pasaron a conocidos. Los resultados priorizan candidatos para revisión bibliográfica y de campo, incluida la evaluación de su utilidad para un ensayo concreto.

10. **¿Dónde deja de ser válida la analogía y para qué sirve aun así?** El índice no reproduce la gravedad reducida, el vacío lunar, la atmósfera marciana ni la radiación. Una similitud en pendientes, por ejemplo, puede orientar la elección de un recorrido para ensayar navegación y maniobras. La tracción, la dinámica del vehículo y la seguridad de la misión requieren evaluaciones propias.

Referencias del proyecto: [metodología](METODOLOGIA.md), [desafío oficial](DESAFIO_OFICIAL.md) y [extracción lunar y marciana](../pipeline/moon_mars/README.md).
