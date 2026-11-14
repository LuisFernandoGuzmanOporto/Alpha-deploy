# Instrucciones para agentes (Codex / Claude Code)

Proyecto: **Earth Analogs** — NASA Space Apps Challenge Cochabamba 2026.
Desafío: "Identify Earth Locations that Analog the Permanent Moon Base Locations and Mars".

## Antes de hacer cualquier cosa
1. Lee `CONTEXT.md` completo. Es la fuente de verdad (alcance, contrato de datos, método, reglas).
2. Lee `TASKS.md` y busca la sección de la persona con la que estás trabajando. Si no sabes quién es, pregúntale su nombre (Fernando, Dante, Lian, Sebastián, Joel o Noe).
3. Lee `GIT.md` para el flujo de ramas y PRs.
4. Texto oficial del desafío: `docs/DESAFIO_OFICIAL.md`.

## Reglas duras
- Solo toca los archivos de los que es dueña esa persona (ver sección 10 de `CONTEXT.md`). Un archivo, un dueño.
- Rama propia `feat/<nombre>-<tarea>`, PR pequeño hacia `main`, `git pull --rebase origin main` antes de empujar. Nunca push directo a `main`.
- `main` siempre debe compilar y desplegarse.
- Nada de datos inventados en `data/sites.json` ni `data/candidates.json`: cada valor no nulo lleva fuente. Si no hay dato, `null`.
- Los datos de `data/examples/` son DEMO inventados; no se usan en producción.
- Antes de correr el pipeline: `python pipeline/validate.py` y luego `python pipeline/similarity.py`.
- Sin dependencias de servidor ni llamadas a IA en producción: todo se calcula offline.
- No subas tokens, claves ni archivos `.env`.
- Congelamiento de código: 07:00 del domingo. Entrega antes de las 10:00.

## Estilo
- Código limpio, tipado (TypeScript estricto en `web/`), sin código muerto.
- Commits en formato `feat:`, `fix:`, `docs:`, `chore:`, `data:`.
