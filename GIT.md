# Guía de Git para el equipo

Objetivo: que los 6 trabajemos en paralelo sin pisarnos y que `main` siempre esté desplegable.

## 1. Arranque (solo Fernando, una vez)

**Repositorio del equipo:** https://github.com/LuisFernandoGuzmanOporto/Alpha-deploy.git

```bash
cd nasa-earth-analogs        # la carpeta del zip descomprimido
git init -b main
git add .
git commit -m "chore: starter del proyecto"
git remote add origin https://github.com/LuisFernandoGuzmanOporto/Alpha-deploy.git
git push -u origin main
```

Si el repositorio ya trae un commit inicial (por ejemplo un README creado en GitHub), el `push` será rechazado. Antes de subir:

```bash
git pull origin main --allow-unrelated-histories
# si hay conflicto en README.md, quédate con la versión del starter
git push -u origin main
```

GitHub ya no acepta contraseña por HTTPS: usa el inicio de sesión de Git, GitHub CLI (`gh auth login`) o un token personal. Nunca pegues un token en un chat ni en el repositorio. Si el repositorio es público, cualquiera ve el código: no subas claves.

Las opciones A y B de abajo son alternativas por si prefieres crear un repositorio nuevo.


```bash
cd nasa-earth-analogs
git init -b main
git add .
git commit -m "chore: starter del proyecto"

# Opción A, con GitHub CLI
gh repo create nasa-earth-analogs --private --source=. --push

# Opción B, sin CLI: crea el repositorio vacío en github.com y luego
git remote add origin git@github.com:<usuario>/nasa-earth-analogs.git
git push -u origin main
```

Después, en GitHub:

1. Settings, Collaborators: invitar a Dante, Lian, Sebastián, Noe y Joel con permiso de escritura.
2. Settings, Branches: regla para `main` que exige Pull Request antes de integrar (con 1 aprobación si quieres, sin bloquear al administrador).
3. Vercel: importar el repositorio, carpeta raíz `web`, comando `npm run build`, carpeta de salida `dist`. Cada PR genera una vista previa y cada merge a `main` despliega producción.

## 2. Para todos: primera vez

```bash
git clone https://github.com/LuisFernandoGuzmanOporto/Alpha-deploy.git
cd Alpha-deploy
```

## 3. Ciclo de trabajo (se repite todo el día)

```bash
# 1. Parte siempre de main actualizado
git switch main
git pull --ff-only

# 2. Crea tu rama: feat/<nombre>-<tarea>
git switch -c feat/dante-datos-luna-marte

# 3. Trabaja y haz commits pequeños y frecuentes
git add -A
git commit -m "data: sitios lunares versión 1"

# 4. Antes de subir, ponte al día con main
git fetch origin
git rebase origin/main

# 5. Sube tu rama y abre el Pull Request en GitHub
git push -u origin HEAD
```

Si ya habías subido la rama y el rebase la reescribió:

```bash
git push --force-with-lease
```

Solo en **tu** rama. Nunca en `main` ni en la rama de otra persona.

## 4. Reglas

1. **Nada de push directo a `main`.** Todo entra por Pull Request. Excepción: emergencia en el cierre, y la decide Fernando.
2. **PR pequeños.** Idealmente menos de 300 líneas y una sola idea. Integra al menos cada 2 horas; las ramas largas son las que dan conflictos.
3. **Un archivo, un dueño.** La tabla de `CONTEXT.md`, sección 10, dice quién edita qué. Eso elimina casi todos los conflictos.
4. **Revisión rápida.** Quien recibe un PR lo revisa en menos de 15 minutos. Fernando es el revisor por defecto; si no está, cualquiera del equipo puede aprobar.
5. **Antes de abrir un PR de datos,** corre `python pipeline/validate.py` y pega el resultado en el PR.
6. **`main` siempre debe compilar.** Si rompes `main`, tu prioridad número uno es arreglarlo o revertir:

```bash
git revert <hash-del-commit>
```

7. **Sin secretos.** Las claves van en `.env`, que está en `.gitignore`. Usa `.env.example` como guía.
8. **Archivos grandes** (datos crudos, rásters, más de 20 MB) no se suben. Van a `data/raw/` (ignorada por Git) y se comparten por Drive.
9. **Un conflicto no es una crisis.** Si aparece, resuélvelo en tu rama así:

```bash
git fetch origin
git rebase origin/main
# edita los archivos en conflicto, luego:
git add <archivo>
git rebase --continue
```

Si dudas, pide ayuda en el grupo antes de borrar nada.

## 5. Convención de commits

Prefijo y mensaje corto en presente:

| Prefijo | Uso |
| --- | --- |
| `feat:` | Funcionalidad nueva de la web |
| `data:` | Cambios en `data/` o `web/public/data/` |
| `fix:` | Corrección de un error |
| `docs:` | Documentación |
| `style:` | Estilos y diseño, sin cambio de lógica |
| `chore:` | Configuración y tareas de mantenimiento |

Ejemplos: `feat: selector de sitio con mapa`, `data: candidatos de Bolivia versión 1`, `fix: filtro Bolivia ignoraba el ranking`.

## 6. Cuándo actualizarte

- Al empezar cada bloque de trabajo: `git switch main && git pull --ff-only`.
- Antes de abrir cada PR: `git fetch origin && git rebase origin/main`.
- Cuando el grupo avisa "mergeé X": actualiza `main` y haz rebase de tu rama.

## 7. Congelamiento (domingo 07:00)

A partir de las 07:00 solo entran correcciones de errores, aprobadas por Fernando. Se etiqueta la versión final:

```bash
git tag v1.0-entrega
git push origin v1.0-entrega
```

## 8. Comandos de rescate

```bash
git status                  # qué cambió
git log --oneline -10       # últimos commits
git stash                   # guarda cambios sin commitear para cambiar de rama
git stash pop               # los recupera
git restore <archivo>       # descarta cambios locales de un archivo
git switch -                # vuelve a la rama anterior
```
