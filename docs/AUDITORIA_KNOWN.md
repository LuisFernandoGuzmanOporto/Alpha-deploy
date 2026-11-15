# Auditoría de `known` (fase final, tarea 1a)

Fecha: sábado 14/11/2026, de 23:30 a 00:30 (hora de Bolivia). Revisa los 25 lugares que figuraban como `known: false`.

**Criterio** (`prompts/fase-final.md`): `known: true` solo si una publicación presenta **ese lugar** (o su sitio concreto) como análogo planetario **de la Luna o de Marte**, citable con DOI, informe de NTRS o enlace estable. Un análogo "de la región" cuenta solo si nombra el lugar. Los análogos de Titán no cuentan.

**Búsquedas hechas para cada lugar**
1. **OpenAlex:** cinco consultas con el nombre entre comillas más "Mars", "analog", "analogue", "lunar" y "planetary". Se filtran los trabajos cuyo título o resumen nombra el lugar y un término planetario.
2. **Crossref:** dos consultas ("<lugar> Mars analog" y "<lugar> planetary analogue"), con el mismo filtro.
3. **NTRS de NASA:** búsqueda del nombre exacto.
4. **Segunda pasada** con nombres alternativos (por ejemplo "Jeju lava tube", "Chott el Jerid", "Ahaggar", "Taklimakan", "Sud Lipez") en Crossref y NTRS. **OpenAlex no se pudo usar en esta pasada**: se agotó su cuota diaria gratuita (compartida por la red) y no se registró una clave.
5. **Búsqueda web** dirigida en los casos con pistas, y lectura del resumen o del texto en la fuente primaria antes de decidir.

El script de búsqueda es una primera criba; ninguna decisión se tomó solo con él.

## Resultado

**6 pasan a `known: true`; 19 siguen `known: false`.** Ahora el catálogo tiene 28 conocidos y 19 poco estudiados (antes, 22 y 25).

| Lugar | Fuentes encontradas (DOI o id) | Decisión | Motivo |
| --- | --- | --- | --- |
| Laguna Verde (Bolivia) | NTRS 20030111008 (Cabrol et al., LPSC 2003); doi:10.1029/2008jg000818 (High-Lakes Project, JGR 2009); página de NASA Astrobiology sobre el High Lakes Project (2008) | **true** (Marte) | El resumen de 2003 nombra "Laguna Blanca and Laguna Verde", al pie del Licancabur, estudiadas con los mismos experimentos que el lago de la cumbre como análogo de paleolagos marcianos. **Cuidado**: varios resultados (EPSC 2021-452, 2022-343, Icarus 2022) hablan de **otra** Laguna Verde, en Chile y Argentina, junto a Ojos del Salado; no se usaron |
| Rub' al Khali | doi:10.1371/journal.pone.0150342 (McKay et al., PLOS ONE 2016); NTRS 20160012254 | **true** (Marte) | El título de NTRS dice "…in the Rub' Alkhali (the Empty Quarter), UAE: an Analog for Habitats on Present Mars". El estudio es en Liwa (Emiratos); nuestro punto está en la parte saudí del mismo desierto |
| Lava Beds (California) | doi:10.1029/2021je007140 (Bell et al., JGR Planets 2022); doi:10.1089/ast.2020.2327 (O'Connor et al., Astrobiology 2021); doi:10.1130/abs/2024am-403115 (GSA 2024) | **true** (Luna y Marte) | Tubos del monumento como "analog for lunar lava tube exploration" y cuevas de hielo como "high-fidelity Mars analogue environment" |
| El Malpaís (Nuevo México) | doi:10.58799/nmms-1989.105 (Carleton, New Mexico Mineral Symposium 1989, ya citado en su ficha) | **true** (Luna) | El resumen dice que Hatheway y Herring (1970) eligieron El Malpaís como análogo terrestre de los surcos (rilles) lunares. No se encontró el artículo de 1970 con DOI; se cita a través del resumen de 1989 |
| Kati Thanda–lago Eyre | NTRS 19890016966 ("Microbial mats in playa lakes and other saline habitats: Early Mars analog?", 1989) | **true** (Marte), **dudoso** | Nombra "the Lake Eyre basin" como ejemplo de playa moderna para buscar esteras microbianas en paleolagos del Marte primitivo. Es una ponencia de 1989 y no encontramos estudios de campo recientes; la ficha lo dice |
| Tubos de lava de Undara | doi:10.5194/epsc2022-1003 (Tomasi et al., EPSC 2022) | **true** (Luna y Marte), **dudoso** | El resumen sobre tubos de lava como análogos planetarios compara "Earth (Undara system, Australia), Mars (Arsia Mons region) and the Moon". Solo aparece como ejemplo; la ficha lo dice |
| Volcán Socompa | doi:10.1128/aem.01469-08 (Costello et al. 2009) | false, **dudoso** | El resumen describe las comunidades de fumarolas sin mencionar Marte ni análogos. Las declaraciones de prensa de una astrobióloga no cuentan como publicación |
| Volcán Uturuncu | doi:10.5194/epsc2022-276 y doi:10.3390/rs14092081 (Altiplano-Puna) | false | Ambos tratan el complejo volcánico Altiplano-Puna como análogo de Marte, pero no nombran el Uturuncu (el primero se centra en el desierto de Atacama; el segundo, en el norte de Chile) |
| Tubo de lava Manjanggul (Jeju) | IAC-23 "Lava Tube-based Lunar/Mars Analog Station in Jeju Island" (Moon et al.) | false, **dudoso** | Propone una estación análoga en los tubos de lava de Jeju sin nombrar Manjanggul en lo que se pudo leer (no hay resumen público) |
| Mar de arena del Namib | Varios trabajos de 2014-2018 | false | Lo documentan como análogo de **Titán** (Belet Sand Sea), no de la Luna ni de Marte |
| Salar de Etosha | Varios trabajos de 2008-2011 | false | Análogo de los lagos de **Titán** (Ontario Lacus), no de la Luna ni de Marte |
| Desierto de Badain Jaran | doi:10.2307/3515349 (microbialitas, 1998) | false | Trabajos de geomorfología y microbialitas sin encuadre planetario |
| Desierto de Tengger | — | false | Los resultados son de geología y clima; un "Tengger" de NTRS es la caldera de Java, otro lugar |
| Laguna Colorada | — | false | Sin resultados planetarios; el High Lakes Project nombra Laguna Blanca y Laguna Verde, no Laguna Colorada |
| Nevado Sajama | — | false | Sin resultados planetarios |
| Torotoro (cueva de Umajalanta) | — | false | Sin resultados planetarios |
| Desierto de Siloli (Árbol de Piedra) | — | false | Sin resultados planetarios |
| Volcán Tunupa | — | false | Sin resultados planetarios |
| Campo volcánico Harrat Khaybar | — | false | Sin resultados planetarios |
| Chott el Djerid | — | false | Sin resultados planetarios (también con "Chott el Jerid") |
| Gran Desierto Salado (Dasht-e Kavir) | — | false | Sin resultados planetarios |
| Macizo del Hoggar (Ahaggar) | — | false | Sin resultados planetarios (también con "Ahaggar") |
| Desierto de Taklamakan | — | false | Sin resultados planetarios (también con "Taklimakan") |
| Desierto frío de altura del Pamir | — | false | Sin resultados planetarios |
| Salar de Arizaro | — | false | Sin resultados planetarios |

"Sin resultados planetarios" significa que ninguna de las búsquedas devolvió un trabajo que nombrara el lugar junto a Marte, la Luna o un término de análogo. No prueba que no exista: falta una revisión bibliográfica completa, con bases de pago y literatura en otros idiomas.

## Coordenadas verificadas (tarea 1b)

| Lugar | Antes | Ahora | Fuente |
| --- | --- | --- | --- |
| Núcleo hiperárido del Atacama (Yungay) | −24,5; −69,25 (centro del desierto) | −24,0846; −69,9153 | Pozo de muestreo de Yungay (24°5′4.52″ S, 69°54′55.11″ O), Azua-Bustos et al. 2020, Scientific Reports, doi:10.1038/s41598-020-76302-z |
| Mauna Kea | 19,8206; −155,4681 (cumbre) | 19,7609; −155,4707 | Sitio de prueba Pu'u Hiwahine (19°45′39.29″ N, 155°28′14.56″ O, ~2783 m), ten Kate et al., NASA NTRS 20110008363 y LPSC 2011 n.º 2810 |
| Río Tinto | 37,70; −6,55 (aproximada) | 37,6833; −6,5833 | Minas de Riotinto (37°41′ N, 6°35′ O), Wikipedia; el punto anterior estaba a unos 3 km |

## Qué cambió en el ranking

- **Marte:** el Atacama (Yungay), análogo conocido, pasa a ser el **1.º en Jezero (82,1) y Gale (83,8)**, por delante de Gilf Kebir. Antes era 1.º Gilf Kebir (80,8 y 83,2).
- **Luna:** los Valles Secos de McMurdo pasan a ser el **1.º también en Faustini Rim A (62,7)**: el Atacama, con su punto real (más llano), baja al 8.º.
- **Validación (S-6):** en Marte hay ahora 3 conocidos en el top 5 de Jezero y de Gale (antes, 2). En la Luna sigue sin haber conocidos del cuerpo en el top 5. Los poco estudiados en el top 5 general pasan de 12 a 11 de 30.

Cifras calculadas con `pipeline/tools/validation_summary.py` y `pipeline/tools/ficha_rank_claims.py`.
