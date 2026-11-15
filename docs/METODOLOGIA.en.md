# Methodology of the similarity index

> English version of `docs/METODOLOGIA.md`. If the two ever differ, the Spanish text is the original; keep them in sync.

## 1. Purpose

The index ranks places on Earth by their similarity to a candidate site on the Moon or Mars in five variables of terrain, temperature, aridity and reflectivity. Each result shows which variables could be compared and how much they differ. The ranking guides the search for places where to study processes or rehearse operations, and it is read together with the fact sheets, the qualitative matches and the limitations of each analogy.

## 2. Variables and their physical rationale

| Variable | What it measures | Why it matters | Source used on Earth | Source used on the Moon and Mars |
| --- | --- | --- | --- | --- |
| `slope_deg` | Mean slope of the terrain, in degrees | Helps compare the steepness of the terrain for mobility and siting. | Mapzen Terrain Tiles (sources per tile in each record); Copernicus DEM GLO-30 at McMurdo, Svalbard, La Corona and Manjanggul | LOLA `LDEM_75S_240M` on the Moon and MOLA MEGDR at 128 pixels/degree on Mars |
| `relief_m` | Standard deviation of the elevation in the window, in meters | Describes the vertical variation of the terrain at local scale. | The same elevation model | The same elevation products |
| `temp_mean_c` | Mean annual temperature in °C, with a subsurface approximation on the Moon | Compares the mean thermal environment relevant to equipment and materials. | NASA POWER, surface temperature | Diviner Polar Resource Product south, `temp_avg` modeled at 2 cm on the Moon. Mars Climate Database (MCD) v6.2, `tsurf` modeled surface on Mars. |
| `precip_mm_year` | Mean annual precipitation, in mm/year | Tells terrestrial environments apart by aridity according to precipitation. | NASA POWER, corrected precipitation | Zero by convention of the index, which compares the input from rain |
| `albedo` | Fraction of solar radiation reflected by the surface, from 0 to 1 | Helps compare how the surface interacts with sunlight. | NASA POWER, `ALLSKY_SRF_ALB` (CERES) | Moon: `null`, no comparable gridded map for the polar windows. Mars: `ground_albedo` of MCD v6.2, bare-soil albedo of the model. |

Each non-null value requires a source in `sources` with the product and its reference. `notes` documents the extraterrestrial coordinate system, the extraction method and, where relevant, the resolution, the period or the reason for a missing value. A value whose coverage or definition prevents comparing it is recorded as `null`.

## 3. Common scale

The target window for slope and relief is 10 × 10 km, with a reference resolution of about 250 m per pixel. For the available data the native resolution was kept: LOLA at 240 m on the Moon and MOLA at about 463 m on Mars. In both windows the mean slope is computed with Horn's method (3 × 3, on interior pixels) and the relief as the population standard deviation of the elevation. MOLA's coarser grid smooths the slope and can reduce the observed relief. Resampling to 250 m would not recover that detail. Absolute elevations depend on different reference levels on each body.

For four terrestrial places (McMurdo Dry Valleys, Svalbard, La Corona and Manjanggul) the Mapzen tiles only had coarse global models or marine bathymetry, so slope and relief are computed with Copernicus DEM GLO-30 (ESA, 30 m), sampled at 250 m with the same method. Where the window includes sea (15.5 % at Svalbard, 16.0 % at Manjanggul and 51.7 % at La Corona) the model gives 0 m over water, so it is excluded: relief uses only land points (elevation above 1 m) and slope only the points whose whole neighborhood is land. The reader and the method were validated against six places already computed with Terrain Tiles: slopes agreed within 0.22° and reliefs within 2.4 m.

The thermal and radiometric variables may come from products with footprints larger than the window or with uneven temporal coverage. The effective area and the period represented are recorded. The common topographic window makes it possible to compare the same extent, with different effective resolution.

## 4. Formula

1. We apply the natural logarithm of `1 + x` to `relief_m` and `precip_mm_year`, with the values in their agreed units. This preserves zero and reduces the influence of large differences in the tails. The other variables keep their units before being normalized by minimum and maximum.

   - `slope_deg` measures an angle relative to the horizontal. A difference of 5° represents the same angular separation anywhere in the range. The index compares that geometry, and real mobility also depends on the vehicle, the traction and the gravity. [Definition of slope, USGS](https://www.usgs.gov/educational-resources/determine-percent-slope-and-angle-slope).
   - `temp_mean_c` compares differences in mean temperature in °C. A difference of 10 °C equals 10 K across the whole range. The linear calculation gives the same difference when the data are expressed in kelvin, because the shift of the zero cancels out when subtracting. [Temperature intervals, NIST](https://physics.nist.gov/cuu/Units/register2.html).
   - `albedo` is already a fraction bounded between 0 and 1. Under comparable definitions and conditions, a difference of 0.05 equals five percentage points of the incident radiation reflected, whatever the starting albedo. [Surface albedo, NASA](https://power.larc.nasa.gov/docs/methodology/data/derived/derived-parameters/).
2. For each variable we compute the minimum and the maximum of the values available in the whole catalog, including sites and candidates, after the transformation. We normalize with `(value − minimum) / (maximum − minimum)`. If the range is zero, the code returns zero for all the values present. If the value is missing, it is omitted.
3. For each pair, we compute the absolute difference between the normalized values of the variables available in both records. The pair enters the ranking with at least three shared variables.
4. The distance is the sum of the differences multiplied by their weights, divided by the sum of the weights of the shared variables. The score is `100 × (1 − distance)` and is exported rounded to one decimal. `n_vars_used` and `norm_diff` (to four decimals) are also exported. The ranking sorts by rounded score and, in case of a tie, keeps the input order.
5. The qualitative matches are shown next to the score. If both sites have documented tags, `tag_overlap` reports the Jaccard index, which divides the number of shared tags by the total number of distinct tags of the pair. If one of them lacks tags, it returns `null`.

## 5. Weights

Each variable starts with weight 1. It is a reproducible reference while the sensitivity of the ranking is evaluated and there is no calibration per mission objective (the profiles below are examples, not a calibration). Two terrain variables can add influence if they are correlated. Availability also changes the effective weight, since the average includes only the shared variables. Keeping the tags out of the score avoids giving the same meaning to a measured difference and to a difference in the available documentation.

### Mission goal profiles

In "Filters", four buttons set the five weights according to the goal of a test. They are **example profiles**, not a scientific calibration: they make explicit which variable matters most for each question and can be shared with the `pesos` URL parameter (the active profile is inferred by comparing the weights with the list in `web/src/lib/profiles.ts`).

| Profile | Slope | Relief | Temperature | Precipitation | Albedo | Rationale |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Equal (default) | 1 | 1 | 1 | 1 | 1 | Reference of the index |
| Rover mobility | 3 | 3 | 0.5 | 0.5 | 1 | Terrain decides whether a vehicle can pass and how it navigates; albedo changes camera lighting |
| Power and thermal systems | 1 | 1 | 3 | 0.5 | 2 | Temperature dominates and albedo sets how much radiation the surface absorbs |
| Water and ice | 0.5 | 0.5 | 2 | 3 | 1 | Aridity and cold decide whether water or ice can persist |

First place with each profile (computed from the normalized differences in `results.json`):

| Site | Equal | Mobility | Power | Water and ice |
| --- | --- | --- | --- | --- |
| Faustini Rim A | McMurdo (62.7) | Mauna Kea (85.4) | McMurdo (52.4) | Gilf Kebir (59.8) |
| Peak Near Cabeus B | McMurdo (72.1) | McMurdo (90.5) | McMurdo (65.9) | Gilf Kebir (64.2) |
| Malapert Massif | McMurdo (72.2) | McMurdo (91.3) | McMurdo (65.4) | Gilf Kebir (63.8) |
| Jezero | Atacama-Yungay (82.1) | Laguna Colorada (90.4) | Laguna Colorada (81.7) | Gilf Kebir (82.2) |
| Gale | Atacama-Yungay (83.8) | Laguna Colorada (90.0) | Atacama-Yungay (81.1) | Gilf Kebir (83.8) |
| Arcadia Planitia | Gilf Kebir (76.9) | Dasht-e Kavir (91.1) | Coipasa (75.3) | Gilf Kebir (78.2) |

With "Water and ice", Gilf Kebir rises because its NASA POWER cell gives 0.0 mm/yr; that zero is a value of the regional product, not a local measurement. On the Moon albedo has no value, so its weight does not change those rankings.

## 6. Sensitivity and validation

The initial reference is minimum–maximum over the joint catalog. An extreme lunar temperature widens the range and reduces the thermal separation among the other records. The comparison with a quantile-based variant has still not been carried out. With few observations, quantiles are unstable and trimming can hide relevant differences at the poles.

### Sensitivity results (S-3)

47 candidates and six sites were evaluated with the catalog of this delivery, in which every candidate shares at least three variables with every site. The 60 weight tests change one variable at a time by ±50 %. The other 30 remove one variable and again require at least three shared values. The displacement is computed among candidates present in both rankings. The top 5 is taken from the overall ranking, with the input order as tie-breaker for rounded scores.

| Site | ±50 %: shared top 5 (min–max) | ±50 %: largest mean / individual displacement | Omission: shared top 5 (min–max) | Omission: largest mean / individual displacement |
| --- | ---: | ---: | ---: | ---: |
| Faustini Rim A | 3–5 | 2.30 / 14 | 3–5 | 5.49 / 22 |
| Peak Near Cabeus B | 4–5 | 1.83 / 12 | 2–5 | 4.26 / 20 |
| Malapert Massif | 3–5 | 1.87 / 13 | 3–5 | 4.13 / 21 |
| Jezero | 4–5 | 3.19 / 10 | 2–5 | 6.77 / 29 |
| Gale | 4–5 | 3.23 / 14 | 3–4 | 7.32 / 33 |
| Arcadia Planitia | 4–5 | 2.13 / 9 | 3–5 | 4.21 / 17 |

With weight changes, 58 of 60 tests kept at least four names of the top 5 and 38 kept all five. The exceptions were Faustini with precipitation at +50 % and Malapert with precipitation at −50 %. Omissions kept at least four names in 19 of 30 tests. Removing slope left only two names at Peak Near Cabeus B, and removing precipitation, at Jezero. At Gale, removing slope moved one candidate up to 33 positions in the ranking. With the full catalog, no test makes candidates enter or leave the ranking. The missing lunar albedo explains why changing or removing its weight leaves the lunar rankings unchanged.

Equal weights are kept as the reference. To interpret candidates with close scores, it helps to look at their coverage and at whether they stay on top when a variable is removed. The influence of thermal extremes on the min–max scale remains a limitation. The test does not compare alternative normalizations.

| Synthetic control with equal terrain and albedo | Scores compared | Result |
| --- | ---: | --- |
| Cold and dry versus warm and wet | 85.8 / 60.0 | Expected order |
| Lower precipitation at equal temperature | 75.1 / 60.0 | Expected order |
| Smaller thermal difference at equal precipitation | 70.7 / 60.0 | Expected order |

### Validation by body and less-studied candidates (S-6)

The validation uses `known: true` and requires that `analog_for` includes the body of the site. The count of less-studied candidates uses `known: false` within the overall top 5. The index compares the pairs with sufficient coverage, regardless of `analog_for`. This distinction matters on the Moon, where McMurdo and Laguna Verde, known as Mars analogs, hold places in the lunar top 5.

| Site | Pairs | Known analogs of the body in the top 5 | Less-studied candidates in the top 5 (rank and score) |
| --- | ---: | --- | --- |
| Faustini Rim A | 47 | 0 of 7 | 1: Uturuncu (4th, 57.3) |
| Peak Near Cabeus B | 47 | 0 of 7 | 2: Socompa (4th, 62.0) and Sajama (5th, 60.6) |
| Malapert Massif | 47 | 0 of 7 | 2: Socompa (4th, 62.0) and Pamir (5th, 60.8) |
| Jezero | 47 | 3 of 26: Atacama-Yungay (1st, 82.1), Gilf Kebir (2nd, 80.9) and Tibesti (3rd, 80.2) | 2: Siloli (4th, 79.5) and Harrat Khaybar (5th, 79.3) |
| Gale | 47 | 3 of 26: Atacama-Yungay (1st, 83.8), Gilf Kebir (2nd, 83.3) and Tibesti (3rd, 79.0) | 2: Siloli (4th, 79.0) and Laguna Colorada (5th, 78.1) |
| Arcadia Planitia | 47 | 3 of 26: Gilf Kebir (2nd, 76.9), Qaidam (4th, 75.8) and Coipasa (5th, 74.5) | 2: Dasht-e Kavir (1st, 76.9) and Taklamakan (3rd, 76.9) |

In the lunar rankings (47 pairs each), the 7 known lunar analogs stay far from the top 5: Mauna Kea between 12th and 17th, Pinacate between 15th and 17th, La Corona 20th, Askja 26th, Lava Beds 27th, El Malpais 33rd and Undara 39th. The largest normalized differences of those pairs are temperature or precipitation. Documented analogs may be useful for geological processes, such as volcanism or lava tubes, that are outside the score. On Mars, the 26 relevant known analogs enter the ranking and three of them lead Jezero and Gale. McMurdo, documented as a Mars analog, ranks 45th or 46th on Mars, but leads all three lunar sites (72.1 at Peak Near Cabeus B, 72.2 at Malapert and 62.7 at Faustini) because of its slope (15.3°), relief (418 m) and cold (−26.7 °C, the lowest in the catalog). Terrestrial albedo includes snow, water and vegetation, while the Martian one describes bare ground. The validation supports the Martian ranking and leaves the lunar one unconfirmed.

The hyper-arid core of the Atacama, with the point of the Yungay sampling pit (Azua-Bustos et al. 2020), leads Jezero and Gale: its normalized slope and relief differences do not exceed 0.12 at either site and its albedo difference is 0.01 at Gale. Gilf Kebir, documented as a Mars analog in NASA report CR-3611 (El-Baz and Maxwell, 1982), is second at both, with 0.0 mm/yr in the regional NASA POWER product; that zero is a value of the product and does not prove a local absence of rain. At Arcadia, Dasht-e Kavir and Taklamakan have normalized slope differences below 0.004 and relief differences below 0.045, although their thermal differences are around 0.49–0.52. Siloli is fourth at Jezero and Gale, with normalized albedo differences below 0.07 and relief differences below 0.10. On the Moon, Ojos del Salado and Socompa stay near the top at more than one site because of terrain similarity, while the thermal difference of those pairs exceeds 0.65.

The less-studied candidates hold 11 of the 30 places of the overall top 5, counting repeats across sites (12 before the audit). The catalog assigned `known: false` from a preliminary literature search that failed several times: Gilf Kebir changed to `known: true` because Crossref does not index NASA technical reports, where it does appear; Ojos del Salado, because of two 2020 *Astrobiology* articles (doi:10.1089/ast.2018.2021 and doi:10.1089/ast.2019.2024); and the final-phase audit (`docs/AUDITORIA_KNOWN.md`) changed Laguna Verde, Rub' al Khali, Lava Beds, El Malpais, Lake Eyre and Undara to known. The 19 that remain less studied have no publication found that uses them as a Moon or Mars analog; that does not prove none exists. These results help prioritize the review of candidates. Jaccard remains a separate indicator to contrast documented processes. Terrestrial climatology is regional, so the comparison must be checked before attributing a similarity to a specific field location.

## 7. Limitations

- The score is relative to the catalog and to the shared variables. Adding records can change the ranges and the scores of pairs already computed. Two pairs with the same score can have different coverage. `n_vars_used` indicates how many variables contribute, and `norm_diff` makes it possible to check which ones.
- The thermal reference of the contract is the mean annual surface temperature. For the Moon, Diviner's `temp_avg` is provisionally accepted as an approximation close to the surface. It is an annual mean modeled at 2 cm depth and that difference can bias the comparison between bodies. On Mars, MCD v6.2 `tsurf` is a modeled surface temperature, averaged over local hours 0–23 and solar longitude Ls values from 0° to 345° every 15°, without weighting the duration of the seasons. The extreme temperatures of the permanently shadowed lunar regions can produce large differences even with the best terrestrial candidates.
- The albedo comparison depends on the spectral band, the illumination and observation geometry, and the definition of the product. Reflectance in a single band is not equivalent to broadband solar albedo. The three lunar sites have `albedo: null`. Their comparisons use at most four variables, and albedo discriminates only in pairs with Mars when the terrestrial candidate has that value.
- At four places (McMurdo, Svalbard, La Corona and Manjanggul) slope and relief come from Copernicus DEM GLO-30, a 30 m surface model, and not from Terrain Tiles; at three of them they are computed with land points only because the window includes sea. They are less comparable with the rest, and in Antarctica the surface model includes the ice.
- Precipitation represents one aspect of aridity. The conventional zero for the Moon and Mars does not describe ice, frost, vapor or water availability. The index also does not directly measure gravity, the lunar vacuum, the Martian atmosphere, radiation, illumination, regolith, dust or communications. The fact sheets must explain what each analogy is useful for and where it stops being valid.

## 8. Sources

- Earth — [Mapzen Terrain Tiles](https://registry.opendata.aws/terrain-tiles/) and [NASA POWER climatology](https://power.larc.nasa.gov/docs/services/api/temporal/climatology/) (TS, PRECTOTCORR and ALLSKY_SRF_ALB).
- Moon — [LOLA LDEM_75S_240M](https://pds-geosciences.wustl.edu/lro/lro-l-lola-3-rdr-v1/lrolol_1xxx/data/lola_gdr/polar/img/ldem_75s_240m.img) and [Diviner Polar Resource Product south](https://pds-geosciences.wustl.edu/lro/urn-nasa-pds-lro_diviner_derived1/data_derived_prp/dlre_prp_south.tab).
- Earth (McMurdo, Svalbard, La Corona and Manjanggul) — [Copernicus DEM GLO-30](https://registry.opendata.aws/copernicus-dem/) of ESA and the European Union.
- Mars — [MOLA MEGDR at 128 pixels/degree](https://pds-geosciences.wustl.edu/missions/mgs/megdr.html) and [Mars Climate Database v6.2](https://www-mars.lmd.jussieu.fr/mcd_python/).

## 9. Global scan (S-7)

The global scan on a 2° grid is discarded for this delivery. There is no validated data route that covers land and obtains comparable variables without massive downloads. The scan remains as possible future work. This delivery publishes the rankings of the catalog of 47 candidates and does without `scan.json`.
