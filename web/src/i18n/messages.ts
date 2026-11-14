// Textos de la interfaz en español e inglés. Los textos de variables, etiquetas y limitaciones
// viven en `content/` (Noe); aquí van todos los demás. El inglés debe tener las mismas claves.

export type Lang = "es" | "en";

const es = {
  "app.brand": "Earth Analogs",
  "app.discoveries": "Descubrimientos",
  "app.methodology": "Metodología",
  "app.notFound": "Página no encontrada.",
  "app.loading": "Cargando…",
  "lang.label": "Idioma",
  "lang.es": "Español",
  "lang.en": "English",

  "common.noData": "sin dato",
  "common.none": "ninguna",
  "common.backHome": "Volver al inicio",

  "error.load": "Error al cargar los datos: {message}",
  "error.unknown": "Error desconocido",
  "error.http": "No se pudo cargar {file} (HTTP {status})",
  "error.json": "{file} no es un JSON válido",
  "error.lists": "sites.json y candidates.json deben ser listas",
  "error.boundary": "Algo salió mal al mostrar esta pantalla: {message}",

  "home.empty": "Aún no hay sitios o candidatos cargados.",
  "home.siteData": "Datos del sitio",
  "home.weights": "Ajustar el peso de cada variable",
  "home.countOne": "{n} análogo en el ranking.",
  "home.countMany": "{n} análogos en el ranking.",
  "home.globe": "Ver en el globo 3D",
  "home.loadingMap": "Cargando mapa…",
  "home.loadingGlobe": "Cargando globo…",
  "filters.bolivia": "Solo Bolivia",
  "filters.unstudied": "Solo lugares poco estudiados",
  "selector.label": "Sitio de la Luna o Marte",
  "body.moon": "Luna",
  "body.mars": "Marte",
  "body.earth": "Tierra",

  "siteinfo.aria": "Datos de {name}",
  "siteinfo.noCoords": "coordenadas sin dato",
  "siteinfo.tags": "Etiquetas: {tags}",

  "weights.legend": "Peso de cada variable en el índice",
  "weights.reset": "Restablecer pesos",

  "ranking.empty": "No hay análogos que cumplan los filtros.",
  "ranking.noCoords": " · sin coordenadas",
  "ranking.shared": "Coincidencias: {tags} ({jaccard}). ",
  "ranking.noOverlap": "Coincidencias cualitativas: sin dato. ",
  "ranking.compare": "Ver comparación",
  "map.aria": "Mapa de análogos terrestres",

  "discoveries.title": "Descubrimientos",
  "discoveries.intro":
    "Los {n} mejores análogos poco estudiados de cada sitio: lugares que la literatura aún no documenta como análogo planetario, evaluados con el mismo índice que los conocidos.",
  "discoveries.noSites": "Aún no hay sitios cargados.",
  "discoveries.none": "No hay candidatos poco estudiados con datos suficientes para este sitio.",

  "compare.back": "← Volver al ranking",
  "compare.notFound": "No existe esa comparación.",

  "methodology.notice": "The full methodology document is written in Spanish.",

  "ficha.title": "Ficha: {name}",
  "ficha.aria": "Ficha de {name}",
  "ficha.none": "Este lugar aún no tiene ficha publicada.",
  "ficha.processes": "Procesos que sirven de análogo",
  "ficha.useCases": "Para qué sirve",
  "ficha.references": "Referencias",

  "cmp.comparedWith": "comparado con",
  "cmp.scorePre": "Índice de similitud: ",
  "cmp.scorePost": " de 100, con {n} de {total} variables.",
  "cmp.notRanked": "Este par no entra al ranking: tiene menos de 3 variables con dato en ambos lados.",
  "cmp.byVariable": "Variable por variable",
  "cmp.colVariable": "Variable",
  "cmp.colSimilarity": "Similitud",
  "cmp.colWords": "En palabras",
  "cmp.meterAria": "Similitud en {variable}",
  "cmp.note": "«Mucho» y «algo» son relativos al rango de todos los lugares comparados, no a la diferencia absoluta.",
  "cmp.profile": "Perfil de similitud",
  "cmp.radarAria": "Similitud por variable: {summary}",
  "cmp.radarName": "Similitud",
  "cmp.radarCaption": "100 % es idéntico en esa variable; 0 % es la mayor diferencia entre todos los lugares.",
  "cmp.tags": "Coincidencias cualitativas",
  "cmp.shared": "Comparten",
  "cmp.onlySite": "Solo {name}",
  "cmp.noTags": "Sin etiquetas suficientes para comparar geología, hielo, cuevas o polvo.",
  "cmp.breaks": "Dónde falla la analogía",
  "cmp.gapText": " el lugar terrestre es {description} ({candidate} frente a {site}).",
  "cmp.missingTag": " {site} lo tiene; {candidate} no.",
  "cmp.nothing": "Ninguna variable ni etiqueta difiere mucho.",
  "cmp.limitsBelow": " Aun así valen los límites de abajo.",
  "cmp.same": "parecido",
  "cmp.noCompare": "sin dato para comparar",
  "cmp.some": "algo {direction}",
  "cmp.much": "mucho {direction}",
  "cmp.dir.slope_deg.higher": "más empinado",
  "cmp.dir.slope_deg.lower": "más llano",
  "cmp.dir.relief_m.higher": "más accidentado",
  "cmp.dir.relief_m.lower": "más plano",
  "cmp.dir.temp_mean_c.higher": "más cálido",
  "cmp.dir.temp_mean_c.lower": "más frío",
  "cmp.dir.precip_mm_year.higher": "más lluvioso",
  "cmp.dir.precip_mm_year.lower": "más árido",
  "cmp.dir.albedo.higher": "más claro",
  "cmp.dir.albedo.lower": "más oscuro",

  "unit.slope_deg": "°",
  "unit.relief_m": "m",
  "unit.temp_mean_c": "°C",
  "unit.precip_mm_year": "mm/año",
  "unit.albedo": "",

  "globe.title": "Globo",
  "globe.tabs": "Cuerpo",
  "globe.aria": "Globo de {body}{summary}",
  "globe.summaryOne": " con 1 marcador",
  "globe.summaryMany": " con {n} marcadores",
  "globe.help": "Arrastra o usa las flechas del teclado para girarlo.",
  "globe.credit": "Textura: {credit}.",
  "globe.creditEarth": "NASA Blue Marble Next Generation, vía NASA GIBS",
  "globe.creditMoon": "Mosaico global LRO WAC (NASA/GSFC/ASU), vía Moon Trek",
  "globe.creditMars": "Mosaico color Viking MDIM 2.1 (NASA/USGS), vía Mars Trek",
  "globe.pickEarth": "Elige un sitio para ver sus mejores análogos en la Tierra.",
  "globe.pickSite": "Elige un sitio para marcarlo en el globo.",
  "globe.elsewhere": "El sitio elegido, {site}, está en {body}.",
  "globe.onMoon": "la Luna",
  "globe.onMars": "Marte",
  "globe.noCoords": "(sin coordenadas)",
  "globe.west": "O",
  "globe.loadingTexture": "Cargando textura…",
  "globe.textureError": "No se pudo cargar la textura del globo.",
  "globe.reset": "Volver al punto elegido",
} as const;

export type MessageKey = keyof typeof es;

/** Todas las claves del catálogo (el inglés está obligado por tipos a tener las mismas). */
export const MESSAGE_KEYS = Object.keys(es) as MessageKey[];

const en: Record<MessageKey, string> = {
  "app.brand": "Earth Analogs",
  "app.discoveries": "Discoveries",
  "app.methodology": "Methodology",
  "app.notFound": "Page not found.",
  "app.loading": "Loading…",
  "lang.label": "Language",
  "lang.es": "Español",
  "lang.en": "English",

  "common.noData": "no data",
  "common.none": "none",
  "common.backHome": "Back to home",

  "error.load": "Could not load the data: {message}",
  "error.unknown": "Unknown error",
  "error.http": "Could not load {file} (HTTP {status})",
  "error.json": "{file} is not valid JSON",
  "error.lists": "sites.json and candidates.json must be lists",
  "error.boundary": "Something went wrong while showing this screen: {message}",

  "home.empty": "No sites or candidates have been loaded yet.",
  "home.siteData": "Site data",
  "home.weights": "Adjust the weight of each variable",
  "home.countOne": "{n} analog in the ranking.",
  "home.countMany": "{n} analogs in the ranking.",
  "home.globe": "View on the 3D globe",
  "home.loadingMap": "Loading map…",
  "home.loadingGlobe": "Loading globe…",
  "filters.bolivia": "Bolivia only",
  "filters.unstudied": "Less-studied places only",
  "selector.label": "Moon or Mars site",
  "body.moon": "Moon",
  "body.mars": "Mars",
  "body.earth": "Earth",

  "siteinfo.aria": "Data for {name}",
  "siteinfo.noCoords": "coordinates not available",
  "siteinfo.tags": "Tags: {tags}",

  "weights.legend": "Weight of each variable in the index",
  "weights.reset": "Reset weights",

  "ranking.empty": "No analogs match the filters.",
  "ranking.noCoords": " · no coordinates",
  "ranking.shared": "Matching tags: {tags} ({jaccard}). ",
  "ranking.noOverlap": "Qualitative matches: no data. ",
  "ranking.compare": "View comparison",
  "map.aria": "Map of Earth analogs",

  "discoveries.title": "Discoveries",
  "discoveries.intro":
    "The {n} best less-studied analogs for each site: places that the literature does not yet document as planetary analogs, evaluated with the same index as the well-known ones.",
  "discoveries.noSites": "No sites have been loaded yet.",
  "discoveries.none": "There are no less-studied candidates with enough data for this site.",

  "compare.back": "← Back to ranking",
  "compare.notFound": "That comparison does not exist.",

  "methodology.notice": "The full methodology document is written in Spanish.",

  "ficha.title": "Fact sheet: {name}",
  "ficha.aria": "Fact sheet for {name}",
  "ficha.none": "This place has no published fact sheet yet.",
  "ficha.processes": "Processes that make it an analog",
  "ficha.useCases": "What it is useful for",
  "ficha.references": "References",

  "cmp.comparedWith": "compared with",
  "cmp.scorePre": "Similarity index: ",
  "cmp.scorePost": " out of 100, using {n} of {total} variables.",
  "cmp.notRanked": "This pair is not ranked: it has fewer than 3 variables with data on both sides.",
  "cmp.byVariable": "Variable by variable",
  "cmp.colVariable": "Variable",
  "cmp.colSimilarity": "Similarity",
  "cmp.colWords": "In words",
  "cmp.meterAria": "Similarity in {variable}",
  "cmp.note": "“Much” and “somewhat” are relative to the range of all places compared, not to the absolute difference.",
  "cmp.profile": "Similarity profile",
  "cmp.radarAria": "Similarity by variable: {summary}",
  "cmp.radarName": "Similarity",
  "cmp.radarCaption": "100% means identical in that variable; 0% is the largest difference among all places.",
  "cmp.tags": "Qualitative matches",
  "cmp.shared": "Shared",
  "cmp.onlySite": "Only {name}",
  "cmp.noTags": "Not enough tags to compare geology, ice, caves or dust.",
  "cmp.breaks": "Where the analogy breaks down",
  "cmp.gapText": " the Earth place is {description} ({candidate} versus {site}).",
  "cmp.missingTag": " {site} has it; {candidate} does not.",
  "cmp.nothing": "No variable or tag differs much.",
  "cmp.limitsBelow": " The limits below still apply.",
  "cmp.same": "similar",
  "cmp.noCompare": "no data to compare",
  "cmp.some": "somewhat {direction}",
  "cmp.much": "much {direction}",
  "cmp.dir.slope_deg.higher": "steeper",
  "cmp.dir.slope_deg.lower": "flatter",
  "cmp.dir.relief_m.higher": "more rugged",
  "cmp.dir.relief_m.lower": "smoother",
  "cmp.dir.temp_mean_c.higher": "warmer",
  "cmp.dir.temp_mean_c.lower": "colder",
  "cmp.dir.precip_mm_year.higher": "wetter",
  "cmp.dir.precip_mm_year.lower": "drier",
  "cmp.dir.albedo.higher": "brighter",
  "cmp.dir.albedo.lower": "darker",

  "unit.slope_deg": "°",
  "unit.relief_m": "m",
  "unit.temp_mean_c": "°C",
  "unit.precip_mm_year": "mm/yr",
  "unit.albedo": "",

  "globe.title": "Globe",
  "globe.tabs": "Body",
  "globe.aria": "Globe of {body}{summary}",
  "globe.summaryOne": " with 1 marker",
  "globe.summaryMany": " with {n} markers",
  "globe.help": "Drag or use the keyboard arrows to rotate it.",
  "globe.credit": "Texture: {credit}.",
  "globe.creditEarth": "NASA Blue Marble Next Generation, via NASA GIBS",
  "globe.creditMoon": "LRO WAC global mosaic (NASA/GSFC/ASU), via Moon Trek",
  "globe.creditMars": "Viking MDIM 2.1 color mosaic (NASA/USGS), via Mars Trek",
  "globe.pickEarth": "Choose a site to see its best analogs on Earth.",
  "globe.pickSite": "Choose a site to mark it on the globe.",
  "globe.elsewhere": "The selected site, {site}, is on {body}.",
  "globe.onMoon": "the Moon",
  "globe.onMars": "Mars",
  "globe.noCoords": "(no coordinates)",
  "globe.west": "W",
  "globe.loadingTexture": "Loading texture…",
  "globe.textureError": "The globe texture could not be loaded.",
  "globe.reset": "Back to the selected point",
};

const CATALOGS: Record<Lang, Record<MessageKey, string>> = { es, en };

export type TranslateParams = Record<string, string | number>;
export type Translate = (key: MessageKey, params?: TranslateParams) => string;

/** Devuelve un traductor para el idioma; `{nombre}` en el texto se reemplaza con `params.nombre`. */
export function makeT(lang: Lang): Translate {
  const catalog = CATALOGS[lang];
  return (key, params) => {
    const text = catalog[key];
    if (!params) return text;
    return text.replace(/\{(\w+)\}/g, (_, name: string) => String(params[name] ?? `{${name}}`));
  };
}

/** Traductor en español, valor por defecto de las funciones puras de `lib/` y `compare/`. */
export const tEs: Translate = makeT("es");
