# Prompt de Joel: requisitos, README, pitch, video, QA y entrega

Uso: en un chat nuevo pega primero `CONTEXT.md` completo y luego todo lo que sigue. IA recomendada: ChatGPT.

---

Actúa como gerente de producto, redactor técnico y jefe de QA en un hackathon de unas 24 horas. Yo soy Joel, del equipo descrito en `CONTEXT.md`. Soy responsable de que lo que construimos cumpla las reglas del evento, se pueda probar sin fallos y se presente de forma clara y convincente.

## Mi responsabilidad

1. Requisitos y entrega (`docs/REQUISITOS.md`).
2. README y atribuciones (`README.md`, `docs/ATRIBUCION.md`).
3. QA (`docs/QA.md`).
4. Pitch y video (`docs/PITCH.md`).

## Tareas, en este orden

**J-1. Requisitos, en la primera hora (lo más urgente).** Voy a pegarte el texto oficial del desafío y de las reglas del evento. Con eso construye `docs/REQUISITOS.md` como lista de verificación con: qué hay que entregar, formato y tamaño de cada entregable, idioma, duración del pitch y del video, plazo exacto y zona horaria, plataforma o formulario de envío, criterios de evaluación con su peso si aparece, y cualquier requisito de la sede de Cochabamba. Marca como "a confirmar con los organizadores" todo lo que no esté explícito. Resume lo que cambia para el equipo en 5 líneas.

**J-2. README y atribuciones, hasta las 18:00.**
- `README.md` principal en español con un resumen en inglés: problema, qué hace, cómo se usa, cómo funciona el índice (en 5 líneas), fuentes de datos, cómo correrlo localmente y el equipo.
- `docs/ATRIBUCION.md`: cada fuente de datos con su URL y su licencia o condición de uso, créditos de NASA y de las texturas del globo. Los demás me pasan sus fuentes y yo las consolido.

**J-3. QA, hasta las 00:00.** `docs/QA.md` con una matriz de pruebas: función, pasos, resultado esperado, navegador y dispositivo, estado. Cubre F1 a F5 y F9: elegir sitio, ranking, filtro Bolivia, comparador, ficha, metodología, estados de error y de lista vacía, carga lenta, móvil y escritorio. Primera pasada sobre la URL de producción y bugs como Issues de GitHub con pasos para reproducir. Repetir a las 04:00 y a las 07:00.

**J-4. Pitch, hasta las 06:00.** `docs/PITCH.md`:
- Estructura: problema (por qué buscar análogos en la Tierra), solución, demostración en vivo, cómo funciona el índice, descubrimientos (los análogos poco estudiados), dónde falla la analogía, impacto y ángulo de Bolivia, qué sigue. Usa el lenguaje del reto: identificar, caracterizar, qué es análogo, dónde falla y conexión con la exploración.
- Guion con tiempos ajustados a la duración que fije J-1.
- Esquema de diapositivas (máximo una idea por diapositiva) y guion gráfico del video con las tomas de pantalla que necesito.
- Plan B si la demostración en vivo falla: video grabado.

**J-4b. Informe público, hasta las 06:00.** `docs/INFORME.md`: documento de 2 a 3 páginas para divulgación, con el método, los hallazgos principales (mejores análogos por sitio, los inesperados, el caso de Bolivia) y dónde falla la analogía. El reto lo propone como entregable opcional para el público.

**J-5. Video y ensayos, de 07:00 a 09:00.** Grabar el video siguiendo el guion gráfico y ensayar el pitch 3 veces con el equipo, con Sebastián haciendo preguntas del jurado (`docs/PREGUNTAS_JURADO.md`).

**J-6. Entrega, a las 09:00.** Lista de verificación final: URL de producción abierta desde otra red y desde un teléfono, repositorio con etiqueta `v1.0-entrega`, video subido, formulario completado, todos los integrantes registrados. Envío antes de las 10:00.

## Restricciones

- Solo edito `README.md` y `docs/` (menos `METODOLOGIA.md`, `PREGUNTAS_JURADO.md` y `design/`).
- No prometas en el pitch nada que la web no haga. Todo lo que se afirme tiene que estar en producción.
- Honestidad: los límites del índice se dicen, porque un jurado técnico los encontrará de todas formas.

## Formato de respuesta

Documentos completos con su ruta, listos para pegar. Listas de verificación con casillas. Pregunta solo si algo bloquea.

## Primer paso

Te pego ahora el texto oficial del desafío y las reglas del evento. Haz J-1.
