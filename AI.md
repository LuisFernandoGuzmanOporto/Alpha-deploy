# Cómo usar las IA en el equipo

Tenemos 7 cuentas de IA: Claude en 2 o 3 personas y ChatGPT Plus en el resto. No hay una IA mejor en todo, así que se reparten por tipo de trabajo.

## Qué IA para qué

| Trabajo | IA recomendada | Por qué |
| --- | --- | --- |
| Código largo, varios archivos, revisión de código, razonamiento sobre el índice | Claude, y la opción de mayor capacidad que ofrezca tu plan | Mantiene bien el contexto en tareas largas y devuelve archivos completos |
| Investigación con fuentes, literatura de análogos, búsquedas en la web | ChatGPT con búsqueda web activada | Útil para encontrar y citar referencias; siempre se verifica el enlace |
| Textos: fichas, guion del pitch, README, microcopy | ChatGPT o Claude, el que tengas | Cualquiera sirve; lo que importa es la revisión humana |
| Ideas visuales, nombre del proyecto, estructura de diapositivas | ChatGPT o Claude | Igual |

**Reparto propuesto:** Claude para Fernando, Sebastián y Dante, que tienen más código y razonamiento largo. ChatGPT para Lian (investigación), Noe y Joel. Si quien tiene Claude es otro, se intercambian las asignaciones: Claude va a quien tenga más código.

En cada plan, elige el modelo de mayor capacidad disponible con razonamiento activado para el índice y el código, y uno rápido para textos.

## Cómo arrancar cada chat

1. Abre un chat nuevo por tarea grande.
2. Pega **todo** `CONTEXT.md`.
3. Pega **tu** archivo `prompts/<tu-nombre>.md`.
4. Si la IA puede leer archivos o el repositorio (por ejemplo Claude Code), indícale la ruta en lugar de pegar.
5. Pega los archivos que tu tarea toca cuando se los pidas.

## Reglas de uso

- **Verifica los datos.** Una IA puede devolver un valor con aspecto creíble que no es real. Todo número que vaya a `data/` lleva su fuente y tú la abriste.
- **Referencias reales.** Abre cada enlace antes de ponerlo en una ficha o en la metodología. Si no abre o no dice lo que la IA afirma, se descarta.
- **Revisión cruzada.** Todo código de IA lo revisa otra persona en el PR antes de integrarlo.
- **Sin secretos.** No pegues claves ni contraseñas en ningún chat.
- **Archivos completos.** Pide siempre el archivo completo con su ruta, no fragmentos.
- **Una tarea por chat.** Si el chat se hace muy largo, abre uno nuevo y vuelve a pegar `CONTEXT.md` y el estado actual.
- **Cuando algo falla,** pega el error completo y el archivo, no una descripción.

## Plantilla para pedir cambios

```
Contexto: te pegué CONTEXT.md y mi prompt de rol.
Estado actual: <qué ya funciona y qué archivos existen>
Lo que necesito ahora: <una tarea concreta>
Archivos que puedes tocar: <rutas>
Criterio de listo: <cómo sabré que funciona>
Devuélveme los archivos completos con su ruta.
```


## Si usan Claude Code o Codex en terminal
Clonan el repo y abren el agente dentro de la carpeta: `CLAUDE.md` (Claude Code) y `AGENTS.md` (Codex) ya le indican leer `CONTEXT.md`, `TASKS.md` y `GIT.md`. Solo pegan el prompt de su persona desde `prompts/<nombre>.md` y dicen quién son.
