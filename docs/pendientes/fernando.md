# Pendientes de Fernando (líder técnico, interfaz y mapa)

Estado revisado sobre `main` en `2517734` (14/11/2026). Fuente de las tareas originales: `TASKS.md`.

Ya entregado: la web completa (selector, mapa, ranking, filtros, comparador, descubrimientos, metodología, pesos, globo, selector ES/EN) y el rediseño de centro de control (#45).

## Pendientes

- [ ] **F-1, Vercel (bloqueante):** conectar el proyecto con carpeta raíz `web` y obtener la URL pública. `web/vercel.json` ya existe.
- [ ] **Probar la URL de producción:** en ventana privada, desde un teléfono con datos móviles y recargando dentro de `/comparar/...` para comprobar la regla de `vercel.json`.
- [ ] **PR #46 de Joel:** revisar y fusionar.
- [ ] **Decidir el inglés (#25):** traducir los textos de los datos con campos `*_en` (regiones de Dante, nombres, países y notas de Lian, metodología de Sebastián) o aceptar el aviso de la interfaz. Después, repartirlo.
- [ ] **Etiqueta de versión final** y congelamiento de código a las 07:00.
- [ ] **Actualizar `TASKS.md`:** casi todas las casillas están sin marcar aunque el trabajo está hecho.
- [ ] **F-5, revisar los PRs que lleguen** y mantener `main` siempre desplegable.
- [ ] **Rendimiento (opcional):** el paquete principal subió de 270 KB a 592 KB con el rediseño; se puede dividir en trozos.
- [ ] **Pruebas pendientes con Noe:** lector de pantalla, zoom al 200 % y "reducir movimiento" real del sistema.

## Reglas

- Un PR pequeño por cambio y `git pull --rebase` antes de subir. Nunca subas directo a `main`.
