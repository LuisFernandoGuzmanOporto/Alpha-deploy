# Earth Analogs — nebulosa

## Overview

Dirección vigente solicitada por Noe: cielo espacial inspirado en su referencia, con
oscuridad azul casi negra, estrellas frías y nubes de polvo azul, violeta y cobre.
Sustituye la exploración pictórica de Van Gogh. El fondo también aparece en el navbar,
detrás de marca, navegación e idioma. Público: visitantes y jurado de Earth Analogs.

## Colors

Fuente canónica: `web/src/styles/tokens.css`; alias `--ea-*` derivados sin copias.
Fondo #02040E, profundidad #000107. Superficies #0B1429, #13213A, #20324D.
Texto #FFF8E9, secundario #C0CCE4; acciones #94D9FF, hover #C8EDFF, tinta #142243.
Nebulosa raster original en styles/nebula-stardust.jpg: polvo dorado/naranja con filamentos violetas y luces celestes. Velos #02040E99 a #02040E80 para lectura; navbar #02040EB3. El token --cc-nebula-image es la única referencia de la textura.
Estrellas blancas y celestes, con algunas cálidas y violetas. Los índices conservan
números, escala y colores cálidos; no se introducen umbrales científicos.
## Typography

Se conserva Segoe UI Variable / Segoe UI / system-ui para lectura y Cascadia Mono /
ui-monospace para datos. Tamaños, pesos y espaciado siguen los tokens existentes.
Sin nuevas fuentes ni solicitudes externas. Español e inglés mantienen el sistema actual.

## Layout

Se conserva la navegación y la disposición responsive existente, incluidos sus paneles
con scroll. El cielo compartido vive en Layout, fuera del flujo, sin capturar clics ni
teclado. No ocupa espacio. El mapa tiene un margen de 16 px y marco celeste #719CC2
con sombra y halo tenues para distinguirlo del fondo. Conserva su altura responsive,
sus controles y atribuciones; la nueva separación se aplica también en móvil.

## Elevation & Depth

Textura generada con image_gen, con filamentos orgánicos y polvo detallado, en lugar de masas difusas SVG. Ver NEBULA-ASSET.md para procedencia y prompt. Campo determinista de 560 estrellas por cielo; puntos pequeños
estáticos y 25 estrellas grandes con destellos en cruz y halos. Halos de 8 px y titileo reforzado de opacidad entre 0.12 y 1,
desfasado en ciclos de 5 a 8 segundos. Sin animar filtros, nubes o posición.
Con prefers-reduced-motion las estrellas quedan estáticas. Decoración aria-hidden,
sin eventos de puntero, oculta en impresión y colores forzados.
El navbar reutiliza la textura con otro encuadre y una capa oscura para conservar
contraste incluso al hacer scroll. Los menús mantienen superficies sólidas.
## Shapes

Se conservan radios de 4 y 8 px y bordes finos del sistema existente.

## Components

Propiedad canónica: Layout / OrbitalSky en `web/src/components/ui/index.tsx`;
tema y scrollbars globales en `web/src/styles/app.css`; tokens en `tokens.css`.
Radix Select y los controles existentes conservan su comportamiento y proveedor de idioma.
Inicio, Comparar, Descubrimientos y Metodología consumen el mismo tema.
No se modifican datos, cálculos ni filtros.

## Do's and Don'ts

- Mantener contraste de texto 4.5:1 y foco visible; verificar con las pruebas de tokens.
- Mantener estrellas tenues y fuera de los paneles de lectura.
- No añadir flashes rápidos, parallax ni dependencias para decoración.
- No representar las constelaciones ilustrativas como observaciones o datos científicos.
- No usar el color como única señal de selección o puntuación.

## Copia del diseño anterior

El ZIP `C:/Users/gonza/Documents/NasaSpace-copias/Earth-Analogs-orbital.zip`
conserva el proyecto completo con el tema orbital anterior y su captura, sin node_modules,
dist ni .git. Para ejecutarlo: extraer, abrir web, ejecutar npm ci y npm run dev.
