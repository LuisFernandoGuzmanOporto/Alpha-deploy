# Informe de la fase final (para Fernando)

Domingo 15/11/2026, de 00:00 a 01:20 (hora de Bolivia). Dante con Claude, sobre `prompts/fase-final.md`. Todo está en `main` (PR #59 a #64).

## Cómo se subió

- El push directo a `main` lo rechaza el ruleset del repositorio ("push declined due to repository rule violations": exige PR). El bypass de administrador del prompt es de tu cuenta, no de la de Dante. Por eso cada bloque fue un PR que se fusionó con merge normal (sin `--force`, sin borrar ramas, sin reescribir historia): #59 (tarea 1), #60 (tarea 2), #61 (tarea 3), #62 (2f), #63 (4a y 4b) y #64 (4c, 4d y cierre).
- **GitHub Actions no corre:** "The job was not started because your account is locked due to a billing issue". Es la cuenta dueña del repositorio. El flujo `.github/workflows/ci.yml` está listo; las mismas comprobaciones pasan en local.
- **`gh repo edit` no se pudo** (la cuenta de Dante no tiene permisos de administración; responde 404). Comando para ti:
  `gh repo edit LuisFernandoGuzmanOporto/Alpha-deploy --description "Earth analogs for Moon and Mars landing sites: a ranked, explainable similarity index built on NASA data" --add-topic nasa-space-apps,earth-analogs,moon,mars,react,typescript,maplibre`
- La línea de atribución de los commits dice **Claude Opus 5.5** y no "Sonnet 5.5" como pedía el prompt, porque el modelo que hizo el trabajo fue Opus 5.5.

## Tarea 1: auditoría de `known` y coordenadas

- **6 lugares pasan a conocidos** con fuente primaria leída (resumen o título): Laguna Verde de Bolivia (High Lakes Project, NTRS 20030111008 y doi:10.1029/2008jg000818), Rub' al Khali (PLOS ONE 2016 y NTRS 20160012254), Lava Beds (JGR Planets 2022, Astrobiology 2021, GSA 2024), El Malpaís (Hatheway y Herring 1970, citado por un resumen de 1989), lago Eyre (NTRS 19890016966) y Undara (EPSC 2022). Tabla completa de los 25 lugares, con fuentes y motivos, en `docs/AUDITORIA_KNOWN.md`.
- **Decisiones dudosas:** lago Eyre (solo una ponencia de 1989) y Undara (solo aparece como ejemplo) pasaron a conocidos con la duda escrita en su ficha; Socompa, Manjanggul y Uturuncu se quedaron como poco estudiados (las fuentes hablan de la región o de fumarolas sin encuadre planetario). Ojo con la **otra** Laguna Verde (Chile y Argentina, junto a Ojos del Salado): sus artículos no se usaron.
- **Coordenadas verificadas:** Atacama al pozo de muestreo de Yungay (Azua-Bustos et al. 2020, Scientific Reports), Mauna Kea al sitio de prueba Pu'u Hiwahine (ten Kate et al., NTRS 20110008363) y Río Tinto a Minas de Riotinto (estaba a unos 3 km).
- **Límite:** OpenAlex agotó su cuota diaria a mitad de la auditoría; la segunda pasada se hizo con Crossref, NTRS y búsqueda web. No se registró ninguna clave con datos personales.

| Cifra | Antes | Ahora |
| --- | --- | --- |
| Conocidos / poco estudiados | 22 / 25 | 28 / 19 |
| 1.º de Jezero | Gilf Kebir (80,8) | Atacama-Yungay (82,1) |
| 1.º de Gale | Gilf Kebir (83,2) | Atacama-Yungay (83,8) |
| 1.º de Faustini Rim A | Atacama (62,7) | McMurdo (62,7); McMurdo es ahora 1.º en los tres sitios lunares |
| Conocidos de Marte en el top 5 de Jezero y Gale | 2 | 3 |
| Poco estudiados en el top 5 general | 12 de 30 | 11 de 30 |
| Sensibilidad (S-3) | 59 de 60 y 21 de 30 | 58 de 60 (38 con los cinco nombres) y 19 de 30 |

Textos actualizados en español e inglés: metodología (S-3 y S-6), README, TASKS, informe, pitch, entrega, preguntas del jurado (3, 6, 8 y 9), atribución, fichas y diapositivas; demo regenerada con capturas reales. **Aviso:** `validate.py` muestra ahora el aviso de metas porque quedan 19 poco estudiados (la meta era 25 o más).

## Tarea 2: entrega y calidad

- **2a:** `lang="en"`, descripción, `theme-color`, favicon (a partir de `docs/design/logo.svg`), Open Graph y Twitter. La imagen (1200 × 630) es un recorte de una captura real; su URL se vuelve absoluta en el build con `VERCEL_PROJECT_PRODUCTION_URL` (comprobado con un valor de prueba).
- **2b:** `LICENSE` MIT y nota en el README. Descripción y temas: pendiente (ver arriba).
- **2c:** README con 4 capturas, "Use it in 60 seconds" y dónde está la metodología (ES y EN). Se corrigieron dos frases viejas (nombres y metodología "solo en español").
- **2d:** referencias de las fichas en `docs/ENTREGA.md` (99 enlaces: 60 DOI, 4 NTRS). Los `[PENDING]` de Vercel y del enlace de la demo no se tocaron.
- **2e:** integración continua lista (Node 22 y Python 3.12, con comprobación de que `similarity.py` regenera sin diferencias); no corre por el bloqueo de facturación.
- **2f:** botón "Exportar a PDF" en la comparación con hoja de impresión (fondo blanco, sin barra ni controles, referencias con URL). PDF real revisado en inglés y español.

## Tarea 3: rendimiento (móvil lento, medido con `docs/qa/perf.mjs`)

| | Paquete principal | Primer contenido | Bloqueo |
| --- | ---: | ---: | ---: |
| Al empezar | 618 KB | 2,0 s | ~610 ms |
| Al terminar | 475 KB | 1,74 s | ~410 ms |

Se quedaron: textos en inglés de los datos bajo demanda, Motion con `LazyMotion` y `domMax` en un fragmento aparte (el ranking usa `layout`, por eso no `domAnimation`), el mapa pedido tras el primer pintado (aparece ~140 ms antes) y `main` con alto mínimo (CLS del inicio de 0,16 a 0,001). **Descartado:** precargar los JSON (retrasaba el primer contenido ~150 ms). Meta cumplida (< 1,8 s y < 600 ms).

## Tarea 4: innovación (sin tocar la fórmula ni `score.ts`)

- **4a. Perfiles por objetivo de misión** en Filtros: Igual, Movilidad de rovers, Energía y sistemas térmicos, Agua y hielo. Usan `pesos` en la URL; pesos justificados como ejemplos (no calibración) en el código y en la metodología, con una tabla del primer puesto por perfil.
- **4b. Insignia de robustez:** "Stable rank: 2nd to 4th in 15 of 15 scenarios" para los 3 primeros y el análogo elegido. Repite los 15 escenarios de `sensitivity.py` en el navegador con diferencias a precisión completa; una prueba comprueba que coincide **exactamente** con el pipeline (6 rankings base y 30 escenarios). Hallazgo útil para el pitch: con pesos iguales el Atacama va del 1.º al 11.º en Jezero y Gilf Kebir del 1.º al 26.º (al quitar la precipitación), mientras Tibesti se queda entre 2.º y 4.º.
- **4c. Comparar hasta 3 análogos** en un radar superpuesto (color y trazo distinto por serie) con tabla; parámetro `analogos=a,b,c`.
- **4d. Explicaciones F7** con plantilla fija para los 5 mejores pares de cada sitio (30 pares, ES y EN, revisados a mano). Esto cierra L-3 y L-4 de Lian de otra forma (sin `explicaciones.json` ni IA).

## Verificación final

`tsc` sin errores, 76 de 76 pruebas, build sin errores, `validate.py` 0 errores, QA con clics reales **47 de 47** (34 anteriores y 13 nuevas), sin desborde a 375 px, `check_ficha_urls.py` sin problemas. Detalle y lo que no se pudo probar: `docs/QA.md`, pasada 4.

## Lo que queda (y por qué)

- **Tuyo:** desbloquear GitHub Actions (facturación), `gh repo edit` y comprobar la imagen de Open Graph cuando exista la URL de Vercel.
- **Sin probar:** producción en Vercel, Chrome/Firefox/Safari (solo Edge), lector de pantalla y zoom al 200 %, impresión en papel.
- **Datos:** el aviso de metas de `validate.py` (19 poco estudiados de 25 pedidos) es consecuencia honesta de la auditoría; no se agregaron lugares para cumplirla.
