# Pendientes de Joel (requisitos, pitch, QA y entrega)

Estado revisado sobre `main` en `2517734` (14/11/2026). Fuente de las tareas originales: `TASKS.md`. Marca tus casillas en tu propio PR.

Ya entregado: J-1 (requisitos), J-2 (README y atribución), J-4b (informe) y la segunda pasada de QA (PR #46, abierto).

## Antes de empezar

1. `git checkout main && git pull`
2. Rama propia: `git checkout -b feat/joel-<tarea>`

## Pendientes

- [ ] **J-3, QA:** fusionar el PR #46 (segunda pasada). Falta la pasada de las 07:00 sobre producción, cuando exista la URL de Vercel. Los bugs van como issues de GitHub.
- [ ] **J-4, pitch (`docs/PITCH.md`):**
  - [x] Cifras contrastadas con `results.json` el 14/11 y corregido el orden de Ojos del Salado y Socompa.
  - [ ] Confirmar los oradores propuestos: Joel en la apertura y Noe en límites e impacto.
  - [ ] Poner la URL de Vercel donde dice `[PENDIENTE: URL de Vercel]`.
  - [ ] Revisar la ortografía en inglés.
  - [x] PDF de las 7 diapositivas en `docs/demo/earth-analogs-demo.pdf`.
  - [ ] Revisarlo con el equipo (nombres completos y nombre del equipo en la diapositiva 1) y subirlo a Google Drive con acceso "cualquiera con el enlace".
  - [x] Capturas del rediseño nuevo: pantalla principal, "Solo Bolivia", comparador, descubrimientos y globo (`docs/demo/img/`).
  - [ ] Captura de la metodología y la del comparador completo: los textos de los datos ya están en inglés (#25), falta regenerar las capturas.
- [ ] **J-5, video y ensayo:** grabar el video de respaldo con el recorrido de la sección 5 del pitch y ensayar 3 veces con el equipo (Sebastián hace de jurado). Cronometrar contra el tiempo de la sede.
- [ ] **J-6, lista de entrega (`docs/ENTREGA.md`):**
  - [ ] Los 6 integrantes registrados en la sede Cochabamba, sin lista de espera, y visibles en la pestaña Members.
  - [ ] Cada integrante revisó su "Full Name" en el perfil.
  - [ ] Demo subida a Drive o YouTube con acceso público; probar el enlace, la web y el repositorio en ventana privada y desde un teléfono con datos móviles.
  - [ ] Llenar el formulario en inglés; quitar o completar todos los `[PENDING: …]` (por ejemplo la URL de Vercel).
  - [ ] Subir de 1 a 3 imágenes (JPG, PNG o GIF de hasta 10 MB).
  - [ ] Marcar "Terms and Conditions" y "Confirm All Work is Original", pulsar **Submit for Judging** y pasar al grupo la captura del banner.
  - [ ] Confirmar con la sede que el proyecto figura como cargado y dejar lista la laptop con el build local, el video de respaldo y el adaptador HDMI.
  - [ ] Opcional: clasificar la URL en FortiGuard Web Filter.
- [ ] **Inglés (#25):** la web ya está en inglés; revisar que el formulario y todo el material enlazado también lo estén.

## Reglas

- Ningún menor de 18 años en imágenes, video o audio, y ningún logo de NASA.
- No presentar Uyuni, Coipasa ni Licancabur como "descubrimientos": ya están documentados como análogos de Marte.
- Un PR pequeño por cambio y `git pull --rebase` antes de subir. Nunca subas directo a `main`.
