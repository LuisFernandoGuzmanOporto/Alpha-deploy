# Pitch, demo y video

Dueño: Joel. Reglas en `docs/REQUISITOS.md`. Las respuestas técnicas para las preguntas del jurado están en `docs/PREGUNTAS_JURADO.md` (Sebastián).

**Reglas que no se negocian:**
- **Solo se afirma lo que la web ya hace en producción.** Si una función no llega a `main`, se quita del guion.
- Las cifras salen de los resultados reales (`docs/INFORME.md`) y se contrastaron con `web/public/data/results.json` de `main` el 14/11/2026 (6 sitios y 56 candidatos). Si cambian los datos, se actualizan antes de presentar. Lo que aún no se sabe queda como `[PENDIENTE: …]`; nunca se inventa.
- La demo oficial va **en inglés**: diapositivas en inglés, o video con subtítulos en inglés.

## 1. Qué entregamos y cuándo

| Pieza | Para quién | Formato | Límite | Idioma |
| --- | --- | --- | --- | --- |
| Demo oficial ("Link to Project Demo") | Jueces locales y globales | 7 diapositivas **o** video | 7 diapositivas (incluidas título e introducción) o 30 s; pasarse descalifica para el juicio global | Inglés (video: se puede hablar en español con subtítulos en inglés) |
| Presentación en la sede | Jurado local, domingo 14:30 | En vivo: diapositivas y demo de la web | A confirmar con la sede (este guion es de 5 min y se puede recortar a 3) | A confirmar; el guion está en español |
| Video de respaldo (plan B) | Presentación local si falla la demo en vivo | Grabación de pantalla de la web | Lo que dure el bloque de demo (unos 90 s) | Español con subtítulos en inglés |

**Recomendación:** la demo oficial con **7 diapositivas en inglés**. Se ajusta con texto y capturas hasta el último momento, no exige grabar en buena calidad y sirve de base para la presentación en vivo. El video de 30 s se hace igual si queda tiempo (J-5): contará para "Presentation", pero con uno solo de los dos ya se cumple el requisito.

## 2. Mensaje central

> **EN:** We don't look for places on Earth that *look* like the Moon or Mars. We measure them. For each candidate landing site we rank Earth locations by how similar they are, and we show where each analogy breaks down.
>
> **ES:** No buscamos lugares de la Tierra que *se parezcan* a la Luna o a Marte: los medimos. Para cada sitio candidato ordenamos los lugares de la Tierra por cuánto se parecen y mostramos dónde falla cada analogía.

Los verbos del reto que hay que decir en voz alta: **identify**, **characterize**, **what makes it analogous**, **where the analogy breaks down**, **how it helps exploration**.

## 3. Demo oficial: 7 diapositivas (inglés)

Una idea por diapositiva, poco texto y una imagen fuerte en cada una.

| # | Title | Content on the slide | Visual |
| --- | --- | --- | --- |
| 1 | **Earth Analogs** | Tagline: *"Measuring which places on Earth resemble the Moon and Mars, and where they don't."* Team name, the six members' names, "Presented by Lian Demian Linares Gutierrez and Noelia Lolita Gonzales Jaldin", challenge: *Identify Earth Locations that Analog the Permanent Moon Base Locations and Mars*. Space Apps 2026, Cochabamba, Bolivia | Captura del globo 3D con un sitio lunar marcado |
| 2 | **The problem** | Earth analogs such as Atacama, Haughton Crater or Death Valley are "not entirely well characterized" (challenge statement). No place on Earth matches the Moon or Mars in everything. Mission teams need to know *what* an analog is good for, and *where it fails*. | Dos fotos: un sitio lunar (mosaico LROC) y un desierto terrestre |
| 3 | **Our solution** | Pick a Moon or Mars site and get a ranked map of Earth analogs, a 0–100 similarity score, a side-by-side comparison and an explicit *"where the analogy breaks down"* panel. | Captura de la pantalla principal: mapa y ranking |
| 4 | **How the index works** | 5 variables derived from NASA data and models in a common 10 × 10 km window: slope, relief, mean temperature, aridity, albedo. Normalized differences, weighted mean, score = 100 × (1 − distance). Geology, ice and dust tags compared separately. Every value cites its source; missing data stays empty, never guessed. | Captura del comparador: tabla y radar |
| 5 | **NASA data at the core** | Moon: LRO LOLA (terrain) and LRO Diviner (temperature). Mars: MGS MOLA (terrain) and Mars Climate Database (LMD, ESA, CNES). Earth: NASA POWER (surface temperature, precipitation and CERES albedo) and elevation tiles on AWS (SRTM and other models). Globe: NASA GIBS, Moon Trek, Mars Trek. | Logos de misión **no** (no se pueden usar); usar mapas de los datos |
| 6 | **What we found** | **Moon:** the McMurdo Dry Valleys, already a documented Mars analog, rank 1st for all three lunar sites (72.1 at Peak Near Cabeus B, 72.3 at Malapert Massif, 62.7 at Faustini Rim A); Licancabur Volcano is 2nd at all three, then Ollagüe Volcano (3rd at all three, a less-studied place), Ojos del Salado (4th) and Socompa (5th) at Cabeus and Malapert\*. **Mars:** the hyper-arid core of the Atacama Desert (Yungay), a documented Mars analog, ranks 1st for Jezero (82.1) and Gale (83.8), ahead of the Gilf Kebir plateau, which a 1982 NASA report already compared with Mars: the index puts documented analogs on top. **Bolivia:** in the top 5 of all six sites; less-studied places such as Ollagüe Volcano (3rd at all three lunar sites) and the Siloli Desert (4th for Jezero, 5th for Gale). **Where it fails:** the coldest Earth candidate averages −27 °C, the lunar sites −126 to −160 °C. <br>\* *Temperature and precipitation for mountain and volcano candidates come from a coarse regional grid and are biased; the lunar ranking of these places rests mainly on slope and relief.* | Captura de la vista de descubrimientos |
| 7 | **Why it matters and what's next** | Helps choose where to test rovers, instruments and operations on Earth, and makes each analog's limits explicit (gravity, vacuum, thin atmosphere, radiation). Less-studied Bolivian places (Siloli, Laguna Colorada, Uturuncu) as analog candidates. Next: more Earth candidates, a finer global scan, field validation. | Mapa con los análogos de Bolivia |

**Antes de subirlas:**
- [x] Revisar ortografía en inglés. Hecho el 15/11 sobre `docs/demo/slides.html` (dos retoques: "the Atacama Desert" y "for mountain candidates") y sobre los textos nuevos de la web.
- [x] Diapositiva 6: decir que la temperatura de Licancabur, Ojos del Salado y Socompa viene de una malla regional gruesa y está sesgada, y que su posición se apoya en pendiente y relieve (issue #36).
- [x] No presentar Uyuni, Coipasa ni Licancabur como "descubrimientos": ya están documentados como análogos de Marte. Revisado: la diapositiva 6 y el bloque de hallazgos presentan a Licancabur como análogo ya documentado.
- [ ] Ninguna persona menor de 18 años en las imágenes.
- [ ] Ningún logo de NASA.
- [ ] Subir a Google Drive con acceso "cualquiera con el enlace". El PDF de 7 diapositivas ya está generado en `docs/demo/earth-analogs-demo.pdf` (ver `docs/demo/README.md`); la diapositiva 1 ya dice quiénes exponen (Lian Demian Linares Gutierrez y Noelia Lolita Gonzales Jaldin). Falta subirlo o enlazarlo.
- [ ] Probar el enlace en una ventana privada.

## 4. Video de 30 segundos (opcional, inglés)

Sigue la estructura que recomienda la guía oficial. Locución en inglés; si se graba en español, van subtítulos en inglés.

| Tiempo | Locución (EN) | Toma |
| --- | --- | --- |
| 0:00–0:02 | "We're team [NOMBRE], from Cochabamba, Bolivia." | Logo del proyecto o el equipo (todos mayores de 18) |
| 0:02–0:05 | "Where on Earth should we rehearse a Moon base or a Mars landing?" | Globo 3D girando sobre el polo sur lunar |
| 0:05–0:10 | "Earth Analogs measures which Earth places resemble each landing site, and where they don't." | Título y lema sobre la pantalla principal |
| 0:10–0:20 | "Pick a site, get a ranked map of Earth analogs, a similarity score built from NASA data, and an honest view of where each analogy breaks down." | Grabación: elegir sitio, el mapa se llena, clic en un análogo, comparador con "Dónde falla" |
| 0:20–0:30 | "From Bolivia's Siloli Desert to Egypt's Gilf Kebir plateau, we help mission teams choose where to test before they fly." | Filtro de Bolivia y luego el globo de la Tierra con los análogos numerados |

**Comprobar:** que dure 30 s o menos (medir el archivo final), que los subtítulos estén incrustados, que esté subido a YouTube como "no listado" o a Drive público, y que el enlace se haya probado en una ventana privada.

## 5. Presentación en la sede (5 minutos, español)

Bloques con tiempo; si la sede da 3 minutos, se recorta lo marcado como *recortable*.

| Bloque | Tiempo | Quién | Qué decir |
| --- | --- | --- | --- |
| Apertura | 0:00–0:30 | Lian Demian Linares Gutierrez | El problema: el propio reto dice que los análogos conocidos no están del todo bien caracterizados; ningún lugar es perfecto y hay que saber para qué sirve cada uno y dónde falla. |
| Solución | 0:30–1:00 | Lian Demian Linares Gutierrez | Qué es Earth Analogs, en una frase (sección 2). |
| Demo en vivo | 1:00–2:30 | Lian Demian Linares Gutierrez (maneja la laptop y lo va narrando) | Elegir **Malapert Massif** → mapa y ranking → clic en un análogo → comparador: la tabla, el radar y **"Dónde falla la analogía"** → volver y activar **"Solo Bolivia"** → abrir el **globo 3D**. Si falla, se pasa al video de respaldo. |
| Cómo funciona | 2:30–3:15 | Noelia Lolita Gonzales Jaldin | Cinco variables, ventana común, normalización y puntaje; cada valor con su fuente y sin datos inventados. *Recortable: dejar solo una frase.* |
| Hallazgos | 3:15–4:15 | Noelia Lolita Gonzales Jaldin | **Luna:** los Valles Secos de McMurdo, ya documentados como análogo de Marte, son los primeros en los tres sitios lunares (72,1 en Peak Near Cabeus B, 72,3 en Malapert y 62,7 en Faustini); el Licancabur es el segundo en los tres, seguido del volcán Ollagüe (3.º en los tres, poco estudiado), Ojos del Salado (4.º) y Socompa (5.º) en Cabeus y Malapert. **Aviso obligatorio:** su temperatura y lluvia vienen de una grilla regional gruesa y están sesgadas, así que su puesto se apoya sobre todo en pendiente y relieve (#36). **Marte:** el núcleo hiperárido del Atacama (Yungay), análogo documentado de Marte, es el primero para Jezero (82,1) y Gale (83,8), por delante de la meseta de Gilf Kebir, que un informe de NASA de 1982 ya comparó con Marte: el índice pone arriba a análogos documentados. **Bolivia:** aparece en el top 5 de los seis sitios, con lugares poco estudiados como el volcán Ollagüe (3.º en los tres sitios lunares) y el desierto de Siloli (4.º para Jezero, 5.º para Gale). **Dónde falla:** el lugar más frío del catálogo promedia −27 °C y los sitios lunares, de −126 a −160 °C; ningún lugar de la Tierra llega a ese frío. Ser honestos con la validación: los siete análogos lunares conocidos quedan entre el 16.º y el 46.º de 56. |
| Límites e impacto | 4:15–5:00 | Noelia Lolita Gonzales Jaldin | Gravedad, vacío, atmósfera y radiación no se reproducen; el valor está en saber qué se puede ensayar en cada lugar. Cierre con el mensaje central. |

Exponen **Lian Demian Linares Gutierrez** y **Noelia Lolita Gonzales Jaldin**, repartidas a partes iguales (2:30 cada una). Fernando, Dante, Sebastián y Joel quedan para las preguntas del jurado, con las respuestas de `docs/PREGUNTAS_JURADO.md`.

**Recorrido de la demo en vivo (probarlo antes):**
1. Abrir https://earth-analogs-coral.vercel.app en una pestaña ya cargada.
2. En la portada, pulsar **"Explorar análogos"** (baja al mapa). Selector: Malapert Massif.
3. Clic en el primer análogo y luego "Ver comparación".
4. Bajar hasta "Dónde falla la analogía" y el panel de limitaciones.
5. "Volver al ranking" y activar "Solo Bolivia".
6. "Míralo en el globo 3D" (al bajar en la pantalla Explorar): aparece la Luna con el sitio marcado; cambiar a la pestaña Tierra, donde las líneas unen el sitio con sus cinco análogos, y tocar un marcador o una tarjeta para que la cámara vuele hasta él.

## 6. Plan B si falla la demo en vivo

- **Video de respaldo** de unos 90 s con el recorrido de la sección 5, guardado **en la laptop** (no depender de internet) y en Drive.
- **Capturas** de cada paso dentro de las diapositivas, por si tampoco funciona el video.
- **Build local:** `npm run build` y `npm run preview` en la laptop de la presentación, con los datos reales ya generados.
- **Regla:** si la página no responde en 10 segundos, se pasa al video sin disculparse.

## 7. Guion gráfico: capturas que necesitamos

Todas en inglés si la web ya tiene versión en inglés (#25). Si no, se usan solo en la presentación local.

- [x] Pantalla principal con un sitio lunar: mapa y ranking (`docs/demo/img/home-malapert.jpg`).
- [x] "Solo Bolivia", sobre Jezero (`docs/demo/img/bolivia-jezero.jpg`).
- [ ] Comparador completo: tabla, radar, coincidencias y "Dónde falla". La diapositiva 4 usa solo la parte de arriba (`docs/demo/img/compare-malapert-licancabur.jpg`) porque "Dónde falla" muestra textos de los datos en español (#25).
- [x] Vista de descubrimientos (`docs/demo/img/discoveries.jpg`).
- [x] Globo 3D: Luna con el sitio y Tierra con los análogos numerados (`docs/demo/img/globe-moon.jpg` y `globe-earth.jpg`).
- [x] Página de metodología con el diagrama del proceso (`docs/demo/img/methodology.jpg`).
- [x] Portada con la escena 3D (`docs/demo/img/hero.jpg`).
- [ ] Grabación de pantalla del recorrido de la sección 5 (para el video de respaldo).

## 8. Antes de presentar

- [ ] Ensayar 3 veces con el equipo; Sebastián hace las preguntas del jurado (J-5).
- [ ] Cronometrar: no pasar el tiempo de la sede.
- [ ] Llenar todos los `[PENDIENTE: …]` con datos reales o quitar la frase.
- [ ] Confirmar que cada función mencionada está en producción.
- [ ] Laptop cargada, cable o adaptador HDMI y el video de respaldo copiado en local.
