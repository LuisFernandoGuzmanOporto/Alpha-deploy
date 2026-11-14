# Earth Analogs

Proyecto del equipo para el NASA Space Apps Challenge, sede Cochabamba. Desafío: *Identify Earth Locations that Analog the Permanent Moon Base Locations and Mars*.

Web que, dado un sitio candidato de base lunar o marciana, ordena los lugares de la Tierra que más se le parecen y explica por qué, con foco en los análogos de Bolivia.

> Este README es el arranque rápido del equipo. Joel lo reemplaza por la versión pública antes de la entrega.

## Empezar en 5 pasos

1. Fernando crea el repositorio y lo comparte (ver `GIT.md`, sección 1).
2. Cada persona clona el repositorio (ver `GIT.md`, sección 2).
3. Lee `CONTEXT.md` y `TASKS.md` (10 minutos).
4. Abre un chat con tu IA y pega `CONTEXT.md` y luego tu archivo de `prompts/` (ver `AI.md`).
5. Crea tu rama y trabaja (ver `GIT.md`, sección 3).

## Qué hay en cada archivo

| Archivo | Para qué |
| --- | --- |
| `CONTEXT.md` | Qué construimos, variables, contrato de datos, método, reglas y dueños de cada archivo |
| `TASKS.md` | Tareas por persona con horas límite y hitos del equipo |
| `AI.md` | Qué IA usar para qué y cómo arrancar cada chat |
| `GIT.md` | Flujo de Git, reglas y comandos |
| `prompts/` | Un prompt listo por persona: `fernando`, `dante`, `lian`, `sebastian`, `noe`, `joel` |
| `data/` | Datos de entrada (`sites.json`, `candidates.json`) y datos de ejemplo en `data/examples/` |
| `pipeline/` | Scripts de Python: `validate.py` y `similarity.py` |
| `web/` | Aplicación web (la crea Fernando) |
| `docs/` | Texto oficial del desafío (`DESAFIO_OFICIAL.md`), metodología, requisitos, atribuciones, QA y pitch |

## Probar el pipeline ahora mismo

Solo necesita Python 3.9 o superior, sin instalar nada:

```bash
python pipeline/validate.py --data data/examples
python pipeline/similarity.py --data data/examples --out-dir web/public/data
```

Con datos reales (cuando existan):

```bash
python pipeline/validate.py
python pipeline/similarity.py
```

Los datos de `data/examples/` están **inventados** y solo sirven para probar. Nunca los presentes como reales.

## Equipo

Dante, Fernando, Lian, Sebastián, Joel y Noe.
