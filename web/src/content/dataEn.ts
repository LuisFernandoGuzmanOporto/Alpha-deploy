// Versión en inglés de los textos que vienen de los datos (issue #25). El contrato de datos no cambia:
// esta capa se aplica al cargar y se indexa por `id`. Cada id nuevo en `data/` necesita su entrada
// aquí; `localize.test.ts` falla si falta alguna.

export interface SiteEn {
  region: string;
  notes: string;
}

export interface FichaEn {
  summary: string;
  processes: string[];
  use_cases: string[];
  breaks_down: string[];
}

export const SITES_EN: Record<string, SiteEn> = {
  "moon-faustini-rim-a": {
    region: "Lunar south pole",
    notes:
      "Coordinates: center of the LROC NAC mosaic NAC_ROI_FAUSTINILOC (Faustini Rim A): https://data.lroc.im-ldi.com/lroc/view_rdr/NAC_ROI_FAUSTINILOC. Planetocentric coordinates, east longitude (Mean Earth/Polar Axis, DE421). Region withdrawn from the Artemis III list in October 2024 (NASA went from 13 to 9 regions; George et al., NTRS 20250011660: https://ntrs.nasa.gov/citations/20250011660). Window: 42 x 42 LOLA pixels of 240 m (about 10 x 10 km on the ground). Temperature: Diviner's temp_avg is the modeled annual mean at 2 cm depth (780 mesh triangles in the window). Ice: in 52.9 % of the triangles in the window, Diviner's thermal model (ice_depth column) gives water ice that is stable at 1 m or less; this is thermal stability (model of Paige et al. 2010, Science 330, 479, doi:10.1126/science.1187726), not direct detection. Impact crater: the region is the rim of Faustini crater. Albedo: null in the index. LOLA's normal albedo at 1064 nm exists (LDAM_50S_1000M_FLOAT, Lemelin et al. 2016, Icarus 273, 315-328, doi:10.1016/j.icarus.2016.02.006): 0.363 mean over the window (100 pixels of 1 km), computed with pipeline/moon_mars/moon_polar.py. It is not used because it is reflectance at a single wavelength and is not comparable with the broadband solar albedo of Earth (NASA POWER, CERES) or Mars (MCD). Whether to use it is a methodology decision (Sebastian).",
  },
  "moon-peak-near-cabeus-b": {
    region: "Lunar south pole",
    notes:
      "Coordinates: center of the LROC NAC mosaic NAC_ROI_CABEUSPKLOB (Peak Near Cabeus B): https://data.lroc.im-ldi.com/lroc/view_rdr/NAC_ROI_CABEUSPKLOB. Planetocentric coordinates, east longitude (Mean Earth/Polar Axis, DE421). Region currently on the list of 9 Artemis III candidate regions (October 2024). Window: 42 x 42 LOLA pixels of 240 m (about 10 x 10 km on the ground). Temperature: Diviner's temp_avg is the modeled annual mean at 2 cm depth (780 triangles in the window). Ice: in 25.0 % of the triangles in the window, Diviner's thermal model (ice_depth) gives water ice that is stable at 1 m or less; this is thermal stability (model of Paige et al. 2010, Science 330, 479, doi:10.1126/science.1187726), not direct detection. Context: the LCROSS impact detected water in the neighboring Cabeus crater (Colaprete et al. 2010, Science 330, 463, doi:10.1126/science.1186986). Albedo: null in the index. LOLA's normal albedo at 1064 nm exists (LDAM_50S_1000M_FLOAT, Lemelin et al. 2016, Icarus 273, 315-328, doi:10.1016/j.icarus.2016.02.006): 0.327 mean over the window (100 pixels of 1 km), computed with pipeline/moon_mars/moon_polar.py. It is not used because it is reflectance at a single wavelength and is not comparable with the broadband solar albedo of Earth (NASA POWER, CERES) or Mars (MCD). Whether to use it is a methodology decision (Sebastian).",
  },
  "moon-malapert-massif": {
    region: "Lunar south pole",
    notes:
      "Coordinates: center of the LROC NAC mosaic NAC_ROI_MALAPERTLOA (Malapert Massif): https://data.lroc.im-ldi.com/lroc/view_rdr/NAC_ROI_MALAPERTLOA. Planetocentric coordinates, east longitude (Mean Earth/Polar Axis, DE421). Region currently on the list of 9 Artemis III candidate regions (October 2024). The point is about 5.7 km from NASA's notional site (-85.964, 357.681) cited by Kring et al. 2025 (JGR Planets, doi:10.1029/2024JE008905). Window: 42 x 42 LOLA pixels of 240 m (about 10 x 10 km on the ground). Temperature: Diviner's temp_avg is the modeled annual mean at 2 cm depth (780 triangles in the window). Ice: in 9.2 % of the triangles in the window, Diviner's thermal model (ice_depth) gives water ice that is stable at 1 m or less; this is thermal stability (model of Paige et al. 2010, Science 330, 479, doi:10.1126/science.1187726), not direct detection. No polar-ice tag: the fraction is low and there is no ice citation for the massif (ice studies name Malapert crater, about 45 km away). Albedo: null in the index. LOLA's normal albedo at 1064 nm exists (LDAM_50S_1000M_FLOAT, Lemelin et al. 2016, Icarus 273, 315-328, doi:10.1016/j.icarus.2016.02.006): 0.314 mean over the window (100 pixels of 1 km), computed with pipeline/moon_mars/moon_polar.py. It is not used because it is reflectance at a single wavelength and is not comparable with the broadband solar albedo of Earth (NASA POWER, CERES) or Mars (MCD). Whether to use it is a methodology decision (Sebastian).",
  },
  "mars-jezero": {
    region: "Isidis Planitia, Mars",
    notes:
      "Coordinates: Octavia E. Butler Landing (Perseverance landing site), NASA Planetary Spectrum Generator, Mars Explorer: https://psg.gsfc.nasa.gov/apps/mars/ ; planetocentric, east longitude 0-360. MOLA elevation at the point: -2571 m. Window: about 10 x 10 km on MOLA at 463 m per pixel (coarser than LOLA's 240 m; the slope comes out smoother than with a 250 m model). Temperature: MCD mean with uniform Ls, not weighted by the duration of each season; it is a model value, not a measurement. Albedo: bare-soil albedo of the MCD model (to be verified whether it is the TES map that the MCD uses). Tags: impact crater (Jezero, IAU name); hydrated minerals, clays and carbonates of the delta (Goudge et al. 2015, JGR Planets, doi:10.1002/2014JE004782); basalt, igneous rocks of the crater floor (Farley et al. 2022, Science, doi:10.1126/science.abo2196).",
  },
  "mars-gale": {
    region: "Aeolis, Mars",
    notes:
      "Coordinates: Bradbury Landing (Curiosity landing site), Vasavada et al. 2014, JGR Planets, doi:10.1002/2014JE004622 ; planetocentric, east longitude 0-360. MOLA elevation at the point: -4503 m (published: -4501 m). Window: about 10 x 10 km on MOLA at 463 m per pixel (coarser than LOLA's 240 m; the slope comes out smoother than with a 250 m model). Temperature: MCD mean with uniform Ls, not weighted by the duration of each season; it is a model value, not a measurement. Albedo: bare-soil albedo of the MCD model (to be verified whether it is the TES map that the MCD uses). Tags: impact crater (Gale, IAU name); clay minerals at Yellowknife Bay (Vaniman et al. 2014, Science, doi:10.1126/science.1243480); active Bagnold aeolian dunes (Bridges et al. 2018, JGR Planets, doi:10.1002/2017JE005401).",
  },
  "mars-arcadia-planitia": {
    region: "Northern plains, Mars",
    notes:
      "Coordinates: center of Arcadia Planitia in the Gazetteer of Planetary Nomenclature (IAU/USGS): https://planetarynames.wr.usgs.gov/Feature/348 ; the MDIM 2.1 control network is used, the one current in the gazetteer (49.02 N, 188.15 E); the earlier MDIM 2.0 network gave 46.66 N, 192.00 E. It is a plain about 2200 km across: the point represents the region, not a specific landing site. Window: about 10 x 10 km on MOLA at 463 m per pixel (coarser than LOLA's 240 m; the slope comes out smoother than with a 250 m model). Temperature: MCD mean with uniform Ls, not weighted by the duration of each season; it is a model value, not a measurement. Albedo: bare-soil albedo of the MCD model (to be verified whether it is the TES map that the MCD uses). Tags: permafrost, excess ice extending beneath the surface (Bramson et al. 2015, GRL, doi:10.1002/2015GL064844).",
  },
};

export const COUNTRIES_EN: Record<string, string> = {
  Antártida: "Antarctica",
  "Arabia Saudita": "Saudi Arabia",
  Argelia: "Algeria",
  Argentina: "Argentina",
  "Argentina y Chile": "Argentina and Chile",
  Australia: "Australia",
  Bolivia: "Bolivia",
  Canadá: "Canada",
  Chad: "Chad",
  Chile: "Chile",
  "Chile y Argentina": "Chile and Argentina",
  China: "China",
  "Corea del Sur": "South Korea",
  "Egipto y Libia": "Egypt and Libya",
  España: "Spain",
  "Estados Unidos": "United States",
  Etiopía: "Ethiopia",
  Irán: "Iran",
  Islandia: "Iceland",
  México: "Mexico",
  Namibia: "Namibia",
  Noruega: "Norway",
  Tayikistán: "Tajikistan",
  Túnez: "Tunisia",
};

export const CANDIDATE_NAMES_EN: Record<string, string> = {
  "earth-atacama-nucleo-hiperarido": "Hyper-arid core of the Atacama Desert (Yungay)",
  "earth-valles-secos-mcmurdo": "McMurdo Dry Valleys",
  "earth-haughton-isla-devon": "Haughton impact structure (Devon Island)",
  "earth-mdrs-utah": "Mars Desert Research Station (Utah)",
  "earth-dallol-danakil": "Dallol (Danakil Depression)",
  "earth-askja-islandia": "Askja caldera (Iceland)",
  "earth-mauna-kea-hawai": "Mauna Kea (Hawaii)",
  "earth-rio-tinto-espana": "Río Tinto mining district",
  "earth-ubehebe-valle-de-la-muerte": "Ubehebe Crater (Death Valley)",
  "earth-svalbard-sverrefjellet": "Sverrefjellet volcano (Svalbard)",
  "earth-kau-kilauea-hawai": "Ka'u Desert (Kilauea volcano)",
  "earth-cuenca-qaidam": "Qaidam Basin",
  "earth-tibesti-chad": "Tibesti Mountains",
  "earth-craters-of-the-moon-idaho": "Craters of the Moon (Idaho)",
  "earth-pinacate-mexico": "El Pinacate volcanic field",
  "earth-la-corona-lanzarote": "La Corona lava tube (Lanzarote)",
  "earth-desierto-de-lut-iran": "Lut Desert",
  "earth-salar-de-uyuni": "Salar de Uyuni (salt flat)",
  "earth-salar-de-coipasa": "Salar de Coipasa (salt flat)",
  "earth-licancabur-laguna-verde": "Licancabur Volcano and its summit lake",
  "earth-laguna-colorada": "Laguna Colorada",
  "earth-laguna-verde-bolivia": "Laguna Verde (Bolivia)",
  "earth-uturuncu-bolivia": "Uturuncu Volcano (Sud Lípez)",
  "earth-nevado-sajama": "Nevado Sajama",
  "earth-torotoro-umajalanta": "Torotoro National Park (Umajalanta cave)",
  "earth-arbol-de-piedra-siloli": "Siloli Desert (Árbol de Piedra)",
  "earth-volcan-tunupa-uyuni": "Tunupa Volcano (north shore of the Uyuni salt flat)",
  "earth-badain-jaran-china": "Badain Jaran Desert (megadunes)",
  "earth-rub-al-khali": "Rub' al Khali (Empty Quarter)",
  "earth-mar-de-arena-namib": "Namib Sand Sea",
  "earth-harrat-khaybar": "Harrat Khaybar volcanic field",
  "earth-ojos-del-salado": "Ojos del Salado Volcano",
  "earth-volcan-socompa": "Socompa Volcano (Puna de Atacama)",
  "earth-el-malpais-nuevo-mexico": "El Malpais (New Mexico)",
  "earth-manjanggul-jeju": "Manjanggul lava tube (Jeju)",
  "earth-undara-australia": "Undara lava tubes",
  "earth-lava-beds-california": "Lava Beds (California)",
  "earth-etosha-namibia": "Etosha Pan",
  "earth-chott-el-djerid": "Chott el Djerid",
  "earth-desierto-tengger": "Tengger Desert",
  "earth-dasht-e-kavir": "Dasht-e Kavir (Great Salt Desert)",
  "earth-lago-eyre-australia": "Kati Thanda–Lake Eyre",
  "earth-gilf-kebir": "Gilf Kebir plateau",
  "earth-macizo-del-hoggar": "Hoggar (Ahaggar) Massif",
  "earth-desierto-de-taklamakan": "Taklamakan Desert",
  "earth-montanas-del-pamir": "Pamir high-altitude cold desert",
  "earth-salar-de-arizaro": "Salar de Arizaro (salt flat)",
};

/** `why` escrito a mano. Los que sigue la plantilla "Propuesto por sus valores…" los traduce `translateWhy`. */
export const CANDIDATE_WHY_EN: Record<string, string> = {
  "earth-atacama-nucleo-hiperarido": "Hyper-arid soils described as similar to those of Mars, and the dry limit of microbial life.",
  "earth-valles-secos-mcmurdo":
    "Zones of microclimate and geomorphological processes described as geological, environmental and ecological analogs of the surface of Mars.",
  "earth-haughton-isla-devon": "Impact structure that hosts the Haughton-Mars Project, with research relevant to planetary studies.",
  "earth-mdrs-utah": "Mars simulation station in a Utah desert, used as an analog site.",
  "earth-dallol-danakil": "Geothermal area in northern Afar described as an exceptional planetary analog field site.",
  "earth-askja-islandia": "Caldera described as a natural lunar analog; its volcanic deposits are also studied in relation to Mars.",
  "earth-mauna-kea-hawai": "Analog test site for in-situ resource utilization on the Moon.",
  "earth-rio-tinto-espana":
    "Acidic basin whose mineralogy and sedimentary geobiology are used to interpret outcrops at Meridiani Planum, on Mars.",
  "earth-ubehebe-valle-de-la-muerte":
    "Death Valley crater proposed as an analog of Martian craters because of its Little Ice Age deposits.",
  "earth-svalbard-sverrefjellet": "Its carbonates in basalt are compared with the globules of the Martian meteorite ALH 84001.",
  "earth-kau-kilauea-hawai": "Volcanic environment with silica described as an analog of Mars.",
  "earth-cuenca-qaidam": "Desert basin described as an analog of Mars; its linear dunes are compared with those of Chasma Boreale.",
  "earth-tibesti-chad": "Volcanic province whose forms have been compared with those of Elysium, on Mars.",
  "earth-craters-of-the-moon-idaho": "Basaltic volcanic field with sulfate mineralization proposed as a possible Martian analog.",
  "earth-pinacate-mexico": "Volcanic field used in field exercises as an analog of planetary volcanism.",
  "earth-la-corona-lanzarote": "Lava tube studied as a planetary analog for caves on the Moon and Mars.",
  "earth-desierto-de-lut-iran":
    "Its yardangs are proposed as terrestrial analogs of Martian yardangs, and its barchan dunes have been characterized.",
  "earth-salar-de-uyuni":
    "Seasonal brines of the world's largest salt flat, proposed as an analog of Martian brines; NASA describes it as a natural laboratory for studying Mars.",
  "earth-salar-de-coipasa": "NASA describes Uyuni and Coipasa as natural laboratories for studying the Martian environment.",
  "earth-licancabur-laguna-verde": "High-altitude crater lake studied as an analog of the Martian lakes of about 3.5 billion years ago.",
  "earth-gilf-kebir":
    "Plateau in Egypt's Western Desert whose wind-eroded forms and dry valleys were compared with those of Mars in a NASA report (El-Baz and Maxwell, 1982).",
};

const CELL = "The NASA POWER cell differs by more than 500 m from the elevation of the point, so the temperature may be biased (see the candidate's notes).";
const TOP10 =
  "It reaches the top 10 of the lunar sites only because of slope and relief: it has no permanently shadowed ice and none of the cold of the lunar poles.";
const NO_STUDY = "We found no study that uses it as a planetary analog.";

export const FICHAS_EN: Record<string, FichaEn> = {
  "earth-atacama-nucleo-hiperarido": {
    summary:
      "Hyper-arid core of the Atacama Desert in northern Chile. Navarro-González and colleagues (2003) described Mars-like soils there, with organic compounds only in traces and very few culturable bacteria.",
    processes: [
      "Hyper-aridity: 11 mm of annual precipitation in the NASA POWER cell.",
      "Non-biological decomposition of organic compounds in the soil, observed with experiments inspired by the Viking labeled-release experiment (Navarro-González et al., 2003).",
    ],
    use_cases: [
      "Test life-detection and organic-compound experiments in nearly sterile soils, like those of the Vikings (Navarro-González et al., 2003).",
      "Study how organic matter varies in the surface horizons of Mars-like soils (Advances in Space Research, 2012).",
    ],
    breaks_down: [
      "Mean surface temperature is 15.7 °C (NASA POWER), about 66 °C more than at Gale (−50.7 °C) and about 176 °C more than at Faustini Rim A (−160.4 °C, Diviner).",
      TOP10,
      "The point used is the center of the desert and not the Yungay station: the variables describe the region, not the exact site of the studies.",
    ],
  },
  "earth-licancabur-laguna-verde": {
    summary:
      "Crater lake of the Licancabur volcano (5,868 m), on the border between Bolivia and Chile. A chapter of The Geology of Mars (2007) uses high-altitude lakes like this one as a clue to understand the Noachian aqueous environments of Mars.",
    processes: [
      "High-altitude crater lake, used as a reference for ancient aqueous environments on Mars (The Geology of Mars, 2007).",
      "Strong volcanic relief: mean slope of 15° and relief of 434 m in the 10 km window (Terrain Tiles).",
    ],
    use_cases: [
      "Look for signatures of habitats and life in high-altitude lakes as a guide to exploring Martian paleolakes (The Geology of Mars, 2007).",
    ],
    breaks_down: [
      "It ranks first at Peak Near Cabeus B and Malapert because of slope and relief, but its mean temperature (14.7 °C) is about 140 °C above that of those sites (Diviner).",
      CELL,
      "It has liquid water at the surface today; the lakes of Mars are ancient and no longer exist at the surface.",
    ],
  },
  "earth-laguna-verde-bolivia": {
    summary:
      "Salt lake at about 4,300 m, at the foot of the Licancabur volcano, in southwestern Bolivia. Its waters carry suspended minerals, including arsenic, and its color changes from turquoise to emerald green when the wind stirs up the sediments.",
    processes: [
      "Wind resuspension of sediments, which changes the color of the water.",
      "Salty water with dissolved and suspended minerals, including arsenic.",
    ],
    use_cases: [
      "Team proposal, no published study: compare its chemistry with that of the neighboring crater lake, which is studied as a Mars analog.",
    ],
    breaks_down: [
      "We found no study that uses it as a planetary analog; its place in the lunar ranking is due to the relief of the window, not to its chemistry.",
      `It shares the NASA POWER cell with the Licancabur lake: the temperature (14.7 °C) does not distinguish between the two places. ${CELL}`,
      "It has liquid water at the surface, something that exists today neither on the Moon nor on Mars.",
    ],
  },
  "earth-uturuncu-bolivia": {
    summary:
      "6,008 m volcano in southern Bolivia that has not erupted for about 250,000 years but shows ground deformation, seismicity and active fumaroles. That is why it is described as a “zombie” volcano.",
    processes: [
      "Ground uplift detected by satellite radar since 1992, 1 to 2 cm per year between 1992 and 2006.",
      "Carbon dioxide and water vapor fumaroles that deposit sulfur.",
    ],
    use_cases: [
      "Team proposal, no published study: rehearse the combination of geophysical methods (magnetotelluric and density) that was used to see its internal structure.",
    ],
    breaks_down: [
      "The study of the Altiplano-Puna volcanic complex as a planetary analog covers the Chilean sector; we found none on this volcano.",
      CELL,
      TOP10,
    ],
  },
  "earth-ojos-del-salado": {
    summary:
      "The highest volcano on Earth (6,893 m), in the Arid Diagonal of the Andes, between Chile and Argentina. Because of the extreme aridity there is almost no surface ice, although permafrost with ice may exist.",
    processes: [
      "Ground thermal regime measured for four years (2012-2016) at six sites between 4,200 and 6,893 m (Permafrost and Periglacial Processes, 2018).",
      "Possible permafrost under an extremely arid climate.",
    ],
    use_cases: ["Team proposal: test subsurface temperature and ice-detection sensors on steep, very dry terrain."],
    breaks_down: [
      "At −1.3 °C on average it is the coldest of the lunar top 10, but still about 124 °C above Peak Near Cabeus B (Diviner).",
      `The NASA POWER cell gives 219 mm of annual precipitation, although the field study describes an extremely arid climate: the cell is too coarse for the summit. ${CELL}`,
    ],
  },
  "earth-volcan-socompa": {
    summary:
      "Volcano in the Puna de Atacama where, near the summit (6,051 m), fumaroles sustain microbial communities in the form of mats. They are isolated in a sterile landscape: vascular plants do not go beyond about 4,600 m.",
    processes: [
      "Fumarolic activity that provides heat and moisture in a hyper-arid, high-altitude environment (Applied and Environmental Microbiology, 2009).",
    ],
    use_cases: [
      "Study how a geothermal source sustains islands of life in a cold, dry landscape, useful for thinking about geothermal habitats on Mars (team proposal).",
    ],
    breaks_down: ["Life depends on volcanic heat, which the lunar polar sites do not have.", CELL, TOP10],
  },
  "earth-nevado-sajama": {
    summary:
      "Volcano of the Bolivian Altiplano, about 100 km from the Pacific coast, with the southernmost tropical glacier. Its snow line was followed with Landsat and aerial photography from 1963 to 1998 to study the influence of El Niño.",
    processes: ["Variation of the glacier's snow line with rainfall and El Niño (Journal of Geophysical Research, 2001)."],
    use_cases: ["Team proposal: test methods for tracking ice and snow with satellite images on a high-altitude volcano."],
    breaks_down: [
      "Its ice comes from snowfall; at the lunar poles the ice would be trapped in permanently shadowed craters, without precipitation.",
      `The NASA POWER cell gives 376 mm of annual precipitation, among the highest of the lunar top 10. ${CELL}`,
      TOP10,
    ],
  },
  "earth-torotoro-umajalanta": {
    summary:
      "Limestone cave in Torotoro National Park (Potosí, Bolivia), with about 4.5 km explored according to caving sources. Its use as a planetary analog is a team hypothesis.",
    processes: ["Dissolution of limestone by groundwater (karst)."],
    use_cases: ["Team proposal, no published study: practice navigation, mapping and communications inside a cave."],
    breaks_down: [
      "It is a karst cave formed by water; the caves sought on the Moon and Mars as shelter are mostly lava tubes.",
      "It receives 533 mm of annual precipitation (NASA POWER), the highest of the lunar top 10 candidates.",
      TOP10,
    ],
  },
  "earth-volcan-tunupa-uyuni": {
    summary:
      "Extinct 5,321 m stratovolcano that forms a peninsula in the north of the Salar de Uyuni. It is made mostly of andesite, trachyandesite and trachydacite lavas about 1.4 to 1.6 million years old.",
    processes: ["Volcanic relief surrounded by the salt plain of the Salar de Uyuni."],
    use_cases: [
      "Team proposal, no published study: test a rover's transition between steep volcanic terrain and a salt plain.",
    ],
    breaks_down: [NO_STUDY, `The NASA POWER cell gives 332 mm of annual precipitation. ${CELL}`, TOP10],
  },
  "earth-macizo-del-hoggar": {
    summary:
      "Massif in southern Algeria, made mostly of metamorphic rocks about 2 billion years old with zones of more recent volcanism. Its highest point is Mount Tahat (2,908 m).",
    processes: ["Erosion of ancient volcanic domes that leaves isolated peaks."],
    use_cases: ["Team proposal, no published study: compare eroded volcanic peaks with highland reliefs on Mars."],
    breaks_down: [
      "It is tenth at Faustini Rim A with a low score (52.4): the match is weak and only topographic.",
      `Mean temperature of 22.5 °C (NASA POWER), about 183 °C above Faustini Rim A (Diviner). ${CELL}`,
    ],
  },
  "earth-montanas-del-pamir": {
    summary:
      "Cold mountain desert in the eastern Pamir (Tajikistan). Endolithic cyanobacteria, which live inside rocks to withstand a severe and highly variable climate, were studied there.",
    processes: ["Microbial colonization of the interior of rocks in a cold desert (Microorganisms, 2020)."],
    use_cases: [
      "Study endolithic life as a model of where to look for life sheltered beneath the surface of rocks on Mars (team proposal based on Microorganisms, 2020).",
    ],
    breaks_down: [
      "At −4.7 °C on average it is among the coldest in the ranking, but still about 120 °C above Peak Near Cabeus B (Diviner).",
      `The point is an approximate center of the region, not a study site. ${CELL}`,
      TOP10,
    ],
  },
  "earth-gilf-kebir": {
    summary:
      "Sandstone plateau of about 7,770 km² between Egypt and Libya, with a mean precipitation of barely 0.1 mm a year. El-Baz and Maxwell (1982, NASA) compared the wind and fluvial erosion forms of the Gilf Kebir-Uweinat region with those photographed by Mariner and Viking on Mars.",
    processes: [
      "Wind erosion that leaves streaks and forms similar to those of Mars (El-Baz and Maxwell, 1982).",
      "Dry valleys (wadis) carved in wetter times.",
    ],
    use_cases: [
      "Interpret Martian wind forms and dry valleys from orbital images of a terrestrial desert (El-Baz and Maxwell, 1982).",
    ],
    breaks_down: [
      "Mean temperature of 22.7 °C (NASA POWER), about 72 °C above Jezero (−49.4 °C).",
      "Its albedo (0.38) is higher than that of Jezero (0.17) and Gale (0.24).",
      "It is sandstone; Jezero and Gale have hydrated minerals and Jezero has basalt, so the similarity is in form and climate, not in composition.",
    ],
  },
  "earth-tibesti-chad": {
    summary:
      "Cenozoic volcanic province of the Chad Sahara. A 1977 study compared its volcanic forms with those of Elysium, on Mars.",
    processes: ["Cenozoic volcanism with units and chronology described in Bulletin of Volcanology (2015)."],
    use_cases: [
      "Compare terrestrial and Martian volcanic forms using orbital images (Geological Society of America Bulletin, 1977).",
    ],
    breaks_down: [
      "Jezero and Gale are impact craters with hydrated minerals: the similarity with them is topographic and climatic, not geological.",
      "Mean temperature of 23.5 °C (NASA POWER), about 73 °C above Jezero.",
    ],
  },
  "earth-arbol-de-piedra-siloli": {
    summary:
      "Sandstone formation about 7 m high in the Siloli desert, inside the Eduardo Avaroa Reserve (Potosí, Bolivia). It is a ventifact: wind-blown sand eroded its base until it became thin.",
    processes: ["Wind erosion by sand abrasion (ventifact)."],
    use_cases: [
      "Team proposal, no published study: study wind-eroded rocks on a cold, dry altiplano as a reference for the ventifacts of Mars.",
    ],
    breaks_down: [
      "We found no study that uses the Siloli Desert as a planetary analog.",
      "Mean temperature of 6.0 °C (NASA POWER), about 56 °C above Jezero and Gale.",
      "It is sandstone; Jezero and Gale have hydrated minerals and Jezero has basalt.",
    ],
  },
  "earth-harrat-khaybar": {
    summary:
      "Mature monogenetic volcanic field in the interior of Saudi Arabia, described for its value as geological heritage.",
    processes: ["Monogenetic volcanism with cones and lava flows in an arid climate (Geoheritage, 2017)."],
    use_cases: ["Team proposal, no published study: practice reconnaissance of arid volcanic fields with rovers or drones."],
    breaks_down: [NO_STUDY, `Mean temperature of 25.7 °C (NASA POWER), about 75 °C above Jezero. ${CELL}`],
  },
  "earth-laguna-colorada": {
    summary:
      "Shallow salt lake (0.35 m on average) at about 4,278 m in southwestern Bolivia. Its red color comes from sediments and pigmented algae such as Dunaliella salina, and the halophilic bacterium Halomonas andesensis was isolated from it.",
    processes: [
      "Evaporation that leaves borax islands and waters rich in sodium chloride, borates and sulfates.",
      "Halophilic life in salty, cold, high-altitude water (International Journal of Systematic and Evolutionary Microbiology, 2010).",
    ],
    use_cases: ["Team proposal, no published study: study halophilic microbes and salts as a reference for Martian brines."],
    breaks_down: [
      "It is a lake with liquid water and abundant life, including flamingos; Jezero and Gale had lakes billions of years ago.",
      "Mean temperature of 5.0 °C (NASA POWER), about 56 °C above Gale.",
    ],
  },
  "earth-el-malpais-nuevo-mexico": {
    summary:
      "Lava field in New Mexico with lava tubes, where minerals and rock forms typical of these caves were described.",
    processes: [
      "Formation of lava tubes in basaltic flows and deposition of minerals inside them (New Mexico Mineral Symposium, 1989).",
    ],
    use_cases: ["Team proposal: practice exploring lava tubes, which on the Moon and Mars could serve as shelter."],
    breaks_down: [
      "The NASA POWER cell gives 288 mm of annual precipitation: it has more water than any Martian site.",
      "Mean temperature of 11.3 °C (NASA POWER), about 61 °C above Jezero.",
    ],
  },
  "earth-mar-de-arena-namib": {
    summary: "Coastal sand sea of the Namib Desert, in Namibia, the subject of a 2026 monograph.",
    processes: ["Dune formation by wind (The Namib Sand Sea, 2026)."],
    use_cases: ["Team proposal: test rover mobility in active dune fields."],
    breaks_down: [
      "Mean temperature of 21.1 °C (NASA POWER), about 72 °C above Gale.",
      "It is a coastal desert influenced by the ocean, which does not exist on Mars.",
    ],
  },
  "earth-mdrs-utah": {
    summary:
      "Mars Desert Research Station, a Mars mission simulation station in the Utah desert. During the Mars 160 mission (2016-2017) its crews recorded 35 lichen species.",
    processes: ["Desert environment with exposed soils and erosion."],
    use_cases: [
      "Simulation of human missions to Mars (Mars 160).",
      "Rehearse geological-site conservation practices for future missions to Mars (Planetary and Space Science, 2025).",
    ],
    breaks_down: [
      "It has lichens and other life at the surface: 35 species recorded (Check List, 2024).",
      "The NASA POWER cell gives 241 mm of annual precipitation and 12.2 °C on average, far from Gale's −50 °C.",
    ],
  },
  "earth-ubehebe-valle-de-la-muerte": {
    summary:
      "Volcanic crater in Death Valley (California). A 2015 study describes Little Ice Age debris lobes and nivation hollows inside it and asks whether they are analogs of forms in Martian craters.",
    processes: [
      "Nivation and debris processes on the walls of a crater during the Little Ice Age (Geomorphology, 2015).",
    ],
    use_cases: ["Compare slope forms in terrestrial and Martian craters (Geomorphology, 2015)."],
    breaks_down: [
      "The study itself poses the analogy as a question, not as a conclusion.",
      "It is a volcanic crater, not an impact crater like Jezero and Gale.",
      CELL,
    ],
  },
  "earth-badain-jaran-china": {
    summary: "Desert in northern China famous for its megadunes, whose geomorphology was described in 2004.",
    processes: ["Megadune formation by wind (Geomorphology, 2004)."],
    use_cases: ["Team proposal: compare terrestrial megadunes with Martian dune fields, such as those at Gale."],
    breaks_down: [NO_STUDY, "Mean temperature of 9.9 °C (NASA POWER), about 61 °C above Gale."],
  },
  "earth-desierto-tengger": {
    summary:
      "Arid desert of about 36,700 km² in northern China, mostly in Inner Mongolia. It is spreading because of river diversion and deforestation.",
    processes: ["Dune advance and desertification."],
    use_cases: ["Team proposal, no published study: study active dunes as a reference for those at Gale."],
    breaks_down: [NO_STUDY, "The NASA POWER cell gives 179 mm of annual precipitation and 10.0 °C on average."],
  },
  "earth-cuenca-qaidam": {
    summary:
      "Desert basin in northwestern China, described as an analog of Mars. Its linear dunes were compared with those of Chasma Boreale, and 1,773 microbial genomes were recovered from desert samples.",
    processes: [
      "Formation of linear dunes by wind (Geomorphology, 2018).",
      "Microbial life in a Mars-analog desert (Scientific Data, 2025).",
    ],
    use_cases: [
      "Study how linear dunes form to interpret those of Chasma Boreale (Geomorphology, 2018).",
      "Catalog the microbial life of an analog desert (Scientific Data, 2025).",
    ],
    breaks_down: [
      "Arcadia Planitia is characterized by permafrost; Qaidam has a mean of 7.0 °C (NASA POWER), about 85 °C more.",
      "The point is an approximate center of the basin; the variables describe the region.",
    ],
  },
  "earth-dasht-e-kavir": {
    summary:
      "Great Salt Desert, in the center of the Iranian plateau. NASA Earth Observatory describes shallow waters, mudflats and saline wetlands in its valleys.",
    processes: ["Seasonal ponding and evaporation on salt flats."],
    use_cases: ["Team proposal, no published study: compare very flat salt plains with Arcadia Planitia."],
    breaks_down: [
      NO_STUDY,
      "Mean temperature of 21.1 °C (NASA POWER), about 99 °C above Arcadia Planitia (−77.9 °C), which has permafrost.",
    ],
  },
  "earth-desierto-de-lut-iran": {
    summary:
      "Desert in eastern Iran. Its yardangs were proposed as analogs of Martian yardangs and its barchan dunes were characterized along with the wind regime.",
    processes: [
      "Wind erosion that forms yardangs (Geological Society of America Abstracts, 2017).",
      "Barchan dune migration according to the wind (Zeitschrift für Geomorphologie, 2021).",
    ],
    use_cases: [
      "Interpret Martian yardangs and barchans with field measurements (GSA, 2017; Zeitschrift für Geomorphologie, 2021).",
    ],
    breaks_down: [
      "Mean temperature of 26.0 °C (NASA POWER), one of the highest in the ranking, about 75 °C above Jezero.",
      "The yardang comparison is one of form; the materials and the wind on Mars are different.",
    ],
  },
  "earth-salar-de-coipasa": {
    summary:
      "Salt flat of the Bolivian Altiplano, next to the Salar de Uyuni. NASA describes Uyuni and Coipasa as natural laboratories for studying the Martian environment.",
    processes: [
      "Lake-level variation over the last ~40,000 years recorded in its sediments (Quaternary Research, 2018).",
      "Fluvial and aeolian processes in a salt flat (NASA Earth Observatory).",
    ],
    use_cases: [
      "Study the salts and sediments of a salt flat as a reference for fluvial and aeolian processes on Mars (NASA Earth Observatory).",
    ],
    breaks_down: [
      "The NASA POWER cell gives 296 mm of annual precipitation: the salt flat floods in the rainy season.",
      "Mean temperature of 11.3 °C (NASA POWER), about 89 °C above Arcadia Planitia, which has permafrost.",
    ],
  },
  "earth-rub-al-khali": {
    summary:
      "Great sand sea of the Arabian Peninsula, hyper-arid, with less than 35 mm of rain a year and dunes up to 250 m. Its barchanoid megadunes were studied to understand the self-organization of dune fields.",
    processes: ["Self-organization and maturation of megadune fields (Geomorphology, 2010)."],
    use_cases: ["Team proposal: compare the organization of terrestrial and Martian dune fields."],
    breaks_down: [
      "Mean temperature of 30.3 °C (NASA POWER), the highest of the Arcadia Planitia top 10 and about 108 °C above that site.",
      "Its albedo (0.43) is double that of Arcadia Planitia (0.21).",
    ],
  },
  "earth-lago-eyre-australia": {
    summary:
      "Almost always dry salt lake in southern Australia, with the lowest natural point in the country (about 15 m below sea level). Its salt crust reaches 50 cm and dissolves in the big floods, which fill it completely only a few times per century.",
    processes: ["Flooding and evaporation cycles that dissolve and re-form the salt crust."],
    use_cases: [
      "Team proposal, no published study: compare salt crusts and their evolution with salt deposits on Mars.",
    ],
    breaks_down: [
      "We found no published study that uses it as a planetary analog.",
      "It floods periodically with rainwater that fell upstream; Arcadia Planitia has no liquid water at the surface.",
      "Mean temperature of 23.9 °C (NASA POWER), about 102 °C above Arcadia Planitia.",
    ],
  },
  "earth-salar-de-arizaro": {
    summary:
      "Salt flat of about 1,600 km² at 3,460 m in the Argentine Puna, the sixth largest in the world. It is in the Lithium Triangle and has the Arita Cone as a landmark.",
    processes: ["Very flat salt plain (0.7 m of relief in the 10 km window, Terrain Tiles)."],
    use_cases: ["Team proposal, no published study: compare high-altitude salt plains with Martian plains."],
    breaks_down: [
      "We found no study that uses it as a planetary analog; Puna studies focus on other salt flats.",
      "The NASA POWER cell gives 486 mm of annual precipitation, a hardly credible value for the Puna: the cell is too coarse.",
      "Mean temperature of 7.0 °C (NASA POWER), about 85 °C above Arcadia Planitia.",
    ],
  },
  "earth-etosha-namibia": {
    summary:
      "Large ephemeral salt pan in northern Namibia. A satellite record from 2000 to 2022 identified dust-emission “hot spots” controlled by the surface geochemistry.",
    processes: ["Dust emission from the crust of an ephemeral salt pan (EGU, 2025)."],
    use_cases: [
      "Study which surfaces emit dust, a key question for understanding dust on Mars (team proposal based on EGU, 2025).",
    ],
    breaks_down: [
      "The NASA POWER cell gives 402 mm of annual precipitation: it is not a hyper-arid desert.",
      "Mean temperature of 25.2 °C (NASA POWER), about 103 °C above Arcadia Planitia.",
    ],
  },
  "earth-desierto-de-taklamakan": {
    summary:
      "Sand desert of about 337,000 km² in western China, with a cold-desert climate and mobile dunes 18 to 91 m high. The Tazhong station records about 26 mm of rain a year.",
    processes: ["Dunes that move with the wind.", "Dust storms, mostly in spring."],
    use_cases: ["Team proposal, no published study: compare its sand plains with Arcadia Planitia."],
    breaks_down: [
      NO_STUDY,
      "NASA POWER gives 58 mm a year, more than double the Tazhong station (26 mm): the cell is coarse.",
      "Mean temperature of 14.7 °C (NASA POWER), about 93 °C above Arcadia Planitia, which has permafrost.",
    ],
  },
};
