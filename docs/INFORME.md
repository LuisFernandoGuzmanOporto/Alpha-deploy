# Earth Analogs: which places on Earth resemble the Moon and Mars, and where they don't

*Public report. NASA Space Apps Challenge 2026, Cochabamba, Bolivia. Challenge: Identify Earth Locations that Analog the Permanent Moon Base Locations and Mars.*

> **Version 1 results**, computed on Saturday 14 November 2026 from the data in commit `fe45e52` (6 Moon and Mars sites, 47 Earth candidates). The team's validation is still in progress, and the numbers may change as data are added. *Resumen en español al final.*

## Why look for analogs on Earth

Before a rover, an instrument or a crew goes to the Moon or Mars, it is tested on Earth, in deserts, volcanic fields, polar regions and caves that share some of the conditions of the target. The challenge itself notes that well-known analogs such as the Atacama Desert, Haughton Crater and Death Valley "are not entirely well characterized", and no place on Earth reproduces another world. So the useful question is not "which place looks like Mars?" but **"what is each place good for, and where does it fail?"**

## What we measured

We compared each candidate landing or base site with Earth locations using **five variables measured in the same 10 × 10 km window**:

| Variable | Moon | Mars | Earth |
| --- | --- | --- | --- |
| Slope and local relief | LRO LOLA elevation, 240 m pixels | MGS MOLA elevation, ~463 m pixels | SRTM elevation (Terrain Tiles on AWS), 250 m |
| Mean annual temperature | LRO Diviner thermal model (2 cm depth) | Mars Climate Database v6.2, surface | NASA POWER, surface ("skin") temperature |
| Aridity (annual precipitation) | 0 by definition | 0 by definition | NASA POWER, corrected precipitation |
| Albedo (reflectivity) | Not available for the polar sites | Mars Climate Database v6.2 | NASA POWER (CERES) |

Each value is normalized to a 0–1 scale across all places, and the score is **100 × (1 − the average difference)** over the variables both places have (at least three). Geology, ice and dust tags are compared separately. Every value cites its source; missing values are left empty, never estimated. Full method: `docs/METODOLOGIA.md`.

## The six target sites

| Site | Body | Slope | Relief | Mean temperature | Why it matters |
| --- | --- | --- | --- | --- | --- |
| Faustini Rim A | Moon, 87.8° S | 10.9° | 496 m | −160 °C | On the rim of a permanently shadowed crater; in NASA's 2022 list of Artemis III regions |
| Peak Near Cabeus B | Moon, 83.6° S | 15.1° | 512 m | −126 °C | Current Artemis III candidate region, next to the crater where LCROSS detected water |
| Malapert Massif | Moon, 86.0° S | 15.2° | 456 m | −129 °C | Current Artemis III candidate region on a high mountain massif |
| Jezero crater | Mars, 18.4° N | 1.4° | 63 m | −49 °C | Perseverance landing site: an ancient lake and river delta |
| Gale crater | Mars, 4.6° S | 1.4° | 60 m | −51 °C | Curiosity landing site: clay-bearing lake sediments |
| Arcadia Planitia | Mars, 49.0° N | 0.2° | 4 m | −78 °C | Very flat northern plain with widespread ground ice |

## What we found

**For the Moon, the best matches are high, steep, dry Andean terrain.** Volcán Licancabur, on the Bolivia–Chile border, ranks **first for Peak Near Cabeus B and Malapert Massif** (score 69.8). Volcán Ojos del Salado (63.3) and Volcán Socompa (62.0), both less studied as analogs, follow. For Faustini Rim A the top match is the hyper-arid core of the Atacama Desert near Yungay (62.7). These places match the slopes and relief of the lunar polar massifs and are among the driest on Earth.

**For Mars, the best matches are flat, hyper-arid desert plateaus, several of them rarely used as analogs.** The Gilf Kebir plateau (Egypt and Libya), not documented as a planetary analog in the literature we reviewed, ranks **first for Jezero (80.8) and Gale (83.2)**. The Tibesti Mountains (Chad), a known analog, are second for both. For Arcadia Planitia, the extremely flat Taklamakan Desert (76.9) and Dasht-e Kavir salt desert (76.8) lead.

**Bolivia appears in every top 5.**

| Site | Best Bolivian analog | Rank | Score |
| --- | --- | --- | --- |
| Peak Near Cabeus B | Volcán Licancabur | 1 | 69.8 |
| Malapert Massif | Volcán Licancabur | 1 | 69.8 |
| Faustini Rim A | Volcán Licancabur | 2 | 60.6 |
| Jezero crater | Siloli Desert ("Árbol de Piedra") | 3 | 79.4 |
| Gale crater | Siloli Desert ("Árbol de Piedra") | 3 | 78.9 |
| Arcadia Planitia | Salar de Coipasa | 5 | 74.5 |

The Siloli Desert and Laguna Colorada, both in the top 5 for Jezero and Gale, are less studied as analogs than the nearby Atacama. They are reachable high-altitude places where rovers and instruments could be tested in cold, dry, wind-swept terrain.

**One unexpected result:** Licancabur is documented in the literature as a **Mars** analog (its summit lake), yet by terrain it is our closest match to the lunar south pole massifs.

## Where the analogy breaks down

- **Temperature is the largest gap for the Moon.** The coldest Earth candidate with data averages −27 °C; the lunar sites average −126 to −160 °C. In most lunar comparisons it is the largest single difference. No place on Earth reproduces the cold of permanently shadowed regions.
- **Even the "driest" Earth places get rain.** The Moon and Mars have zero precipitation; Licancabur gets ~29 mm a year and the Siloli Desert ~40 mm. Precipitation is the most common weak point among the Mars matches.
- **Coverage shapes the ranking.** The McMurdo Dry Valleys of Antarctica, a classic analog, have no elevation data in our source (it does not cover Antarctica). With the lunar albedo also missing, they fall below the three-variable minimum and **drop out of the lunar ranking entirely**, together with three other candidates.
- **What no Earth analog can reproduce:** reduced gravity, the lunar vacuum, the thin Martian atmosphere and the radiation environment. A good score means similar terrain and climate, not similar conditions for a spacecraft or a crew.

## Does the index agree with known analogs?

Partly, and we report it as it is.
- **Mars:** the best known analog (Tibesti) ranks **second** for Jezero and Gale, and others such as the Lut Desert and the Mars Desert Research Station (Utah) are in the top 10 for Jezero.
- **Moon:** the places the literature already uses as **lunar** analogs (El Pinacate, Mauna Kea, Askja) rank only **14th, 16th and 23rd** out of 43. They are much wetter and warmer than the polar massifs.

This suggests the index captures terrain and dryness, while **lunar analogs are probably chosen for properties our five variables do not measure**, such as rock type or soil. Before treating the less-studied matches as discoveries, the team still has to check them against the qualitative tags and the literature.

## How this helps exploration, and what's next

The tool turns "this looks like Mars" into a measured, explainable comparison. A mission team can see which Earth places match a target site in slope, relief and dryness, which is useful for testing mobility, navigation and instruments, and exactly which conditions each place cannot provide. Next steps:
- Add the missing lunar albedo and Antarctic elevation data.
- Add variables for rock type and soil.
- Run a coarse global scan to find analogs outside our hand-picked list.
- Validate the top matches in the field, starting with the Bolivian Altiplano.

**Data and credits:** NASA LRO (LOLA, Diviner, LROC), MGS MOLA, NASA POWER, NASA GIBS, Moon Trek and Mars Trek; Mars Climate Database (LMD, ESA, CNES); SRTM via Terrain Tiles on AWS; OpenStreetMap. Full list: `docs/ATRIBUCION.md`.

---

### Resumen en español

Comparamos 6 sitios candidatos de la Luna y Marte con 47 lugares de la Tierra usando cinco variables medidas en la misma ventana de 10 × 10 km.
- **Luna:** los mejores análogos son volcanes altos, empinados y secos de los Andes. El **Licancabur (Bolivia–Chile)** es el primero para Peak Near Cabeus B y Malapert Massif.
- **Marte:** ganan mesetas desérticas planas y muy áridas, varias poco estudiadas, como **Gilf Kebir**.
- **Bolivia:** aparece en el top 5 de los seis sitios (Licancabur, Siloli, Laguna Colorada y Coipasa).

La analogía falla sobre todo por la **temperatura**: ningún lugar de la Tierra se acerca a los −126 a −160 °C del polo sur lunar. También fallan la **lluvia** y lo que la Tierra no puede reproducir: gravedad, vacío, atmósfera y radiación. Los análogos lunares que ya usa la literatura quedan lejos del primer lugar, lo que muestra que se eligen por razones que nuestras cinco variables no miden. Son resultados de la versión 1 y la validación del equipo sigue en curso.
