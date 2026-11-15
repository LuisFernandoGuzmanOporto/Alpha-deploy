import type { Ficha } from "../types";

export type FactSheetText = Pick<Ficha, "summary" | "processes" | "use_cases" | "breaks_down">;
const bias = "The NASA POWER grid cell differs from the point's elevation by more than 500 m, so temperature may be biased (warning in the candidate's notes).";
const lunar = "It enters the lunar top 10 only because of slope and relief: it has neither permanently shadowed ice nor the cold of the lunar poles.";
const noStudy = "We found no study using this location as a planetary analog.";

/** Traducciones editoriales de las fichas publicadas; las referencias se conservan del original. */
export const fichasEn: Record<string, FactSheetText> = {
  "earth-gilf-kebir": {
    summary: "Sandstone plateau of about 7770 km² between Egypt and Libya, with mean precipitation of just 0.1 mm per year. El-Baz and Maxwell (1982, NASA) compared wind- and water-eroded landforms in the Gilf Kebir-Uweinat region with those photographed by Mariner and Viking on Mars.",
    processes: ["Wind erosion leaves streaks and landforms resembling those on Mars (El-Baz and Maxwell, 1982).", "Dry valleys (wadis) carved during wetter periods."],
    use_cases: ["Interpret wind-shaped landforms and dry valleys on Mars using orbital imagery of a terrestrial desert (El-Baz and Maxwell, 1982)."],
    breaks_down: ["Mean temperature is 22.7 °C (NASA POWER), about 72 °C warmer than Jezero (−49.4 °C).", "Its albedo (0.38) is higher than that of Jezero (0.17) and Gale (0.24).", "It is sandstone; Jezero and Gale have hydrated minerals, and Jezero has basalt, so the similarity concerns landforms and climate rather than composition."],
  },
  "earth-tibesti-chad": {
    summary: "Cenozoic volcanic province in the Sahara of Chad. A 1977 study compared its volcanic landforms with those of Elysium on Mars.",
    processes: ["Cenozoic volcanism with units and chronology described in Bulletin of Volcanology (2015)."],
    use_cases: ["Compare terrestrial and Martian volcanic landforms using orbital imagery (Geological Society of America Bulletin, 1977)."],
    breaks_down: ["Jezero and Gale are impact craters with hydrated minerals: the similarity is topographic and climatic, not geological.", "Mean temperature is 23.5 °C (NASA POWER), about 73 °C warmer than Jezero."],
  },
  "earth-arbol-de-piedra-siloli": {
    summary: "Sandstone formation about 7 m high in the Siloli Desert, inside Eduardo Avaroa Reserve (Potosí, Bolivia). It is a ventifact: sand-laden wind eroded its base until it became narrow.",
    processes: ["Wind erosion through abrasion by sand (ventifact)."],
    use_cases: ["Team proposal, with no published study: study wind-eroded rocks on a cold, dry high plateau as a reference for Martian ventifacts."],
    breaks_down: ["We found no study using the Siloli Desert as a planetary analog.", "Mean temperature is 6.0 °C (NASA POWER), about 56 °C warmer than Jezero and Gale.", "It is sandstone; Jezero and Gale have hydrated minerals, and Jezero has basalt."],
  },
  "earth-harrat-khaybar": {
    summary: "Mature monogenetic volcanic field in inland Saudi Arabia, described for its geological heritage value.",
    processes: ["Monogenetic volcanism with cones and lava flows in an arid climate (Geoheritage, 2017)."],
    use_cases: ["Team proposal, with no published study: practice surveying arid volcanic fields with rovers or drones."],
    breaks_down: [noStudy, "Mean temperature is 25.7 °C (NASA POWER), about 75 °C warmer than Jezero. " + bias],
  },
  "earth-laguna-colorada": {
    summary: "Shallow saline lake (mean depth 0.35 m) at about 4278 m in southwestern Bolivia. Its red color comes from sediment and pigmented algae such as Dunaliella salina; the halophilic bacterium Halomonas andesensis was isolated there.",
    processes: ["Evaporation leaves borax islands and waters rich in sodium chloride, borates and sulfates.", "Halophilic life in cold, high-altitude saline water (International Journal of Systematic and Evolutionary Microbiology, 2010)."],
    use_cases: ["Team proposal, with no published study: study halophilic microbes and salts as a reference for Martian brines."],
    breaks_down: ["It is a lake with liquid water and abundant life, including flamingos; Jezero and Gale had lakes billions of years ago.", "Mean temperature is 5.0 °C (NASA POWER), about 56 °C warmer than Gale."],
  },
  "earth-el-malpais-nuevo-mexico": {
    summary: "Lava field in New Mexico with lava tubes, where minerals and rock forms characteristic of these caves have been described.",
    processes: ["Lava tubes form within basaltic flows, with minerals deposited inside them (New Mexico Mineral Symposium, 1989)."],
    use_cases: ["Team proposal: practice exploring lava tubes, which could provide shelter on the Moon and Mars."],
    breaks_down: ["NASA POWER gives 288 mm of annual precipitation: it has more water than any Martian site.", "Mean temperature is 11.3 °C (NASA POWER), about 61 °C warmer than Jezero."],
  },
  "earth-mar-de-arena-namib": {
    summary: "Coastal sand sea in the Namib Desert, Namibia, the subject of a 2026 monograph.",
    processes: ["Wind-driven dune formation (The Namib Sand Sea, 2026)."],
    use_cases: ["Team proposal: test rover mobility in active dune fields."],
    breaks_down: ["Mean temperature is 21.1 °C (NASA POWER), about 72 °C warmer than Gale.", "It is a coastal desert influenced by an ocean, which does not exist on Mars."],
  },
  "earth-mdrs-utah": {
    summary: "Mars Desert Research Station, a station simulating Martian missions in the Utah desert. During the Mars 160 mission (2016-2017), its crews recorded 35 lichen species.",
    processes: ["Desert environment with exposed soils and erosion."],
    use_cases: ["Simulate human missions to Mars (Mars 160).", "Test geological site conservation practices for future missions to Mars (Planetary and Space Science, 2025)."],
    breaks_down: ["It has lichens and other surface life: 35 species recorded (Check List, 2024).", "NASA POWER gives 241 mm of annual precipitation and a mean temperature of 12.2 °C, far from Gale's −50 °C."],
  },
  "earth-ubehebe-valle-de-la-muerte": {
    summary: "Volcanic crater in Death Valley, California. A 2015 study describes Little Ice Age debris lobes and nivation hollows inside it and asks whether they are analogs of landforms in Martian craters.",
    processes: ["Nivation and debris processes on crater walls during the Little Ice Age (Geomorphology, 2015)."],
    use_cases: ["Compare slope landforms in terrestrial and Martian craters (Geomorphology, 2015)."],
    breaks_down: ["The study itself presents the analogy as a question, not a conclusion.", "It is a volcanic crater, not an impact crater like Jezero and Gale.", bias],
  },
  "earth-badain-jaran-china": {
    summary: "Desert in northern China famous for its megadunes, whose geomorphology was described in 2004.",
    processes: ["Wind-driven megadune formation (Geomorphology, 2004)."],
    use_cases: ["Team proposal: compare terrestrial megadunes with Martian dune fields, such as those in Gale."],
    breaks_down: [noStudy, "Mean temperature is 9.9 °C (NASA POWER), about 61 °C warmer than Gale."],
  },
  "earth-desierto-tengger": {
    summary: "Arid desert of about 36 700 km² in northern China, mainly in Inner Mongolia. It is expanding because of river diversion and deforestation.",
    processes: ["Dune advance and desertification."],
    use_cases: ["Team proposal, with no published study: study active dunes as a reference for those in Gale."],
    breaks_down: [noStudy, "NASA POWER gives 179 mm of annual precipitation and a mean temperature of 10.0 °C."],
  },
  "earth-cuenca-qaidam": {
    summary: "Desert basin in northwestern China described as a Mars analog. Its linear dunes have been compared with those of Chasma Boreale, and 1773 microbial genomes have been recovered from desert samples.",
    processes: ["Wind-driven formation of linear dunes (Geomorphology, 2018).", "Microbial life in a Mars-analog desert (Scientific Data, 2025)."],
    use_cases: ["Study how linear dunes form to interpret those in Chasma Boreale (Geomorphology, 2018).", "Catalog microbial life in an analog desert (Scientific Data, 2025)."],
    breaks_down: ["Arcadia Planitia is characterized by permafrost; Qaidam has a mean temperature of 7.0 °C (NASA POWER), about 85 °C warmer.", "The point is an approximate basin center; the variables describe the region."],
  },
  "earth-dasht-e-kavir": {
    summary: "Great Salt Desert in the central Iranian Plateau. NASA Earth Observatory describes shallow water, mudflats and saline wetlands in its valleys.",
    processes: ["Seasonal ponding and evaporation on saline plains."],
    use_cases: ["Team proposal, with no published study: compare very flat saline plains with Arcadia Planitia."],
    breaks_down: [noStudy, "Mean temperature is 21.1 °C (NASA POWER), about 99 °C warmer than Arcadia Planitia (−77.9 °C), which has permafrost."],
  },
  "earth-desierto-de-lut-iran": {
    summary: "Desert in eastern Iran. Its yardangs have been proposed as analogs of Martian yardangs, and its barchan dunes have been characterized together with the wind regime.",
    processes: ["Wind erosion forms yardangs (Geological Society of America Abstracts, 2017).", "Wind-driven migration of barchan dunes (Zeitschrift für Geomorphologie, 2021)."],
    use_cases: ["Interpret Martian yardangs and barchans using field measurements (GSA, 2017; Zeitschrift für Geomorphologie, 2021)."],
    breaks_down: ["Mean temperature is 26.0 °C (NASA POWER), among the highest in the ranking and about 75 °C warmer than Jezero.", "The yardang comparison concerns shape; Martian materials and winds differ."],
  },
  "earth-salar-de-coipasa": {
    summary: "Salt flat on the Bolivian Altiplano, neighboring Uyuni Salt Flat. NASA describes Uyuni and Coipasa as natural laboratories for studying the Martian environment.",
    processes: ["Lake-level variations over the past ~40 000 years recorded in its sediments (Quaternary Research, 2018).", "Fluvial and wind-driven processes in a salt flat (NASA Earth Observatory)."],
    use_cases: ["Study salts and sediments in a salt flat as a reference for fluvial and wind-driven processes on Mars (NASA Earth Observatory)."],
    breaks_down: ["NASA POWER gives 296 mm of annual precipitation: the salt flat floods during the rainy season.", "Mean temperature is 11.3 °C (NASA POWER), about 89 °C warmer than Arcadia Planitia, which has permafrost."],
  },
  "earth-rub-al-khali": {
    summary: "Large, hyperarid sand sea on the Arabian Peninsula, with less than 35 mm of rain per year and dunes up to 250 m high. Its mega-barchanoid dunes have been studied to understand dune-field self-organization.",
    processes: ["Self-organization and maturation of megadune fields (Geomorphology, 2010)."],
    use_cases: ["Team proposal: compare the organization of terrestrial and Martian dune fields."],
    breaks_down: ["Mean temperature is 30.3 °C (NASA POWER), the highest in Arcadia Planitia's top 10 and about 108 °C warmer than that site.", "Its albedo (0.43) is twice that of Arcadia Planitia (0.21)."],
  },
  "earth-lago-eyre-australia": {
    summary: "Usually dry salt lake in southern Australia, containing the country's lowest natural point (about 15 m below sea level). Its salt crust reaches 50 cm and dissolves during major floods, which completely fill the lake only a few times per century.",
    processes: ["Flooding and evaporation cycles dissolve and reform the salt crust."],
    use_cases: ["Team proposal, with no published study: compare salt crusts and their evolution with salt deposits on Mars."],
    breaks_down: ["We found no published study using it as a planetary analog.", "It periodically floods with rainwater from upstream; Arcadia Planitia has no surface liquid water.", "Mean temperature is 23.9 °C (NASA POWER), about 102 °C warmer than Arcadia Planitia."],
  },
  "earth-salar-de-arizaro": {
    summary: "Salt flat of about 1600 km² at 3460 m in the Argentine Puna, the world's sixth largest. It lies in the Lithium Triangle, with Cono de Arita as a landmark.",
    processes: ["Very flat saline plain (relief of 0.7 m within the 10 km window, Terrain Tiles)."],
    use_cases: ["Team proposal, with no published study: compare high-altitude saline plains with Martian plains."],
    breaks_down: ["We found no study using it as a planetary analog; Puna studies focus on other salt flats.", "NASA POWER gives 486 mm of annual precipitation, an implausible value for the Puna: the grid cell is too coarse.", "Mean temperature is 7.0 °C (NASA POWER), about 85 °C warmer than Arcadia Planitia."],
  },
  "earth-etosha-namibia": {
    summary: "Large ephemeral salt pan in northern Namibia. A satellite record from 2000 to 2022 identified dust-emission 'hot spots' controlled by surface geochemistry.",
    processes: ["Dust emission from the crust of an ephemeral salt pan (EGU, 2025)."],
    use_cases: ["Study which surfaces emit dust, a key question for understanding dust on Mars (team proposal based on EGU, 2025)."],
    breaks_down: ["NASA POWER gives 402 mm of annual precipitation: this is not a hyperarid desert.", "Mean temperature is 25.2 °C (NASA POWER), about 103 °C warmer than Arcadia Planitia."],
  },
  "earth-desierto-de-taklamakan": {
    summary: "Sandy desert of about 337 000 km² in western China, with a cold-desert climate and mobile dunes 18 to 91 m high. Tazhong station records about 26 mm of rain per year.",
    processes: ["Dunes migrate with the wind.", "Dust storms, especially in spring."],
    use_cases: ["Team proposal, with no published study: compare its sandy plains with Arcadia Planitia."],
    breaks_down: [noStudy, "NASA POWER gives 58 mm per year, more than twice Tazhong station's 26 mm: the grid cell is coarse.", "Mean temperature is 14.7 °C (NASA POWER), about 93 °C warmer than Arcadia Planitia, which has permafrost."],
  },
  "earth-atacama-nucleo-hiperarido": {
    summary: "Hyperarid core of the Atacama Desert in northern Chile. Navarro-González and colleagues (2003) described Mars-like soils there, with only trace amounts of organic compounds and very few culturable bacteria.",
    processes: ["Hyperaridity: 11 mm of annual precipitation in the NASA POWER grid cell.", "Non-biological decomposition of organic compounds in soil, observed in experiments inspired by Viking's labeled-release experiment (Navarro-González et al., 2003)."],
    use_cases: ["Test life- and organic-compound-detection experiments in nearly sterile soils, such as the Viking experiments (Navarro-González et al., 2003).", "Study variations in organic matter in the surface horizons of Mars-like soils (Advances in Space Research, 2012)."],
    breaks_down: ["Mean surface temperature is 15.7 °C (NASA POWER), about 66 °C warmer than Gale (−50.7 °C) and about 176 °C warmer than Faustini Rim A (−160.4 °C, Diviner).", lunar, "The point used is the center of the desert, not the Yungay station: the variables describe the region rather than the precise study site."],
  },
  "earth-licancabur-laguna-verde": {
    summary: "Crater lake on Licancabur volcano (5868 m), on the Bolivia–Chile border. A chapter in The Geology of Mars (2007) uses high-altitude lakes like this as clues to understanding Noachian aqueous environments on Mars.",
    processes: ["High-altitude crater lake used as a reference for ancient aqueous environments on Mars (The Geology of Mars, 2007).", "Pronounced volcanic terrain: mean slope of 15° and local relief of 434 m within the 10 km window (Terrain Tiles)."],
    use_cases: ["Search for signatures of habitats and life in high-altitude lakes to guide exploration of Martian paleolakes (The Geology of Mars, 2007)."],
    breaks_down: ["It ranks first for Peak Near Cabeus B and Malapert because of slope and relief, but its mean temperature (14.7 °C) is about 140 °C higher than at those sites (Diviner).", bias, "It has surface liquid water today; Martian lakes are ancient and no longer exist on the surface."],
  },
  "earth-laguna-verde-bolivia": {
    summary: "Saline lake at about 4300 m at the foot of Licancabur volcano in southwestern Bolivia. Its waters carry suspended minerals, including arsenic, and change from turquoise to emerald green when wind stirs the sediment.",
    processes: ["Wind-driven resuspension of sediment changes the water's color.", "Saline water with dissolved and suspended minerals, including arsenic."],
    use_cases: ["Team proposal, with no published study: compare its chemistry with that of the neighboring crater lake, which is studied as a Mars analog."],
    breaks_down: ["We found no study using it as a planetary analog; its position in the lunar ranking reflects the window's relief, not its chemistry.", "It shares a NASA POWER grid cell with Licancabur Lake: temperature (14.7 °C) does not distinguish the two locations. " + bias, "It has liquid water on the surface, which exists today on neither the Moon nor Mars."],
  },
  "earth-uturuncu-bolivia": {
    summary: "A 6008 m volcano in southern Bolivia that has not erupted for about 250 000 years but shows ground deformation, seismicity and active fumaroles. It is therefore described as a 'zombie' volcano.",
    processes: ["Ground uplift detected by satellite radar since 1992, at 1 to 2 cm per year between 1992 and 2006.", "Carbon dioxide and water-vapor fumaroles that deposit sulfur."],
    use_cases: ["Team proposal, with no published study: test the combination of geophysical methods (magnetotellurics and density) used to investigate its internal structure."],
    breaks_down: ["The study of the Altiplano-Puna volcanic complex as a planetary analog covers the Chilean sector; we found none on this volcano.", bias, lunar],
  },
  "earth-ojos-del-salado": {
    summary: "Earth's highest volcano (6893 m), in the Arid Diagonal of the Andes between Chile and Argentina. Extreme aridity leaves almost no surface ice, although ice-bearing permafrost may exist.",
    processes: ["Ground thermal regime measured over four years (2012-2016) at six sites between 4200 and 6893 m (Permafrost and Periglacial Processes, 2018).", "Possible permafrost in an extremely arid climate."],
    use_cases: ["Team proposal: test subsurface temperature and ice-detection sensors on steep, very dry terrain."],
    breaks_down: ["At a mean of −1.3 °C it is the coldest location in the lunar top 10, but still about 124 °C warmer than Peak Near Cabeus B (Diviner).", "NASA POWER gives 219 mm of annual precipitation, although the field study describes an extremely arid climate: the grid cell is too coarse for the summit. " + bias],
  },
  "earth-volcan-socompa": {
    summary: "Volcano in the Puna de Atacama where fumaroles near the summit (6051 m) sustain microbial mat communities. They are isolated in a barren landscape: vascular plants do not extend above about 4600 m.",
    processes: ["Fumarolic activity supplies heat and moisture in a hyperarid, high-altitude environment (Applied and Environmental Microbiology, 2009)."],
    use_cases: ["Study how a geothermal source sustains islands of life in a cold, dry landscape, as a way to consider geothermal habitats on Mars (team proposal)."],
    breaks_down: ["Life depends on volcanic heat, which the lunar polar sites do not have.", bias, lunar],
  },
  "earth-nevado-sajama": {
    summary: "Volcano on the Bolivian Altiplano, about 100 km from the Pacific coast, with the southernmost tropical glacier. Its snowline was tracked with Landsat and aerial photography from 1963 to 1998 to study the influence of El Niño.",
    processes: ["Variations in the glacier's snowline with rainfall and El Niño (Journal of Geophysical Research, 2001)."],
    use_cases: ["Team proposal: test methods for tracking ice and snow in satellite imagery on a high-altitude volcano."],
    breaks_down: ["Its ice comes from snowfall; at the lunar poles, ice would be trapped in permanently shadowed craters without precipitation.", "NASA POWER gives 376 mm of annual precipitation, among the highest in the lunar top 10. " + bias, lunar],
  },
  "earth-torotoro-umajalanta": {
    summary: "Limestone cave in Torotoro National Park (Potosí, Bolivia), with about 4.5 km explored according to speleological sources. Its use as a planetary analog is a team hypothesis.",
    processes: ["Dissolution of limestone by groundwater (karst)."],
    use_cases: ["Team proposal, with no published study: practice navigation, mapping and communications inside a cave."],
    breaks_down: ["It is a water-formed karst cave; caves sought as shelters on the Moon and Mars are mainly lava tubes.", "It receives 533 mm of annual precipitation (NASA POWER), the highest among candidates in the lunar top 10.", lunar],
  },
  "earth-volcan-tunupa-uyuni": {
    summary: "Extinct 5321 m stratovolcano forming a peninsula on the northern side of Uyuni Salt Flat. It consists mainly of andesite, trachyandesite and trachydacite lavas about 1.4 to 1.6 million years old.",
    processes: ["Volcanic terrain surrounded by the saline plain of Uyuni Salt Flat."],
    use_cases: ["Team proposal, with no published study: test a rover's transition between steep volcanic terrain and a saline plain."],
    breaks_down: [noStudy, "NASA POWER gives 332 mm of annual precipitation. " + bias, lunar],
  },
  "earth-macizo-del-hoggar": {
    summary: "Mountain massif in southern Algeria, composed mainly of metamorphic rocks about 2000 million years old with areas of more recent volcanism. Its highest point is Mount Tahat (2908 m).",
    processes: ["Erosion of ancient volcanic domes leaves isolated peaks."],
    use_cases: ["Team proposal, with no published study: compare eroded volcanic peaks with highland terrain on Mars."],
    breaks_down: ["It ranks tenth for Faustini Rim A with a low score (52.4): the match is weak and purely topographic.", "Mean temperature is 22.5 °C (NASA POWER), about 183 °C warmer than Faustini Rim A (Diviner). " + bias],
  },
  "earth-montanas-del-pamir": {
    summary: "Cold mountain desert in the eastern Pamir (Tajikistan). Endolithic cyanobacteria have been studied there: they live inside rocks to withstand a harsh, highly variable climate.",
    processes: ["Microbial colonization of rock interiors in a cold desert (Microorganisms, 2020)."],
    use_cases: ["Study endolithic life as a model for where to search for life protected beneath rock surfaces on Mars (team proposal based on Microorganisms, 2020)."],
    breaks_down: ["At a mean of −4.7 °C it is among the coldest locations in the ranking, but still about 120 °C warmer than Peak Near Cabeus B (Diviner).", "The point is an approximate regional center, not a study site. " + bias, lunar],
  },
};
