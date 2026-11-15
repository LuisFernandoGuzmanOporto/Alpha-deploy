# Methodology of the similarity index

> English version of `docs/METODOLOGIA.md`. If the two ever differ, the Spanish text is the original; keep them in sync.

## 1. Purpose

The index ranks places on Earth by their similarity to a candidate site on the Moon or Mars in five variables of terrain, temperature, aridity and reflectivity. Each result shows which variables could be compared and how much they differ. The ranking guides the search for places where to study processes or rehearse operations, and it is read together with the fact sheets, the qualitative matches and the limitations of each analogy.

## 2. Variables and their physical rationale

| Variable | What it measures | Why it matters | Source used on Earth | Source used on the Moon and Mars |
| --- | --- | --- | --- | --- |
| `slope_deg` | Mean slope of the terrain, in degrees | Helps compare the steepness of the terrain for mobility and siting. | Mapzen Terrain Tiles (sources per tile in each record) | LOLA `LDEM_75S_240M` on the Moon and MOLA MEGDR at 128 pixels/degree on Mars |
| `relief_m` | Standard deviation of the elevation in the window, in meters | Describes the vertical variation of the terrain at local scale. | The same elevation model | The same elevation products |
| `temp_mean_c` | Mean annual temperature in °C, with a subsurface approximation on the Moon | Compares the mean thermal environment relevant to equipment and materials. | NASA POWER, surface temperature | Diviner Polar Resource Product south, `temp_avg` modeled at 2 cm on the Moon. Mars Climate Database (MCD) v6.2, `tsurf` modeled surface on Mars. |
| `precip_mm_year` | Mean annual precipitation, in mm/year | Tells terrestrial environments apart by aridity according to precipitation. | NASA POWER, corrected precipitation | Zero by convention of the index, which compares the input from rain |
| `albedo` | Fraction of solar radiation reflected by the surface, from 0 to 1 | Helps compare how the surface interacts with sunlight. | NASA POWER, `ALLSKY_SRF_ALB` (CERES) | Moon: `null`, no comparable gridded map for the polar windows. Mars: `ground_albedo` of MCD v6.2, bare-soil albedo of the model. |

Each non-null value requires a source in `sources` with the product and its reference. `notes` documents the extraterrestrial coordinate system, the extraction method and, where relevant, the resolution, the period or the reason for a missing value. A value whose coverage or definition prevents comparing it is recorded as `null`.

## 3. Common scale

The target window for slope and relief is 10 × 10 km, with a reference resolution of about 250 m per pixel. For the available data the native resolution was kept: LOLA at 240 m on the Moon and MOLA at about 463 m on Mars. In both windows the mean slope is computed with Horn's method (3 × 3, on interior pixels) and the relief as the population standard deviation of the elevation. MOLA's coarser grid smooths the slope and can reduce the observed relief. Resampling to 250 m would not recover that detail. Absolute elevations depend on different reference levels on each body.

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

Each variable starts with weight 1. It is a reproducible reference while the sensitivity of the ranking is evaluated and there is no calibration per mission objective. Two terrain variables can add influence if they are correlated. Availability also changes the effective weight, since the average includes only the shared variables. Keeping the tags out of the score avoids giving the same meaning to a measured difference and to a difference in the available documentation.

## 6. Sensitivity and validation

The initial reference is minimum–maximum over the joint catalog. An extreme lunar temperature widens the range and reduces the thermal separation among the other records. The comparison with a quantile-based variant has still not been carried out. With few observations, quantiles are unstable and trimming can hide relevant differences at the poles.

### Sensitivity results (S-3)

47 candidates and six sites were evaluated with the catalogs of `fe45e52`. The 60 weight tests change one variable at a time by ±50 %. The other 30 remove one variable and again require at least three shared values. The displacement is computed among candidates present in both rankings. The top 5 is taken from the overall ranking, with the input order as tie-breaker for rounded scores.

| Site | ±50 %: shared top 5 (min–max) | ±50 %: largest mean / individual displacement | Omission: shared top 5 (min–max) | Omission: largest mean / individual displacement |
| --- | ---: | ---: | ---: | ---: |
| Faustini Rim A | 4–5 | 1.91 / 14 | 2–5 | 4.88 / 20 |
| Peak Near Cabeus B | 4–5 | 1.72 / 13 | 2–5 | 3.91 / 19 |
| Malapert Massif | 3–5 | 1.77 / 13 | 3–5 | 3.86 / 19 |
| Jezero | 4–5 | 3.15 / 11 | 3–5 | 6.55 / 29 |
| Gale | 4–5 | 3.06 / 13 | 2–5 | 6.60 / 31 |
| Arcadia Planitia | 4–5 | 2.04 / 8 | 4–5 | 4.60 / 17 |

With weight changes, 59 of 60 tests kept at least four names of the top 5 and 39 kept all five. The exception was Malapert with precipitation at −50 %. The omissions kept at least four names in 21 of 30 tests. Removing precipitation left only two names at Faustini and Gale. At Gale, removing the slope moved one candidate of the ranking by up to 31 positions. On Mars, removing temperature, precipitation or albedo excluded four pairs that already lacked slope and relief. The missing lunar albedo explains why varying or removing its weight leaves the lunar rankings intact.

The equal weights are kept as a reference. To interpret candidates with close scores, it is advisable to look at their coverage and at whether they stay on top when a variable is removed. The influence of thermal extremes on the min–max scale remains a limitation. The test does not compare alternative normalizations.

| Synthetic control with equal terrain and albedo | Scores compared | Result |
| --- | ---: | --- |
| Cold and dry versus warm and wet | 85.8 / 60.0 | Expected order |
| Lower precipitation at equal temperature | 75.1 / 60.0 | Expected order |
| Smaller thermal difference at equal precipitation | 70.7 / 60.0 | Expected order |

### Validation by body and less-studied candidates (S-6)

The validation uses `known: true` and requires that `analog_for` includes the body of the site. The count of less-studied candidates uses `known: false` within the overall top 5. The index compares the pairs with sufficient coverage, regardless of `analog_for`. This distinction matters on the Moon, where all the less-studied candidates in the top 5 are tagged for Mars in the catalog.

| Site | Pairs | Known candidates of the body in the top 5 | Less-studied candidates in the top 5 (position and score) |
| --- | ---: | --- | --- |
| Faustini Rim A | 43 | 0 of 4 | 3: Laguna Verde (3rd, 58.7), Uturuncu (4th, 57.2), Ojos del Salado (5th, 56.3) |
| Peak Near Cabeus B | 43 | 0 of 4 | 3: Ojos del Salado (2nd, 63.3), Socompa (4th, 62.0), Sajama (5th, 60.6) |
| Malapert Massif | 43 | 0 of 4 | 3: Ojos del Salado (2nd, 63.3), Socompa (4th, 62.0), Pamir (5th, 60.8) |
| Jezero | 47 | 2 of 20: Gilf Kebir (1st, 80.8) and Tibesti (2nd, 80.2) | 3: Siloli (3rd, 79.4), Harrat Khaybar (4th, 79.2), Laguna Colorada (5th, 78.6) |
| Gale | 47 | 2 of 20: Gilf Kebir (1st, 83.2) and Tibesti (2nd, 79.0) | 3: Siloli (3rd, 78.9), Laguna Colorada (4th, 78.1), Namib (5th, 77.2) |
| Arcadia Planitia | 47 | 3 of 20: Gilf Kebir (3rd, 76.8), Qaidam (4th, 75.8) and Coipasa (5th, 74.5) | 2: Taklamakan (1st, 76.9) and Dasht-e Kavir (2nd, 76.8) |

In the three lunar rankings, Pinacate is 14th, Mauna Kea 16th and Askja 23rd. The largest normalized differences of those pairs are temperature or precipitation. La Corona is excluded because, without slope, relief or lunar albedo, it shares only two variables. The documented analogs can be useful for geological processes, such as volcanism or lava tubes, which are outside the score. On Mars, the 20 relevant known candidates enter the ranking, but only some reach the top 5. McMurdo ranks between 37th and 45th with three variables and the albedo difference as its largest penalty. Terrestrial albedo includes snow, water and vegetation, whereas the Martian one describes bare soil. The validation partially supports the Martian ranking and leaves the lunar one unconfirmed.

Gilf Kebir, documented as a Mars analog in NASA report CR-3611 (El-Baz and Maxwell, 1982), leads Jezero and Gale because of its similar slope and the 0.0 mm/year of the regional NASA POWER product. That zero is a value of the product and does not prove a local absence of rain. At Arcadia, Taklamakan and Dasht-e Kavir have normalized slope differences below 0.004 and relief differences below 0.046, although their thermal differences are around 0.49–0.52. Siloli appears third at Jezero and Gale. In both, the normalized albedo difference is below 0.07 and the relief difference below 0.10. On the Moon, Ojos del Salado and Socompa stay among the first at more than one site because of terrain similarity, while the thermal difference of those pairs exceeds 0.65.

The less-studied candidates take 17 of the 30 places of the overall top 5, counting repetitions across sites. The catalog assigns `known: false` from a preliminary literature search; Gilf Kebir changed to `known: true` because that Crossref search does not index NASA technical reports, where it does appear. These results serve to prioritize the review of candidates. Jaccard remains as a separate indicator to contrast documented processes. Terrestrial climatology is regional and several coordinates are approximate, including the point used for Yungay, so the comparison must be verified before attributing a similarity to a specific field site.

## 7. Limitations

- The score is relative to the catalog and to the shared variables. Adding records can change the ranges and the scores of pairs already computed. Two pairs with the same score can have different coverage. `n_vars_used` indicates how many variables contribute, and `norm_diff` makes it possible to check which ones.
- The thermal reference of the contract is the mean annual surface temperature. For the Moon, Diviner's `temp_avg` is provisionally accepted as an approximation close to the surface. It is an annual mean modeled at 2 cm depth and that difference can bias the comparison between bodies. On Mars, MCD v6.2 `tsurf` is a modeled surface temperature, averaged over local hours 0–23 and solar longitude Ls values from 0° to 345° every 15°, without weighting the duration of the seasons. The extreme temperatures of the permanently shadowed lunar regions can produce large differences even with the best terrestrial candidates.
- The albedo comparison depends on the spectral band, the illumination and observation geometry, and the definition of the product. Reflectance in a single band is not equivalent to broadband solar albedo. The three lunar sites have `albedo: null`. Their comparisons use at most four variables, and albedo discriminates only in pairs with Mars when the terrestrial candidate has that value.
- Precipitation represents one aspect of aridity. The conventional zero for the Moon and Mars does not describe ice, frost, vapor or water availability. The index also does not directly measure gravity, the lunar vacuum, the Martian atmosphere, radiation, illumination, regolith, dust or communications. The fact sheets must explain what each analogy is useful for and where it stops being valid.

## 8. Sources

- Earth — [Mapzen Terrain Tiles](https://registry.opendata.aws/terrain-tiles/) and [NASA POWER climatology](https://power.larc.nasa.gov/docs/services/api/temporal/climatology/) (TS, PRECTOTCORR and ALLSKY_SRF_ALB).
- Moon — [LOLA LDEM_75S_240M](https://pds-geosciences.wustl.edu/lro/lro-l-lola-3-rdr-v1/lrolol_1xxx/data/lola_gdr/polar/img/ldem_75s_240m.img) and [Diviner Polar Resource Product south](https://pds-geosciences.wustl.edu/lro/urn-nasa-pds-lro_diviner_derived1/data_derived_prp/dlre_prp_south.tab).
- Mars — [MOLA MEGDR at 128 pixels/degree](https://pds-geosciences.wustl.edu/missions/mgs/megdr.html) and [Mars Climate Database v6.2](https://www-mars.lmd.jussieu.fr/mcd_python/).

## 9. Global scan (S-7)

The global scan on a 2° grid is discarded for this delivery. There is no validated data route that covers land and obtains comparable variables without massive downloads. The scan remains as possible future work. This delivery publishes the rankings of the catalog of 47 candidates and does without `scan.json`.
