# Contenido bilingüe — 15 de noviembre de 2026

Solicitud expresa de Noe: al cambiar de español a inglés, traducir también el contenido.
Esta decisión amplía el alcance anterior que limitaba la traducción a controles (#25).

## Implementación exclusivamente frontend

- `places.en.ts`: nombres de presentación de los seis sitios y 47 candidatos, países,
  regiones y razones de selección. Se conservan los topónimos propios cuando corresponde.
- `fichas.en.ts`: las 31 fichas publicadas, con resumen, procesos, usos y limitaciones.
- `site-details.en.ts`: notas y fuentes visibles de los sitios, conservando URLs y productos.
- `methodology.en.md`: traducción completa de las nueve secciones, tablas, fórmula y fuentes.
- `localized-data.ts` y `useLocalizedData.ts`: copias de presentación según idioma.
  Inicio, Descubrimientos y Comparar consumen estas copias. No cambia el cargador original.
- El selector conserva la preferencia y actualiza solo `lang` si el enlace ya lo contiene;
  los demás parámetros (sitio, análogo, filtros y pesos) se mantienen.

Sin backend, nuevas dependencias, claves ni llamadas de traducción al usar la aplicación.
No se modifican `data/`, `web/public/data/`, `pipeline/`, `lib/` ni el contrato de tipos.
Los resultados, coordenadas, valores, clasificación y etiquetas originales se conservan.
Las notas internas de candidatos conservan la marca ATENCION que usa la advertencia de sesgo;
esas notas internas no se muestran como contenido de la interfaz.

Los títulos oficiales de publicaciones y los nombres propios mantienen su forma original.
Las etiquetas descriptivas de referencias sí se traducen. Las cifras textuales se expresan
con puntuación inglesa equivalente sin cambiar los valores. No se añaden afirmaciones científicas.

## Verificación

- Build/TypeScript y 60 pruebas correctos.
- Cobertura de todas las ubicaciones, países, regiones y fichas del catálogo actual.
- Igualdad de puntajes, orden y filtros para todos los sitios, incluyendo pesos personalizados.
- Igualdad de los indicadores de sesgo; no mutación de los objetos originales.
- Conservación de cifras y referencias de fichas/notas y cifras de tablas de metodología.
- Navegador: cuatro rutas × dos idiomas × dos anchos (1360 y 375 px), sin desborde ni
  las frases españolas comprobadas en la presentación inglesa. Registro: qa-bilingue.json.
- Selector real ES → EN → ES, recarga del enlace con idioma explícito y navegación entre páginas.
- Licancabur: 60.6 / 100 en ambos idiomas; advertencia de sesgo visible en ambos.
- Globo con nombres, países e instrucciones en inglés.

La traducción es editorial y está guardada en el proyecto. No es una validación independiente
de las afirmaciones científicas del equipo. Si cambian los textos o datos originales, revisar
las traducciones en el mismo cambio; las pruebas detectan nuevas entradas y variaciones de cifras.
El documento español original continúa siendo la fuente científica mantenida por Sebastián.
