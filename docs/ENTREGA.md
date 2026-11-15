# Entrega: lista de verificación y textos del formulario

Dueño: Joel. Reglas y fuentes en `docs/REQUISITOS.md`.

**Plazo real:** la sede carga los proyectos el **domingo 15 a las 12:00** y el cierre global es a las **23:59, hora de Bolivia**. Apuntamos a enviar **antes de las 10:00** y a terminar de revisar a las 11:00. Se puede editar y reenviar hasta el cierre; vale el último envío guardado.

## 0. Estado al domingo 15/11 (rama `feat/joel-rediseno-3d`)

Registro de lo comprobado y de lo que sigue abierto. Solo se marca lo que se verificó de verdad.

| Punto | Estado | Evidencia o qué falta |
| --- | --- | --- |
| Rediseño visual y 3D (portada, globo WebGL, descubrimientos, metodología, Bolivia) | Hecho en la rama, **sin fusionar ni desplegar** | `tsc` sin errores, 80 de 80 pruebas, build correcto, `qa.mjs` 48 de 48, `a11y.mjs` sin hallazgos (`docs/QA.md`, pasada 6) |
| Mapa con fotos reales (tarjetas, galería, explorador, globo) | Hecho en la rama, **sin fusionar** | 35 de 56 lugares con fotos de Wikimedia Commons (152 fotos geoetiquetadas a menos de 10 km); los otros 21 muestran una ilustración rotulada como tal. Google Places listo pero **sin clave configurada** |
| Capturas de las seis secciones | Hecho | `docs/demo/img/` (ver `docs/demo/README.md`) |
| PDF de la demo (7 diapositivas, inglés) | Exportado en local | `docs/demo/earth-analogs-demo.pdf`. Falta: nombres completos y nombre del equipo en la diapositiva 1, y la revisión del equipo |
| PDF en Google Drive con enlace público | **Pendiente** | No se subió: el equipo aún no lo revisó |
| URL de Vercel | **Pendiente** (F-1, Fernando) | El repositorio no tiene ningún despliegue registrado |
| QA sobre producción | **Pendiente** | Depende de la URL de Vercel |
| Oradores del pitch | **Pendiente** | Joel (apertura) y Noe (cierre) siguen como propuesta; el bloque "Solución" no tiene orador |
| Video de respaldo | **Pendiente** | Hay que grabarlo (recorrido de `docs/PITCH.md`, sección 5) |
| Tres ensayos cronometrados | **Pendiente** | Tabla de abajo, por llenar |
| Registro de los seis en la sede y "Full Name" | **Pendiente** | Lo revisa cada integrante en su perfil |
| Enlaces probados en ventana privada | Solo el repositorio | `github.com/LuisFernandoGuzmanOporto/Alpha-deploy` es público. Web, PDF y video: no existen todavía |
| Formulario enviado y captura del banner | **Pendiente** | Requiere la autorización del equipo |
| FortiGuard | No hecho (opcional) | Depende de la URL de Vercel |

### Ensayos del pitch (llenar al hacerlos)

| Ensayo | Hora | Duración | Límite de la sede | Ajustes |
| --- | --- | --- | --- | --- |
| 1 | | | [PENDIENTE: confirmar con la sede] | |
| 2 | | | | |
| 3 | | | | |

## 1. Lista de verificación

### Sábado, antes de dormir
- [ ] Los 6 integrantes registrados en la sede **Cochabamba**, sin lista de espera, y visibles en la pestaña **Members** del equipo. No se pueden agregar miembros después del cierre.
- [ ] Cada integrante revisó su "Full Name" en el perfil; es el nombre que sale en el certificado.
- [ ] Web desplegada en Vercel con URL pública (F-1, Fernando).
- [ ] Opcional: clasificación de la URL en FortiGuard Web Filter, para que los jueces puedan abrirla. Ver `docs/REQUISITOS.md`.

### Domingo 07:00, congelamiento
- [ ] `main` compila (`npm run build`) y las pruebas pasan (`npm test`).
- [ ] `python pipeline/validate.py` sin errores, con los datos reales.
- [ ] `web/public/data/` con los resultados reales, **no** con los DEMO.
- [x] Web en inglés con selector ES/EN, incluidos los textos de los datos y la metodología (#25). Revisar de nuevo si cambian los datos.
- [ ] Etiqueta de la versión final (la crea Fernando):
  ```bash
  git tag v1.0-entrega
  ```
  ```bash
  git push origin v1.0-entrega
  ```

### Domingo 07:00 a 09:00, demo y QA
- [ ] Pasada de QA de las 07:00 en producción (`docs/QA.md`).
- [ ] Demo oficial lista (`docs/PITCH.md`). El PDF de 7 diapositivas ya está generado en `docs/demo/earth-analogs-demo.pdf`; falta la revisión del equipo y subirlo:
  - **7 diapositivas** como máximo, en inglés, en PDF.
  - O un **video de 30 s** como máximo, con subtítulos en inglés si se habla en español.
- [ ] Ningún menor de 18 años en imágenes, video o audio.
- [ ] Ningún logo de NASA; imágenes generadas por IA con marca de agua (hoy no hay ninguna).
- [ ] Demo subida a Google Drive o YouTube con acceso público ("cualquiera con el enlace" o "no listado").

### Domingo 09:00 a 10:00, envío
- [ ] Probar en una **ventana privada** y **desde un teléfono con datos móviles** (otra red):
  - [ ] URL de la web.
  - [ ] Enlace de la demo.
  - [ ] Repositorio de GitHub (público).
- [ ] Llenar el formulario con los textos de la sección 2, todo en inglés.
- [ ] Llenar los `[PENDING: …]` con datos reales, o borrar la frase.
- [ ] Subir 1 a 3 imágenes (JPG, PNG o GIF de hasta 10 MB) con capturas de la web.
- [ ] Marcar "Terms and Conditions" y "Confirm All Work is Original".
- [ ] Pulsar **Submit for Judging** y confirmar que aparece el banner de envío correcto.
- [ ] Captura del banner al grupo.
- [ ] Descargar el certificado de participación del perfil (opcional, en computadora).

### Domingo 12:00 a 14:30, sede
- [ ] Confirmar con la sede que el proyecto figura como cargado.
- [ ] Laptop de la presentación lista: build local, video de respaldo y adaptador HDMI.

## 2. Textos del formulario (inglés, listos para pegar)

Revisar contra la web en producción antes de pegar: cada frase tiene que ser cierta en ese momento.

### Project Name
Earth Analogs

### High-Level Project Summary
> Earth Analogs is a web tool that ranks places on Earth by how closely they resemble candidate Moon base sites and Mars landing sites. For each site it computes a 0–100 similarity score from five variables derived from NASA data and models in a common 10 × 10 km window (slope, local relief, mean temperature, aridity and albedo), mostly from NASA data, and shows side by side what is similar and where the analogy breaks down. It answers the challenge by identifying and characterizing analogs systematically instead of only by appearance, has a dedicated view for less-studied places and a Bolivia filter, and states the limits no Earth analog can overcome: reduced gravity, the lunar vacuum, the thin Martian atmosphere and radiation.

### Link to Project Demo
[PENDING: public link to the 7-slide PDF or the ≤ 30 s video]

### Link to Final Project
https://earth-analogs-coral.vercel.app. Repository: https://github.com/LuisFernandoGuzmanOporto/Alpha-deploy

### Detailed Project Description
> **What it does.** You pick a candidate site: three Artemis III candidate regions near the lunar south pole (Peak Near Cabeus B and Malapert Massif from NASA's current list, and Faustini Rim A from its 2022 list) or three Mars sites (Jezero and Gale craters, Arcadia Planitia). The app shows a map and a ranked list of Earth analogs with their similarity score. Filters show only places in Bolivia or only less-studied places. A comparison view puts both places side by side: value by value, a similarity radar, shared qualitative tags (geology, ice, dust) and a "where the analogy breaks down" panel. A discoveries view lists the five best less-studied analogs per site. Users can change the weight of each variable and see the ranking recomputed. A 3D globe of the Earth, the Moon and Mars shows the site and its top analogs.
>
> **How it works.** Each place is described by five variables in a 10 × 10 km window. Relief and precipitation are log-transformed, all variables are min–max normalized over the whole catalog, and the score is 100 × (1 − weighted mean of the absolute normalized differences), using only variables both places have (at least three). Qualitative tags are compared separately with the Jaccard index. Every non-null value cites its source; missing values stay empty and are never estimated. Everything is computed offline in Python (standard library only) and the web app (React, TypeScript, MapLibre) only reads static JSON files.
>
> **Benefits and goals.** It helps mission teams and researchers choose where on Earth to test rovers, instruments and operations, and makes explicit what each analog is good for and where it fails. It also brings attention to less-studied places in the Bolivian Altiplano.
>
> **Tools.** Python, TypeScript, React, Vite, MapLibre GL JS, Recharts, Motion, Radix UI, GitHub and Vercel.
>
> **Findings (version 1, 6 sites and 56 Earth candidates).** For the lunar south pole sites, cold, steep, dry terrain matches best: the McMurdo Dry Valleys (Antarctica), already documented as a Mars analog, rank first for all three lunar sites (scores 72.1 at Peak Near Cabeus B, 72.3 at Malapert Massif and 62.7 at Faustini Rim A), followed by Licancabur Volcano (second at all three) and Ollagüe Volcano on the Bolivia–Chile border, a less-studied place (third at all three), then Ojos del Salado and Socompa (fourth and fifth at Peak Near Cabeus B and Malapert). Temperature and precipitation for mountain and volcano candidates come from a coarse regional grid and are biased; the lunar ranking of these places rests mainly on slope and relief. For Mars, the hyper-arid core of the Atacama Desert near Yungay (Chile), a documented Mars analog, ranks first for Jezero (82.1) and Gale (83.8), followed by the Gilf Kebir plateau (Egypt and Libya), which a 1982 NASA report already compared with Mars, and then the Tibesti Mountains at Jezero and the less-studied Kumtag Desert (China) at Gale: a sign that the index puts documented analogs on top. Bolivian places appear in the top 5 of all six sites, including less-studied ones such as Ollagüe Volcano (third at all three lunar sites) and the Siloli Desert (fourth for Jezero, fifth for Gale). The analogy breaks down mainly on temperature (the coldest Earth candidate averages −27 °C, the lunar sites −126 to −160 °C) and on precipitation. The seven known lunar analogs rank only between 16th and 46th out of 56, which suggests they are chosen for properties our five variables do not measure.

### Use of Super Intelligence (SI)
> Yes. The team used AI assistants (Claude and ChatGPT) as tools: to help write and review code, to search and check scientific literature and to draft and translate texts. The idea, the method and the data decisions are the team's. Every data value cites an original source that a team member opened and checked. The app makes no AI calls, and the project contains no AI-generated images, video or audio.

### NASA Data
> - **LRO LOLA** polar elevation model LDEM_75S_240M (PDS): slope and relief of the lunar sites.
> - **LRO Diviner** Polar Resource Product (PDS): mean annual temperature and ice-stability depth of the lunar sites.
> - **MGS MOLA** MEGDR 128 pixels/degree (PDS): slope and relief of the Mars sites.
> - **LROC NAC** region mosaics: coordinates of the lunar sites.
> - **NASA GIBS** (Blue Marble Next Generation), **Moon Trek** (LRO WAC mosaic) and **Mars Trek** (Viking MDIM 2.1 mosaic): globe textures.
> - **NASA POWER** climatology 2001–2025 (MERRA-2 and CERES SYN1deg): surface temperature (TS), corrected precipitation (PRECTOTCORR) and all-sky surface albedo (ALLSKY_SRF_ALB) of the Earth candidates.
> - **SRTM** (NASA), through Terrain Tiles on AWS: slope and relief of the Earth candidates.

### Space Agency Partner Data and Other References
> - **Mars Climate Database v6.2** (LMD/LATMOS/OU/IAA/ESA/CNES): Mars surface temperature and albedo.
> - **IAU / USGS Gazetteer of Planetary Nomenclature**: coordinates of Arcadia Planitia.
> - **OpenStreetMap** contributors (ODbL): base map.
> - **Literature:** Paige et al. 2010 (Science 330, 479); Vasavada et al. 2014 (JGR Planets, doi:10.1002/2014JE004622); Goudge et al. 2015; Farley et al. 2022; Vaniman et al. 2014; Bridges et al. 2018; Bramson et al. 2015; Colaprete et al. 2010; Kring et al. 2025.
> - **Software:** React, React Router, MapLibre GL JS, Recharts, react-markdown, Motion, Radix UI, Vite, TypeScript, Vitest.
> - **Terrain Tiles** on the AWS Registry of Open Data (https://registry.opendata.aws/terrain-tiles), accessed on 14 November 2026: elevation tiles combining SRTM and other models.
> - **Copernicus DEM GLO-30** (ESA and the European Union, AWS Open Data, https://registry.opendata.aws/copernicus-dem/), accessed on 14 November 2026: slope and relief of four Earth candidates (McMurdo Dry Valleys, Svalbard, La Corona and Manjanggul). Produced using copernicus worlddem-30 © dlr e.v. 2010-2014 and © airbus defence and space gmbh 2014-2018 provided under copernicus by the european union and esa; all rights reserved. The organisations in charge of the Copernicus programme by law or by delegation do not incur any liability for any use of the Copernicus WorldDEM-30.
> - **Wikipedia**: approximate coordinates of the Earth candidates. **Crossref**: check of which places are already documented as planetary analogs.
> - **Design:** an original SVG symbol and category illustrations made by the team.
> - **Fact sheets of the 56 Earth places** (`web/public/data/fichas.json`, shown in the app): each lists its own references, 115 distinct links in total: 64 articles and abstracts with DOI (for example Navarro-González et al. 2003, Science, doi:10.1126/science.1089143; Azua-Bustos et al. 2020, Scientific Reports, doi:10.1038/s41598-020-76302-z), 4 NASA technical reports on NTRS, NASA POWER and PDS data pages, and Wikipedia for descriptions and coordinates. The sources behind each documented analog are listed in `docs/AUDITORIA_KNOWN.md`.
> - **Wikimedia Commons** photos of the Earth places (map cards, explorer and globe): only photos geotagged within 10 km of each place; author, license and link shown under every photo and stored in `web/public/data/photos.json`.
> - **Fonts:** Inter and Space Grotesk (SIL Open Font License 1.1). **3D:** three.js, React Three Fiber and Drei (MIT).
> - Full list with links and licenses: `docs/ATRIBUCION.md` in the repository.
