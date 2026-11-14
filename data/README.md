# Datos

| Archivo | Dueño | Contenido |
| --- | --- | --- |
| `sites.json` | Dante | Sitios de la Luna y Marte |
| `candidates.json` | Lian | Lugares de la Tierra |
| `examples/` | Sebastián | Datos de demostración **inventados** para probar el pipeline y la web |
| `raw/` | Cada quien | Datos crudos y pesados. No se suben a Git; se comparten por Drive |

El formato exacto está en `CONTEXT.md`, sección 6. Antes de cada commit de datos:

```bash
python pipeline/validate.py
```

Reglas: nunca inventar valores, `null` si falta el dato, y toda variable con valor lleva su fuente en `sources`.

Campos agregados en la versión 2: `known` en los candidatos (`true` si la literatura ya documenta el lugar como análogo) y `tags` en sitios y candidatos (vocabulario cerrado en `CONTEXT.md`, sección 5).
