# Similarity index methodology

## 1. Objective

The index ranks places on Earth by their similarity to a candidate site on the Moon or Mars using five variables describing terrain, temperature, aridity and reflectivity. Each result shows which variables could be compared and how much they differ. The ranking guides the search for places to study processes or test operations and must be interpreted together with the fact sheets, qualitative matches and limitations of each analogy.

## 2. Variables and their physical rationale

| Variable | What it measures | Why it matters | Source used on Earth | Source used on the Moon and Mars |
| --- | --- | --- | --- | --- |
| `slope_deg` | Mean terrain slope, in degrees | Compares terrain inclination for mobility and site selection. | Mapzen Terrain Tiles (tile sources in each record) | LOLA `LDEM_75S_240M` on the Moon and MOLA MEGDR at 128 pixels/degree on Mars |
| `relief_m` | Standard deviation of elevation within the window, in meters | Describes local vertical variation in terrain. | The same elevation model | The same elevation products |
| `temp_mean_c` | Mean annual temperature in °C, with a subsurface approximation on the Moon | Compares the mean thermal environment relevant to equipment and materials. | NASA POWER surface temperature | Southern Diviner Polar Resource Product, `temp_avg` modeled at 2 cm on the Moon. Mars Climate Database (MCD) v6.2, modeled surface `tsurf` on Mars. |
| `precip_mm_year` | Mean annual precipitation, in mm/year | Distinguishes terrestrial environments by rainfall-based aridity. | NASA POWER corrected precipitation | Zero by index convention, which compares rainfall input |
| `albedo` | Fraction of solar radiation reflected by the surface, from 0 to 1 | Compares how surfaces interact with sunlight. | NASA POWER `ALLSKY_SRF_ALB` (CERES) | Moon: `null`, with no comparable gridded map for the polar windows. Mars: MCD v6.2 `ground_albedo`, the model's bare-ground albedo. |

Each non-null value requires a source in `sources`, identifying the product and reference. The extraterrestrial coordinate system, extraction method and, where applicable, resolution, period or reason for missing data are recorded in `notes`. A value whose coverage or definition prevents comparison is recorded as `null`.

## 3. Common scale

The target window for slope and relief is 10 × 10 km, with a reference resolution of about 250 m per pixel. The available data retain their native resolution: LOLA at 240 m on the Moon and MOLA at about 463 m on Mars. Within both windows, mean slope is calculated with Horn's method (3 × 3, using interior pixels), and relief is the population standard deviation of elevation. The coarser MOLA grid smooths slope and may reduce observed relief. Resampling to 250 m would not recover that detail. Absolute elevations depend on different reference levels on each body.

Thermal and radiometric variables may come from products with footprints larger than the window or unequal temporal coverage. The effective area and represented period are recorded. A common topographic window compares the same extent at different effective resolutions.

## 4. Formula

1. We apply the natural logarithm of `1 + x` to `relief_m` and `precip_mm_year`, with values in the agreed units. This preserves zero and reduces the influence of large differences in the tails. The other variables retain their units before min–max normalization.

   - `slope_deg` measures an angle relative to horizontal. A difference of 5° represents the same angular separation anywhere in the range. The index compares that geometry; actual mobility also depends on the vehicle, traction and gravity. [Slope definition, USGS](https://www.usgs.gov/educational-resources/determine-percent-slope-and-angle-slope).
   - `temp_mean_c` compares differences in mean temperature in °C. A 10 °C difference equals 10 K throughout the range. The linear calculation gives the same difference when expressed in kelvin because the zero-point offset cancels during subtraction. [Temperature intervals, NIST](https://physics.nist.gov/cuu/Units/register2.html).
   - `albedo` is already a fraction bounded between 0 and 1. Under comparable definitions and conditions, a difference of 0.05 equals five percentage points of reflected incoming radiation, regardless of the starting albedo. [Surface albedo, NASA](https://power.larc.nasa.gov/docs/methodology/data/derived/derived-parameters/).
2. For each variable, we calculate the minimum and maximum available values across the entire catalog, including sites and candidates, after transformation. Normalization is `(value − minimum) / (maximum − minimum)`. If the range is zero, the code returns zero for all present values. Missing data are omitted.
3. For each pair, we calculate the absolute difference between normalized values for variables available in both records. A pair enters the ranking with at least three shared variables.
4. Distance is the sum of differences multiplied by their weights, divided by the sum of the weights of shared variables. The score is `100 × (1 − distance)` and is exported rounded to one decimal place. `n_vars_used` and `norm_diff` (four decimal places) are also exported. The ranking sorts by rounded score and preserves input order for ties.
5. Qualitative matches are shown alongside the score. If both sites have documented tags, `tag_overlap` reports the Jaccard index: the number of shared tags divided by the total number of distinct tags in the pair. If either side lacks tags, it returns `null`.

## 5. Weights

Each variable starts with weight 1. This is a reproducible baseline while ranking sensitivity is evaluated, without calibration for a specific mission objective. Two terrain variables can add influence if they are correlated. Availability also changes effective weighting because the average includes only shared variables. Keeping tags outside the score avoids treating a measured difference as equivalent to a difference in the available documentation.

## 6. Sensitivity and validation

The initial baseline is min–max normalization across the combined catalog. An extreme lunar temperature widens the range and reduces thermal separation among other records. Comparison with a quantile-based variant has not yet been performed. With few observations, quantiles are unstable and clipping may hide relevant differences at the poles.

### Sensitivity results (S-3)

We evaluated 47 candidates and six sites using the catalogs at `fe45e52`. The 60 weight tests change one variable at a time by ±50%. Another 30 tests remove one variable and again require at least three shared values. Displacement is calculated among candidates present in both rankings. The top 5 comes from the overall ranking, using input order to break ties in rounded scores.

| Site | ±50%: shared top 5 (min.–max.) | ±50%: greatest mean / individual displacement | Omission: shared top 5 (min.–max.) | Omission: greatest mean / individual displacement |
| --- | ---: | ---: | ---: | ---: |
| Faustini Rim A | 4–5 | 1.91 / 14 | 2–5 | 4.88 / 20 |
| Peak Near Cabeus B | 4–5 | 1.72 / 13 | 2–5 | 3.91 / 19 |
| Malapert Massif | 3–5 | 1.77 / 13 | 3–5 | 3.86 / 19 |
| Jezero | 4–5 | 3.15 / 11 | 3–5 | 6.55 / 29 |
| Gale | 4–5 | 3.06 / 13 | 2–5 | 6.60 / 31 |
| Arcadia Planitia | 4–5 | 2.04 / 8 | 4–5 | 4.60 / 17 |

Under weight changes, 59 of 60 tests retained at least four top-5 names, and 39 retained all five. The exception was Malapert with precipitation reduced by 50%. Omissions retained at least four names in 21 of 30 tests. Removing precipitation left only two names for Faustini and Gale. For Gale, removing slope moved one candidate by as many as 31 positions. On Mars, removing temperature, precipitation or albedo excluded four pairs already lacking slope and relief. Missing lunar albedo explains why changing or removing its weight leaves lunar rankings unchanged.

Equal weights remain the baseline. For candidates close in score, consider their coverage and whether they stay near the top when a variable is removed. The influence of thermal extremes on the min–max scale remains a limitation. This test does not compare alternative normalizations.

| Synthetic control with identical terrain and albedo | Scores compared | Result |
| --- | ---: | --- |
| Cold and dry versus warm and wet | 85.8 / 60.0 | Expected order |
| Lower precipitation at equal temperature | 75.1 / 60.0 | Expected order |
| Smaller thermal difference at equal precipitation | 70.7 / 60.0 | Expected order |

### Validation by body and less-studied candidates (S-6)

Validation uses `known: true` and requires `analog_for` to include the site's body. Less-studied counts use `known: false` within the overall top 5. The index compares pairs with sufficient coverage regardless of `analog_for`. This distinction matters for the Moon, where every less-studied candidate in the top 5 is tagged for Mars in the catalog.

| Site | Pairs | Documented analogs for that body in the top 5 | Less-studied candidates in the top 5 (position and score) |
| --- | ---: | --- | --- |
| Faustini Rim A | 43 | 0 of 4 | 3: Laguna Verde (3rd, 58.7), Uturuncu (4th, 57.2), Ojos del Salado (5th, 56.3) |
| Peak Near Cabeus B | 43 | 0 of 4 | 3: Ojos del Salado (2nd, 63.3), Socompa (4th, 62.0), Sajama (5th, 60.6) |
| Malapert Massif | 43 | 0 of 4 | 3: Ojos del Salado (2nd, 63.3), Socompa (4th, 62.0), Pamir (5th, 60.8) |
| Jezero | 47 | 2 of 20: Gilf Kebir (1st, 80.8) and Tibesti (2nd, 80.2) | 3: Siloli (3rd, 79.4), Harrat Khaybar (4th, 79.2), Laguna Colorada (5th, 78.6) |
| Gale | 47 | 2 of 20: Gilf Kebir (1st, 83.2) and Tibesti (2nd, 79.0) | 3: Siloli (3rd, 78.9), Laguna Colorada (4th, 78.1), Namib (5th, 77.2) |
| Arcadia Planitia | 47 | 3 of 20: Gilf Kebir (3rd, 76.8), Qaidam (4th, 75.8) and Coipasa (5th, 74.5) | 2: Taklamakan (1st, 76.9) and Dasht-e Kavir (2nd, 76.8) |

In all three lunar rankings, Pinacate ranks 14th, Mauna Kea 16th and Askja 23rd. Temperature or precipitation produces the largest normalized difference in those pairs. La Corona is excluded because, without slope, relief or lunar albedo, it shares only two variables. Documented analogs may be useful for geological processes such as volcanism or lava tubes that lie outside the score. On Mars, all 20 relevant documented analogs enter the ranking, but only some reach the top 5. McMurdo ranks between 37th and 45th with three variables, with albedo difference as its greatest penalty. Terrestrial albedo includes snow, water and vegetation, while Martian albedo describes bare ground. Validation partly supports the Martian ranking and leaves the lunar ranking unconfirmed.

Gilf Kebir, documented as a Mars analog in NASA CR-3611 (El-Baz and Maxwell, 1982), leads Jezero and Gale because of its similar slope and the regional NASA POWER product's 0.0 mm/year. That zero is a product value and does not demonstrate a local absence of rainfall. For Arcadia, Taklamakan and Dasht-e Kavir have normalized slope differences below 0.004 and relief differences below 0.046, although their thermal differences are around 0.49–0.52. Siloli ranks third for Jezero and Gale. In both pairs, normalized albedo difference is below 0.07 and relief difference below 0.10. For the Moon, Ojos del Salado and Socompa remain near the top for more than one site because of terrain similarity, while the thermal difference in those pairs exceeds 0.65.

Less-studied candidates occupy 17 of the 30 overall top-5 positions, counting repeats across sites. The catalog assigns `known: false` based on a preliminary literature search; Gilf Kebir changed to `known: true` because the Crossref search does not index NASA technical reports, where it does appear. These results help prioritize candidate review. Jaccard remains a separate indicator for comparing documented processes. Terrestrial climatology is regional and several coordinates are approximate, including the point used for Yungay, so comparisons must be verified before attributing similarity to a specific field location.

## 7. Limitations

- The score is relative to the catalog and shared variables. Adding records may change ranges and scores for previously calculated pairs. Two pairs with the same score may have different coverage. `n_vars_used` indicates how many variables contribute, and `norm_diff` identifies them.
- The contract's thermal reference is the annual mean surface temperature. For the Moon, Diviner `temp_avg` is provisionally accepted as a near-surface approximation. It is a modeled annual mean at 2 cm depth, and that difference may bias comparisons between bodies. On Mars, MCD v6.2 `tsurf` is a modeled surface temperature averaged over local hours 0–23 and solar longitude Ls from 0° to 345° at 15° intervals, without weighting seasonal duration. Extreme temperatures in permanently shadowed lunar regions may produce large differences even with the best terrestrial candidates.
- Albedo comparison depends on spectral band, illumination and viewing geometry, and product definition. Single-band reflectance is not equivalent to broadband solar albedo. All three lunar sites have `albedo: null`. Their comparisons use at most four variables, and albedo distinguishes only Mars pairs when the terrestrial candidate has that value.
- Precipitation represents one aspect of aridity. Conventional zero for the Moon and Mars does not describe ice, frost, vapor or water availability. The index also does not directly measure gravity, lunar vacuum, Martian atmosphere, radiation, illumination, regolith, dust or communications. Fact sheets must explain what each analogy is useful for and where it stops being valid.

## 8. Sources

- Earth — [Mapzen Terrain Tiles](https://registry.opendata.aws/terrain-tiles/) and [NASA POWER climatology](https://power.larc.nasa.gov/docs/services/api/temporal/climatology/) (TS, PRECTOTCORR and ALLSKY_SRF_ALB).
- Moon — [LOLA LDEM_75S_240M](https://pds-geosciences.wustl.edu/lro/lro-l-lola-3-rdr-v1/lrolol_1xxx/data/lola_gdr/polar/img/ldem_75s_240m.img) and [southern Diviner Polar Resource Product](https://pds-geosciences.wustl.edu/lro/urn-nasa-pds-lro_diviner_derived1/data_derived_prp/dlre_prp_south.tab).
- Mars — [MOLA MEGDR at 128 pixels/degree](https://pds-geosciences.wustl.edu/missions/mgs/megdr.html) and [Mars Climate Database v6.2](https://www-mars.lmd.jussieu.fr/mcd_python/).

## 9. Global scan (S-7)

The global scan on a 2° grid is excluded from this delivery. A validated data path covering land and obtaining comparable variables without massive downloads is still missing. The scan remains possible future work. This delivery publishes rankings for the catalog of 47 candidates and does not include `scan.json`.
