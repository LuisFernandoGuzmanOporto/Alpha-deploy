# Contexto del proyecto: Earth Analogs

NASA Space Apps Challenge, sede Cochabamba. Este archivo es la fuente de verdad del proyecto (versión 2).

> Si eres una IA ayudando a un integrante del equipo: lee todo este archivo antes de responder y respeta las reglas de la sección 9.

## 1. Qué construimos

**Desafío:** *Identify Earth Locations that Analog the Permanent Moon Base Locations and Mars*. Materias: Earth Science, Planets & Moons, Software y Space Exploration. Niveles: avanzado, intermedio y principiante. Apuntamos a avanzado.

**Producto:** una web pública donde el usuario elige un sitio candidato de base lunar o marciana y obtiene un ranking de lugares de la Tierra que se le parecen, con un índice de similitud de 0 a 100, una comparación variable por variable, coincidencias cualitativas (geología, hielo, cuevas, polvo), una ficha de cada análogo que dice también **dónde falla la analogía**, un filtro Bolivia y una vista de **descubrimientos** (lugares poco estudiados).

**Nombre de trabajo:** Earth Analogs. Noe propone el nombre final.

**Principio de arquitectura:** todo se calcula de antemano en Python y la web solo lee archivos JSON estáticos. No hay servidor propio ni llamadas a IA en producción.

### Lo que el reto pide de verdad (texto oficial, resumido)

- Identificar y caracterizar lugares de la Tierra que sirvan como análogos de sitios candidatos de bases lunares permanentes o de aterrizaje y exploración en Marte, con datos abiertos de NASA y de otras agencias, y presentarlos como mapa, visualización, app o herramienta.
- Explicar **qué hace análogo** a cada lugar, **en qué falla la analogía** y cómo ayudaría a preparar la exploración (probar instrumentos, operaciones robóticas o humanas, buscar recursos o señales de habitabilidad, reducir riesgos).
- **El objetivo no es redescubrir sitios famosos** (Atacama, Isla Devon, Valle de la Muerte) **ni encontrar un lugar que "se parezca"**. Se anima a combinar datos con creatividad para hallar análogos poco estudiados, a pensar más allá de lo visual y a pensar en procesos, no solo en lugares.
- Dimensiones sugeridas: geología y minerales, topografía, temperatura e iluminación, agua y hielo, polvo y viento, biología y habitabilidad, cuevas y subsuelo, operaciones robóticas y humanas.
- Reconocer los límites de la Tierra como análogo (gravedad reducida, vacío lunar, atmósfera tenue de Marte, radiación) es parte del buen análisis científico.
- Un informe escrito para el público es opcional y bienvenido.

### Competencia y cómo nos diferenciamos

La pestaña Teams del reto lista 1012 equipos, y varios hacen mapas o rankings de similitud (nombres como Analog Atlas o Analog Mappers). Un ranking de sitios famosos no nos distingue. Nos diferenciamos con cuatro cosas:

1. **Descubrimiento.** 25 o más lugares poco estudiados evaluados con el mismo índice que los conocidos, y una vista que muestra los más inesperados.
2. **Honestidad científica.** Cada comparación dice qué se parece, por cuánto y dónde falla. Los límites universales están siempre visibles.
3. **Varias dimensiones.** Cinco variables numéricas más etiquetas cualitativas de geología, hielo, cuevas y polvo.
4. **Bolivia.** El Altiplano y sus salares como región poco caracterizada frente a Atacama.

Todo lo que digamos en el pitch tiene que estar funcionando en producción.

## 2. Ventana de tiempo

Suposición de trabajo: arranque sábado 14/11 a las 08:00, cierre domingo 15/11 a las 11:00. Entregamos antes de las 10:00. Joel confirma las fechas reales en `docs/REQUISITOS.md` en la primera hora y avisa si algo cambia.

## 3. Equipo y roles

| Persona | Rol principal | Segunda fase |
| --- | --- | --- |
| Fernando | Líder técnico, repositorio, interfaz y mapa | Integración, revisión de PRs, sliders de pesos |
| Dante | Datos de la Luna y Marte | Comparador lado a lado y globo 3D |
| Lian | Datos de la Tierra y Bolivia, con descubrimiento | Fichas, explicaciones y exportar PDF |
| Sebastián | Índice de similitud, validación y metodología | Escaneo global grueso y defensa técnica |
| Noe | Diseño y componentes visuales | Textos, responsive y accesibilidad |
| Joel | Requisitos, README, pitch, video e informe | QA y entrega |

## 4. Alcance completo (no se recorta)

| Id | Funcionalidad | Dueño | Tipo |
| --- | --- | --- | --- |
| F1 | Selector de sitio lunar o marciano | Fernando | Núcleo |
| F2 | Mapa con el ranking de análogos terrestres | Fernando | Núcleo |
| F3 | Vista comparativa lado a lado: variables, coincidencias cualitativas y dónde falla la analogía | Dante | Núcleo |
| F4 | Ficha de cada análogo: por qué se parece, procesos, para qué sirve, dónde falla y fuentes | Lian | Núcleo |
| F5 | Filtro Bolivia | Fernando | Núcleo |
| F9 | Página de metodología con fuentes, fórmula, validación y limitaciones | Sebastián y Fernando | Núcleo |
| F11 | Descubrimientos: interruptor "solo poco estudiados", etiqueta Nuevo o Conocido y vista de los 5 mejores poco estudiados por sitio | Fernando | Núcleo |
| F6 | Globo 3D con Tierra, Luna y Marte | Dante | Segunda fase |
| F7 | Explicaciones redactadas con IA, generadas antes y revisadas por una persona | Lian | Segunda fase |
| F8 | Exportar la ficha a PDF | Lian | Segunda fase |
| F10 | Sliders para cambiar el peso de cada variable | Fernando y Sebastián | Segunda fase |
| F12 | Escaneo global grueso: cuadrícula de 2° con el mismo índice, capa de calor en el mapa | Sebastián y Lian | Segunda fase, solo si hay camino de datos |

Regla: el núcleo se cierra y se despliega antes de que alguien empiece una función de segunda fase. Las de segunda fase que no lleguen a las 02:00 con avance real se descartan sin drama.

## 5. Variables, etiquetas y dimensiones

### Variables numéricas del índice

Cinco variables, tomadas en una ventana espacial común (sección 7).

| Id en los datos | Qué mide | Unidad | Fuente candidata en la Tierra | Fuente candidata en Luna y Marte |
| --- | --- | --- | --- | --- |
| `slope_deg` | Pendiente media del terreno | grados | Modelo digital de elevación abierto (SRTM u otro) | LOLA (Luna) y MOLA o HRSC (Marte), vía Moon Trek y Mars Trek |
| `relief_m` | Relieve local: desviación estándar de la elevación dentro de la ventana | metros | El mismo modelo digital | Los mismos modelos de elevación |
| `temp_mean_c` | Temperatura media anual de la superficie | °C | NASA POWER, parámetro de temperatura de superficie | Diviner (LRO) en la Luna, con sus productos polares, y datos de temperatura de superficie de Marte, a verificar en Trek o PDS |
| `precip_mm_year` | Precipitación media anual, como indicador de aridez | mm por año | NASA POWER | 0 en Luna y Marte, no hay lluvia |
| `albedo` | Reflectividad de la superficie | 0 a 1 | Producto de albedo de MODIS u otro abierto | Productos de albedo disponibles en Moon Trek y Mars Trek, a verificar |

Las fuentes son candidatas: cada responsable confirma la disponibilidad y deja la fuente exacta en el campo `sources` de cada registro.

**Notas metodológicas críticas**

1. **No se usa la elevación absoluta.** La altura sobre el nivel del mar de la Tierra no es comparable con la de la Luna o Marte, que tienen otros niveles de referencia. Por eso usamos relieve local y pendiente.
2. **Escala común.** La pendiente y el relieve dependen de la resolución. Se calculan para todos los cuerpos en una ventana de 10 × 10 km alrededor del punto, con el modelo remuestreado a unos 250 m por píxel. Sebastián confirma o ajusta la ventana y la documenta.
3. **Aridez.** En Luna y Marte la precipitación es 0, así que la variable solo discrimina entre candidatos terrestres: los más áridos puntúan más alto.
4. **Temperatura.** Usamos temperatura de superficie en todos los cuerpos, no temperatura del aire, para que la definición sea la misma.
5. **Sitios polares lunares.** Los cráteres en sombra permanente tienen temperaturas que ningún lugar de la Tierra alcanza. El índice lo reflejará con puntajes más bajos y eso se explica en la metodología, no se maquilla.

### Etiquetas cualitativas (`tags`)

Las variables numéricas no cubren geología, hielo, cuevas ni polvo. Esas dimensiones del reto las cubrimos con etiquetas de este vocabulario cerrado, asignadas **solo con respaldo citable** en la literatura o en los datos de misión:

`basalt`, `impact-crater`, `evaporite`, `aeolian-dunes`, `dust-activity`, `polar-ice`, `permafrost`, `glacier`, `lava-tubes`, `caves`, `hydrated-minerals`, `highland-terrain`, `volcanic-field`, `extreme-cold`, `hyper-arid`.

El pipeline calcula la coincidencia de etiquetas entre un sitio y un candidato (`tag_overlap`) y la muestra aparte del puntaje. Sebastián decide si entra al puntaje con algún peso.

### Cómo cubrimos cada dimensión del reto

| Dimensión del reto | Dónde vive en nuestro producto |
| --- | --- |
| Geología, minerales y materiales | `tags` (`basalt`, `evaporite`, `hydrated-minerals`, ...) |
| Topografía y rugosidad | `slope_deg` y `relief_m` |
| Temperatura, extremos e iluminación | `temp_mean_c`, Diviner para la Luna, tag `extreme-cold` |
| Agua, hielo y permafrost | `tags` (`polar-ice`, `permafrost`, `glacier`) y nota de evidencia (LEND, Mini-RF, Diviner) |
| Polvo, viento y erosión | `tags` (`aeolian-dunes`, `dust-activity`) y campo `processes` de la ficha |
| Biología y habitabilidad | Texto de la ficha con extremófilos documentados; sin variable |
| Cuevas y subsuelo | `tags` (`lava-tubes`, `caves`) |
| Operaciones robóticas y humanas | `use_cases` de la ficha |
| Límites de la analogía | `breaks_down` de cada ficha y el panel fijo de limitaciones universales |

## 6. Contrato de datos

Todos los archivos viven en `data/` (los edita su dueño) y el pipeline los copia a `web/public/data/` junto con `results.json`.

**`data/sites.json`** (dueño: Dante). Lista de sitios de la Luna y Marte.

```json
{
  "id": "moon-faustini-rim-a",
  "body": "moon",
  "name": "Faustini Rim A",
  "region": "Polo sur lunar",
  "lat": null,
  "lon": null,
  "variables": {
    "slope_deg": null,
    "relief_m": null,
    "temp_mean_c": null,
    "precip_mm_year": 0,
    "albedo": null
  },
  "sources": {
    "precip_mm_year": "Sin atmósfera con lluvia; valor definido como 0"
  },
  "tags": ["highland-terrain", "extreme-cold"],
  "notes": "Sistema de coordenadas y detalles de cálculo"
}
```

**`data/candidates.json`** (dueña: Lian). Lista de lugares terrestres. Mismos campos, con `"body": "earth"` y estos extras:

```json
{
  "country": "Bolivia",
  "is_bolivia": true,
  "known": false,
  "analog_for": ["mars"],
  "why": "Una frase sobre por qué se usa como análogo",
  "reference_urls": ["https://..."]
}
```

`known` es `true` si la literatura ya documenta el lugar como análogo planetario, y `false` si es poco estudiado como análogo. Es el dato que alimenta F11.

**`web/public/data/results.json`** (generado por `pipeline/similarity.py`, lo commitea solo Sebastián).

```json
{
  "generated_at": "2026-11-14T15:30:00+00:00",
  "variables": ["slope_deg", "relief_m", "temp_mean_c", "precip_mm_year", "albedo"],
  "weights": {"slope_deg": 1, "relief_m": 1, "temp_mean_c": 1, "precip_mm_year": 1, "albedo": 1},
  "log_variables": ["relief_m", "precip_mm_year"],
  "ranges": {"slope_deg": [0, 30]},
  "sites": {
    "moon-faustini-rim-a": [
      {"candidate_id": "earth-salar-de-uyuni", "score": 84.2, "n_vars_used": 5,
       "norm_diff": {"slope_deg": 0.05, "relief_m": 0.10, "temp_mean_c": 0.20, "precip_mm_year": 0.01, "albedo": 0.30},
       "tag_overlap": {"jaccard": 0.4, "shared": ["hyper-arid"], "only_site": ["extreme-cold"], "only_candidate": ["evaporite"]}}
    ]
  }
}
```

Cada lista está ordenada de mayor a menor `score`. `norm_diff` es la diferencia normalizada (0 a 1) por variable, y con eso la web puede recalcular el puntaje con otros pesos. `tag_overlap` es `null` si falta alguno de los dos lados.

**`web/public/data/fichas.json`** (dueña: Lian). Una ficha por candidato:

```json
{
  "candidate_id": "earth-salar-de-uyuni",
  "summary": "2 o 3 frases",
  "processes": ["procesos activos que sirven de análogo, por ejemplo erosión eólica"],
  "use_cases": ["pruebas de rovers", "entrenamiento de astronautas"],
  "breaks_down": ["dónde falla la analogía con este sitio concreto"],
  "references": [{"title": "...", "url": "..."}]
}
```

**`web/public/data/explicaciones.json`** (dueña: Lian). Texto por par sitio y candidato.

**`web/public/data/scan.json`** (opcional, F12, Sebastián). Mejores celdas del escaneo global por sitio.

Un valor que no se consigue se escribe `null`. Nunca se inventa.

## 7. Método del índice

1. Para cada variable se transforma el valor (logaritmo `log1p` en `relief_m` y `precip_mm_year`, sin transformar en las demás).
2. Se normaliza entre 0 y 1 con el mínimo y el máximo de todos los registros juntos (sitios y candidatos).
3. Por cada par sitio y candidato se calcula la diferencia absoluta por variable.
4. La distancia es el promedio ponderado de esas diferencias, solo con las variables disponibles en ambos.
5. `score = 100 × (1 − distancia)`. Un par necesita al menos 3 variables para entrar al ranking.
6. Aparte, `tag_overlap` mide la coincidencia cualitativa con el índice de Jaccard sobre las etiquetas.

Pesos iguales al inicio. Cualquier cambio de pesos, transformación o ventana lo decide Sebastián y lo escribe en `docs/METODOLOGIA.md`.

**Validación.** Los candidatos `known: true` sirven de prueba: para los sitios que les corresponden según `analog_for` deben aparecer arriba. Si no, se investiga por qué antes de confiar en los descubrimientos.

## 8. Listas iniciales y fuentes oficiales

**Sitios extraterrestres (Dante).** Luna, regiones candidatas de aterrizaje de Artemis en el polo sur: Faustini Rim A, Peak Near Cabeus B, Malapert Massif. Marte: Jezero, Gale y Arcadia Planitia.

**Candidatos terrestres (Lian), 40 o más:**

- **Conocidos (`known: true`), 12 o más, para validar el índice:** Atacama (Yungay), Valles Secos de la Antártida, Isla Devon (Haughton), Mars Desert Research Station (Utah), Danakil, Islandia (Askja), Mauna Kea, Río Tinto, Valle de la Muerte, Meteor Crater, Svalbard y Lut.
- **Poco estudiados (`known: false`), 25 o más:** son el corazón del descubrimiento. No hay lista cerrada: Lian los propone con una razón basada en datos (por ejemplo, muy árido, frío y de mucho relieve) entre desiertos fríos de altura, campos volcánicos áridos, salares, mesetas polares y periglaciares, cráteres de impacto, cuevas, tubos de lava y minas. Si la literatura ya los estudia como análogos, pasan a `known: true`.
- **Bolivia, 8 o más:** Salar de Uyuni, Laguna Colorada, Laguna Verde, Desierto de Siloli, Sud Lípez, Salar de Coipasa, campos volcánicos del Altiplano y otros que Lian encuentre.

Todo se verifica contra literatura citable antes de entrar.

### Fuentes oficiales del reto

Joel revisa la pestaña Resources por si agregan más antes o durante el evento. El texto completo del desafío está en `docs/DESAFIO_OFICIAL.md`.

- NASA Earthdata Search: https://search.earthdata.nasa.gov/
- NASA Worldview: https://worldview.earthdata.nasa.gov/
- NASA Planetary Data System (PDS): https://pds.nasa.gov/
- LRO en PDS Geosciences (LROC, LOLA, Diviner, LEND, Mini-RF): https://pds-geosciences.wustl.edu/missions/lro/
- LRO Diviner, temperaturas lunares y productos polares: https://pds-geosciences.wustl.edu/missions/lro/diviner.htm
- CSA, RADARSAT Constellation: https://donnees-data.asc-csa.gc.ca/en/dataset/rcm
- CSA, RADARSAT-1: https://donnees-data.asc-csa.gc.ca/en/dataset/radarsat1
- CSA, tutorial SAR con Python y QGIS: https://github.com/asc-csa/Synthetic_Aperture_Radar_Tutorial
- ESA, Copernicus Data Space Ecosystem: https://dataspace.copernicus.eu/
- ESA, Open Science Catalog: https://opensciencedata.esa.int/
- JAXA G-Portal: https://gportal.jaxa.jp/gpr/index/index

Además usamos Moon Trek, Mars Trek y NASA POWER, que no figuran en la lista oficial pero son fuentes abiertas de NASA.

## 9. Reglas para humanos y para IA

1. **Nunca inventar datos.** Sin valor, se escribe `null` y se explica en `notes`.
2. **Cada variable no nula lleva fuente** en `sources`: nombre del producto y URL o cita.
3. **Texto científico:** solo se afirma lo que se pueda citar. Lo demás se marca "(a verificar)".
4. **Etiquetas (`tags`) y `known` solo con respaldo.** Una etiqueta o un `known: true` sin referencia que abra se quita.
5. **Cada ficha dice dónde falla la analogía.** Una ficha sin `breaks_down` no se publica.
6. **Unidades y formatos** como en la sección 5. Coordenadas en grados decimales; para la Luna y Marte se anota el sistema de coordenadas en `notes`.
7. **IDs en kebab-case** con prefijo `moon-`, `mars-` o `earth-`.
8. **Pipeline:** solo biblioteca estándar de Python, sin dependencias, para que corra en cualquier laptop.
9. **Web:** React con TypeScript estricto. Los tipos de los datos viven en `web/src/types.ts`.
10. **Sin secretos en el repositorio.** Las claves van en `.env`, que no se sube.
11. **Un archivo, un dueño** (sección 10). Si necesitas cambiar un archivo ajeno, pide el cambio por mensaje o abre un PR y avisa al dueño.
12. **Respuestas de la IA:** archivos completos con su ruta, listos para pegar, sin relleno. Preguntar solo si algo bloquea.
13. **UI en español.** Los nombres de variables en los datos van en inglés. El inglés en la UI es opcional y solo si Joel confirma que el evento lo pide.

## 10. Estructura del repositorio y dueños

```
Alpha-deploy/   (el starter se sube a este repositorio)
  CONTEXT.md  TASKS.md  AI.md  GIT.md  README.md  CAMBIOS-v2.md
  prompts/                    un archivo por persona
  data/
    sites.json                Dante
    candidates.json           Lian
    examples/                 datos de demostración, no reales
  pipeline/
    similarity.py             Sebastián
    validate.py               Sebastián
    sensitivity.py            Sebastián
    scan.py                   Sebastián (F12, opcional)
    moon_mars/                Dante
    earth/                    Lian
  web/
    public/data/results.json, sites.json, candidates.json, scan.json   generados (Sebastián commitea)
    public/data/fichas.json            Lian
    public/data/explicaciones.json     Lian
    src/                      Fernando (app, mapa, rutas)
    src/components/ui/        Noe
    src/styles/               Noe
    src/content/              Noe
    src/components/compare/   Dante
    src/components/globe/     Dante
    src/features/export/      Lian
  docs/
    METODOLOGIA.md  PREGUNTAS_JURADO.md   Sebastián
    REQUISITOS.md  ATRIBUCION.md  QA.md  PITCH.md  INFORME.md   Joel
    design/                   Noe
```

## 11. Hitos

| Hora | Hito |
| --- | --- |
| Sáb 12:30 | Repositorio creado y clonado por todos, contrato de datos aceptado, esqueleto de la web desplegado, requisitos del evento confirmados |
| Sáb 15:30 | Primer `results.json` con datos parciales; la web ya muestra ranking real |
| Sáb 19:00 | Datos completos versión 1 (6 sitios y 40 candidatos) y decisión sobre F12 |
| Dom 00:00 | Núcleo F1 a F5, F9 y F11 funcionando en producción |
| Dom 02:00 | Revisión de segunda fase: se sigue o se descarta cada función |
| Dom 05:00 | Segunda fase integrada y QA completo |
| Dom 07:00 | Congelamiento de código |
| Dom 07:00 a 09:00 | Video y ensayos |
| Dom 10:00 | Entrega enviada |
