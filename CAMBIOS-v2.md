# Cambios de la versión 2

**Motivo:** el texto oficial del reto pide más que un ranking de sitios famosos. Quiere análogos poco estudiados, varias dimensiones de comparación y una explicación honesta de dónde falla la analogía. Además, la pestaña Teams lista 1012 equipos en este reto, así que necesitamos diferenciarnos.

## Qué cambió en el producto

1. **Descubrimiento.** Los candidatos terrestres pasan de 24 a 40 o más: 12 o más conocidos (sirven para validar el índice) y 25 o más poco estudiados. Bolivia sube a 8 o más.
2. **Campo `known`** en cada candidato (`true` si la literatura ya lo documenta como análogo) y **vista F11 de descubrimientos** en la web.
3. **Campo `tags`** en sitios y candidatos, con un vocabulario cerrado de 15 etiquetas. Cubre geología, hielo, cuevas y polvo, que las 5 variables numéricas no cubren. El pipeline calcula `tag_overlap`.
4. **Dónde falla la analogía.** Las fichas llevan `breaks_down` y `processes` (el campo `limits` se renombra a `breaks_down`), y la web muestra un panel fijo con las limitaciones universales de la Tierra como análogo.
5. **Temperatura lunar con Diviner**, que el reto destaca como recurso oficial.
6. **Informe público** (`docs/INFORME.md`) y lenguaje del pitch alineado con el reto.
7. **Escaneo global grueso (F12)** como segunda fase opcional, con decisión a las 19:00.
8. **Hito de datos completos** pasa de las 18:00 a las 19:00.
9. Repositorio: https://github.com/LuisFernandoGuzmanOporto/Alpha-deploy.git

## Qué debe hacer cada quien ahora

| Persona | Cambio |
| --- | --- |
| Fernando | Subir el starter a Alpha-deploy. Agregar `known`, `tags` y `tag_overlap` a `types.ts`. Sumar F11 y el panel de limitaciones |
| Dante | Agregar `tags` a cada sitio y usar Diviner para la temperatura lunar. El comparador suma coincidencias cualitativas y "dónde falla" |
| Lian | Subir la meta a 40 candidatos con `known` y `tags`. Las fichas llevan `breaks_down` y `processes` |
| Sebastián | Validar con los conocidos, medir cuántos poco estudiados entran al top 5, decidir el papel de `tag_overlap` y evaluar F12 a las 19:00 |
| Noe | Tres componentes nuevos: `KnownBadge`, `TagList` y `LimitationsPanel` |
| Joel | Escribir el informe público y usar el lenguaje del reto en el pitch |

## Si ya empezaste con la versión 1

- Los campos nuevos (`known`, `tags`) son aditivos: tus datos actuales siguen valiendo, solo agrégalos.
- `validate.py` ahora exige `known` en los candidatos y avisa si falta `tags`. Corre `python pipeline/validate.py` para ver qué falta.
- Reemplaza `CONTEXT.md`, `TASKS.md` y tu archivo de `prompts/` por los de esta versión, y vuelve a pegar `CONTEXT.md` en tus chats de IA.
