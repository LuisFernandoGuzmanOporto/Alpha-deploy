/** Traduce únicamente la prosa mostrada; deja URLs, nombres de producto y cifras intactos. */
const scientificPhrases: readonly (readonly [string, string])[] = [
  ["Coordenadas: Centro del mosaico", "Coordinates: center of the mosaic"],
  ["Coordenadas planetocentricas, longitud este", "Planetocentric coordinates, east longitude"],
  ["Region retirada de la lista de Artemis III en octubre de 2024 (NASA paso de 13 a 9 regiones", "Region removed from the Artemis III list in October 2024 (NASA reduced the list from 13 to 9 regions"],
  ["Region vigente en la lista de 9 candidatas de Artemis III (octubre de 2024)", "Region on the current list of 9 Artemis III candidates (October 2024)"],
  ["El punto esta a unos 5,7 km del el sitio nocional de NASA", "The point is about 5.7 km from NASA's notional site"],
  ["citado por", "cited by"],
  ["Ventana: 42 x 42 pixeles LOLA de 240 m (unos 10 x 10 km en el suelo)", "Window: 42 x 42 LOLA pixels at 240 m (about 10 x 10 km on the ground)"],
  ["Temperatura: temp_avg de Diviner es la media anual modelada a 2 cm de profundidad", "Temperature: Diviner temp_avg is the modeled annual mean at a depth of 2 cm"],
  ["780 triangulos de la malla en la ventana", "780 mesh triangles within the window"],
  ["780 triangulos en la ventana", "780 triangles within the window"],
  ["Hielo: en el", "Ice: in"],
  ["% de los triangulos de la ventana el modelo termico de Diviner", "% of the window's triangles, the Diviner thermal model"],
  ["columna ice_depth", "ice_depth column"],
  ["da hielo de agua estable a 1 m o menos", "indicates water ice stable at a depth of 1 m or less"],
  ["es estabilidad termica (modelo de Paige et al.", "this is thermal stability (model by Paige et al."],
  ["no deteccion directa", "not direct detection"],
  ["Crater de impacto: la region es el borde del crater Faustini", "Impact crater: the region is the rim of Faustini crater"],
  ["Contexto: el impacto LCROSS detecto agua en el crater vecino Cabeus", "Context: the LCROSS impact detected water in the neighboring Cabeus crater"],
  ["Sin etiqueta polar-ice: la fraccion es baja y no hay cita de hielo en el macizo (los estudios de hielo nombran al crater Malapert, a unos 45 km)", "No polar-ice tag: the fraction is low and there is no citation for ice in the massif (ice studies name Malapert crater, about 45 km away)"],
  ["Albedo: null en el indice", "Albedo: null in the index"],
  ["Existe el albedo normal a 1064 nm de LOLA", "LOLA normal albedo at 1064 nm is available"],
  ["de media en la ventana (100 pixeles de 1 km), calculado con", "mean within the window (100 pixels at 1 km), calculated using"],
  ["No se usa porque es reflectancia en una sola longitud de onda y no es comparable con el albedo solar de banda ancha de la Tierra (NASA POWER, CERES) ni de Marte (MCD)", "It is not used because it is single-wavelength reflectance and is not comparable with the broadband solar albedo of Earth (NASA POWER, CERES) or Mars (MCD)"],
  ["Usarlo o no es decision de metodologia (Sebastian)", "Whether to use it is a methodology decision (Sebastián)"],
  ["Coordenadas: Octavia E. Butler Landing (aterrizaje de Perseverance)", "Coordinates: Octavia E. Butler Landing (Perseverance landing site)"],
  ["Coordenadas: Bradbury Landing (aterrizaje de Curiosity)", "Coordinates: Bradbury Landing (Curiosity landing site)"],
  ["planetocentricas, longitud este 0-360", "planetocentric, east longitude 0-360"],
  ["Elevacion MOLA en el punto", "MOLA elevation at the point"], ["publicada:", "published:"],
  ["Ventana: unos 10 x 10 km sobre MOLA de 463 m por pixel (mas grueso que los 240 m de LOLA; la pendiente sale suavizada respecto de un modelo de 250 m)", "Window: about 10 x 10 km on MOLA at 463 m per pixel (coarser than LOLA's 240 m; slope is smoothed compared with a 250 m model)"],
  ["Temperatura: media de la MCD con Ls uniforme, no ponderada por la duracion de cada estacion; es un valor de modelo, no medido", "Temperature: MCD mean with uniform Ls, not weighted by the duration of each season; this is a modeled value, not a measurement"],
  ["Albedo: albedo de suelo desnudo del modelo de la MCD (a verificar si es el mapa de TES que usa la MCD)", "Albedo: bare-ground albedo from the MCD model (whether this is the TES map used by MCD remains to be verified)"],
  ["Tags: crater de impacto", "Tags: impact crater"], ["nombre IAU", "IAU name"],
  ["minerales hidratados, arcillas y carbonatos del delta", "hydrated minerals, clays and carbonates in the delta"],
  ["basalto, rocas igneas del piso del crater", "basalt, igneous rocks on the crater floor"],
  ["minerales arcillosos en Yellowknife Bay", "clay minerals in Yellowknife Bay"],
  ["dunas eolicas activas Bagnold", "active Bagnold aeolian dunes"],
  ["Coordenadas: centro de Arcadia Planitia en el", "Coordinates: center of Arcadia Planitia in the"],
  ["se usa la red de control MDIM 2.1, la vigente en el gazetteer", "the MDIM 2.1 control network currently used by the gazetteer is used"],
  ["la red anterior MDIM 2.0 daba", "the earlier MDIM 2.0 network gave"],
  ["Es una llanura de unos 2200 km: el punto representa la region, no un sitio de aterrizaje concreto", "This is a plain about 2200 km across: the point represents the region, not a specific landing site"],
  ["Tags: permafrost, hielo en exceso extendido bajo la superficie", "Tags: permafrost, widespread subsurface excess ice"],
  ["pendiente media de Horn en ventana de 10 x 10 km", "mean Horn slope within a 10 x 10 km window"],
  ["desviacion estandar de la elevacion en ventana de 10 x 10 km", "standard deviation of elevation within a 10 x 10 km window"],
  ["promedio de temp_avg en la ventana de 10 x 10 km", "mean temp_avg within the 10 x 10 km window"],
  ["Sin atmosfera con precipitacion; valor definido como 0", "No atmosphere with precipitation; value defined as 0"],
  ["Sin precipitacion liquida en la superficie; valor definido como 0", "No liquid precipitation on the surface; value defined as 0"],
  ["escenario climatologico promedio, variable tsurf promediada sobre Ls 0-345 cada 15 grados y horas locales 0-23", "average climatological scenario, tsurf averaged over Ls 0-345 at 15-degree intervals and local hours 0-23"],
  ["variable ground_albedo (albedo de suelo desnudo del modelo), consultada con", "ground_albedo variable (model bare-ground albedo), queried using"],
  ["px/grado", "px/degree"], [", tesela ", ", tile "],
  ["Polar Resource Product sur", "Polar Resource Product south"],
  ["calculada con", "calculated using"], ["calculado con", "calculated using"],
];

export function scientificTextEn(original: string): string {
  // No se modifica el texto dentro de enlaces o citas identificadas por URL.
  return original.split(/(https?:\/\/[^\s]+)/g).map((part) => {
    if (part.startsWith("http")) return part;
    return scientificPhrases.reduce((text, [es, en]) => text.replaceAll(es, en), part)
      .replace(/(\d),(\d)/g, "$1.$2");
  }).join("");
}

export function referenceTitleEn(title: string): string {
  return title.replace("API de climatología", "climatology API")
    .replace("temperaturas lunares", "lunar temperatures")
    .replace(" en AWS Open Data", " on AWS Open Data")
    .replace("Showcaves.com: Caverna de Umajalanta", "Showcaves.com: Umajalanta Cave")
    .replace("El-Baz y Maxwell", "El-Baz and Maxwell");
}
