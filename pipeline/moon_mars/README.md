# Datos de la Luna y Marte (`data/sites.json`)

Dueño: Dante. Scripts con solo la biblioteca estándar de Python. Leen los productos oficiales por HTTP Range, así que no hace falta descargar archivos de cientos de MB.

## Cómo reproducir los valores

```bash
python pipeline/moon_mars/moon_polar.py   # 3 sitios del polo sur lunar, unos 1-2 min
python pipeline/moon_mars/mars_sites.py   # 3 sitios de Marte, unos 1-3 min (depende de la MCD)
python pipeline/validate.py
```

Cada script imprime un JSON con las variables por sitio y algunos datos de control (píxeles, triángulos, tamaño de celda). Esos valores se copian a `data/sites.json` con su fuente en `sources` y el detalle en `notes`.

## Método común

- Ventana de 10 × 10 km en el suelo alrededor del punto (`terrain.WINDOW_KM`).
- `slope_deg`: pendiente media con el método de Horn (3 × 3), solo píxeles interiores.
- `relief_m`: desviación estándar poblacional de la elevación en la ventana.
- `precip_mm_year`: 0 en ambos cuerpos.

## Luna (`moon_polar.py`)

| Variable | Producto | Notas |
| --- | --- | --- |
| Pendiente y relieve | LOLA `LDEM_75S_240M` (LRO-L-LOLA-4-GDR-V1.0), 240 m/px | Estereográfica polar sur |
| Temperatura | Diviner Polar Resource Product sur (LRO-L-DLRE-5-PRP-V2.0), `temp_avg` | Media anual modelada a 2 cm de profundidad |
| Hielo (nota) | Misma tabla de Diviner, `ice_depth` | Fracción de la ventana con hielo estable a 1 m o menos: estabilidad térmica, no detección |
| Albedo | Sin producto | No hay mapa grillado de albedo que cubra el polo en PDS, en el nodo LOLA del MIT ni en PGDA; queda `null` |

Coordenadas: centros de los mosaicos LROC NAC de cada región. La fórmula de `DSMAP_POLAR.CAT` invierte el signo de X en el sur; la orientación correcta (`X = r·sin(lon)`, `Y = −r·cos(lon)`) se verificó contra las altitudes Kaguya de la tabla de Diviner (diferencias menores a 100 m) y el fondo del cráter Shackleton.

## Marte (`mars_sites.py`)

| Variable | Producto | Notas |
| --- | --- | --- |
| Pendiente y relieve | MOLA MEGDR 128 px/grado (MGS-M-MOLA-5-MEGDR-L3-V1.0), unos 463 m/px | Más grueso que los ~250 m del contrato: la pendiente sale suavizada |
| Temperatura | Mars Climate Database v6.2, `tsurf`, escenario climatológico promedio | Media sobre Ls 0-345 (cada 15°) y horas 0-23; valor de modelo |
| Albedo | Mars Climate Database v6.2, `ground_albedo` | Albedo de suelo desnudo del modelo |

Control: MOLA da −4503 m en Bradbury Landing (publicado: −4501 m, Vasavada et al. 2014).
