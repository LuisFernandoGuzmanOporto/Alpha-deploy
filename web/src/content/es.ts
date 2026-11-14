import type { Tag, VariableId } from "../types";

export const tags: Record<Tag, { label: string; description: string; icon: string }> = {
  basalt: { label: "Basalto", description: "Roca volcánica formada al enfriarse lava rica en hierro y magnesio.", icon: "◆" },
  "impact-crater": { label: "Cráter de impacto", description: "Depresión producida por el impacto de un cuerpo celeste.", icon: "◎" },
  evaporite: { label: "Evaporitas", description: "Minerales que quedan cuando se evapora el agua que los contiene.", icon: "◇" },
  "aeolian-dunes": { label: "Dunas eólicas", description: "Acumulaciones de arena modeladas por el viento.", icon: "≈" },
  "dust-activity": { label: "Actividad de polvo", description: "Transporte o levantamiento de partículas finas por el viento.", icon: "∿" },
  "polar-ice": { label: "Hielo polar", description: "Presencia documentada de hielo en una región polar.", icon: "❄" },
  permafrost: { label: "Suelo congelado", description: "Suelo que permanece congelado durante al menos dos años (permafrost).", icon: "❄" },
  glacier: { label: "Glaciar", description: "Masa de hielo terrestre que fluye por su propio peso.", icon: "△" },
  "lava-tubes": { label: "Tubos de lava", description: "Conductos que deja una corriente de lava al enfriarse y vaciarse.", icon: "◒" },
  caves: { label: "Cuevas", description: "Cavidades naturales bajo la superficie.", icon: "◒" },
  "hydrated-minerals": { label: "Minerales hidratados", description: "Minerales que incorporan agua en su estructura.", icon: "◈" },
  "highland-terrain": { label: "Tierras altas", description: "Terreno elevado respecto de su entorno regional.", icon: "△" },
  "volcanic-field": { label: "Campo volcánico", description: "Región con múltiples estructuras de origen volcánico.", icon: "▲" },
  "extreme-cold": { label: "Frío extremo", description: "Condiciones de temperatura especialmente bajas documentadas para el sitio.", icon: "❄" },
  "hyper-arid": { label: "Hiperaridez", description: "Condiciones de escasez extrema de agua disponible.", icon: "☼" },
};

export const variables: Record<VariableId, { label: string; unit: string; description: string }> = {
  slope_deg: { label: "Pendiente", unit: "°", description: "Inclinación media del terreno en la ventana de estudio." },
  relief_m: { label: "Relieve local", unit: "m", description: "Variación de la altura del terreno (desviación estándar), no elevación absoluta." },
  temp_mean_c: { label: "Temperatura superficial", unit: "°C", description: "Temperatura media anual de la superficie, no del aire." },
  precip_mm_year: { label: "Precipitación", unit: "mm/año", description: "Precipitación media anual utilizada como indicador de aridez." },
  albedo: { label: "Reflectividad (albedo)", unit: "0–1", description: "Fracción de la luz recibida que refleja la superficie." },
};

export const es = {
  brand: "Earth Analogs",
  tagline: "La Tierra, laboratorio de otros mundos.",
  title: "Explora aquí. Prepara el próximo destino.",
  intro: "Elige un sitio de la Luna o Marte y compara sus características con lugares de la Tierra.",
  nav: { explore: "Explorar", discoveries: "Descubrimientos", methodology: "Metodología" },
  filters: { site: "Destino de exploración", bolivia: "Solo Bolivia", discoveries: "Solo lugares poco estudiados", reset: "Limpiar filtros" },
  states: { loading: "Cargando datos…", error: "No pudimos cargar los datos. Intenta de nuevo.", empty: "No hay análogos para estos filtros. Prueba ampliando la búsqueda.", noData: "Sin datos disponibles", retry: "Reintentar", notFound: "No encontramos esta página." },
  actions: { compare: "Comparar", details: "Ver ficha", sources: "Consultar fuentes", back: "Volver al mapa" },
  score: "Índice de similitud",
  scoreHelp: "El índice compara las variables disponibles. No es una probabilidad ni una garantía de equivalencia.",
  known: "Conocido",
  new: "Nuevo",
  newHelp: "Poco estudiado como análogo planetario; no significa que sea un descubrimiento confirmado.",
  limitationsTitle: "Limitaciones de la Tierra como análogo",
  limitationsIntro: "Ningún lugar reproduce todas las condiciones de otro mundo. Cada analogía sirve para características concretas.",
  limitations: [
    { title: "Gravedad", text: "La Tierra no reproduce la gravedad reducida de la Luna y Marte." },
    { title: "Vacío lunar", text: "La atmósfera terrestre no reproduce el vacío de la superficie lunar." },
    { title: "Atmósfera de Marte", text: "La atmósfera terrestre no reproduce la atmósfera tenue marciana." },
    { title: "Radiación", text: "La protección de la atmósfera y el campo magnético terrestre cambia la exposición a la radiación." },
  ],
  methodology: {
    title: "Cómo comparamos los mundos",
    intro: "Comparamos cinco variables numéricas y mostramos por separado las coincidencias de etiquetas geológicas y ambientales.",
    formula: "Índice = 100 × (1 − distancia media ponderada). Solo entran al ranking pares con al menos tres variables disponibles.",
    missing: "Un dato ausente se muestra como no disponible y se excluye del cálculo. Nunca se sustituye por cero.",
    tags: "Las etiquetas describen coincidencias cualitativas; no equivalen por sí solas a una similitud numérica.",
    caution: "Consulta las fuentes, la cobertura de datos y dónde falla la analogía antes de interpretar el ranking.",
  },
} as const;
