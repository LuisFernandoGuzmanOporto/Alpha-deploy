import type { Tag, VariableId } from "../types";
import type { es } from "./es";

// Versión en inglés de `content/es.ts` (Noe). Misma forma: si cambia es.ts, TypeScript avisa aquí.
type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly Widen<U>[]
    : T extends object
      ? { [K in keyof T]: Widen<T[K]> }
      : T;

export type Content = Widen<typeof es>;

export const tagsEn: Record<Tag, { label: string; description: string; icon: string }> = {
  basalt: { label: "Basalt", description: "Volcanic rock formed when iron- and magnesium-rich lava cools.", icon: "◆" },
  "impact-crater": { label: "Impact crater", description: "Depression created by the impact of a celestial body.", icon: "◎" },
  evaporite: { label: "Evaporites", description: "Minerals left behind when the water that contains them evaporates.", icon: "◇" },
  "aeolian-dunes": { label: "Aeolian dunes", description: "Sand accumulations shaped by the wind.", icon: "≈" },
  "dust-activity": { label: "Dust activity", description: "Transport or lifting of fine particles by the wind.", icon: "∿" },
  "polar-ice": { label: "Polar ice", description: "Documented presence of ice in a polar region.", icon: "❄" },
  permafrost: { label: "Permafrost", description: "Ground that stays frozen for at least two consecutive years.", icon: "❄" },
  glacier: { label: "Glacier", description: "Mass of land ice that flows under its own weight.", icon: "△" },
  "lava-tubes": { label: "Lava tubes", description: "Conduits left when a lava flow cools and drains.", icon: "◒" },
  caves: { label: "Caves", description: "Natural cavities below the surface.", icon: "◒" },
  "hydrated-minerals": { label: "Hydrated minerals", description: "Minerals that incorporate water in their structure.", icon: "◈" },
  "highland-terrain": { label: "Highlands", description: "Terrain that sits higher than its regional surroundings.", icon: "△" },
  "volcanic-field": { label: "Volcanic field", description: "Region with multiple structures of volcanic origin.", icon: "▲" },
  "extreme-cold": { label: "Extreme cold", description: "Exceptionally low temperatures documented at the site.", icon: "❄" },
  "hyper-arid": { label: "Hyper-aridity", description: "Extreme scarcity of available water.", icon: "☼" },
};

export const variablesEn: Record<VariableId, { label: string; unit: string; description: string }> = {
  slope_deg: { label: "Slope", unit: "°", description: "Average steepness of the terrain within the study area." },
  relief_m: { label: "Local relief", unit: "m", description: "Variation in terrain height (standard deviation), not absolute elevation." },
  temp_mean_c: { label: "Surface temperature", unit: "°C", description: "Mean annual temperature of the ground surface, not the air." },
  precip_mm_year: { label: "Precipitation", unit: "mm/yr", description: "Mean annual precipitation, used as an aridity indicator." },
  albedo: { label: "Reflectivity (albedo)", unit: "0–1", description: "Fraction of incoming light reflected by the surface." },
};

export const en: Content = {
  brand: "Earth Analogs",
  tagline: "Earth, a laboratory for other worlds.",
  title: "Explore Earth analogs",
  intro: "Pick a site on the Moon or Mars to see which place on Earth is most like it, and why.",
  nav: { explore: "Explore", discoveries: "Discoveries", methodology: "Methodology" },
  filters: { site: "Exploration target", bolivia: "Bolivia only", discoveries: "Less-studied places only", reset: "Clear filters" },
  states: {
    loading: "Loading data…",
    error: "We couldn't load the data. Please try again.",
    empty: "No analogs match these filters. Try broadening your search.",
    noData: "No data available",
    retry: "Retry",
    notFound: "We couldn't find this page.",
  },
  actions: { compare: "Compare", details: "View fact sheet", sources: "See sources", back: "Back to the map" },
  score: "Similarity index",
  scoreHelp: "The index compares the variables available for both places. It is not a probability, nor a guarantee that they are equivalent.",
  known: "Known",
  new: "New",
  newHelp: "Not yet well studied as a planetary analog. That does not make it a confirmed discovery.",
  limitationsTitle: "Limits of Earth as an analog",
  limitationsIntro: "No single place reproduces every condition of another world. Each analogy holds only for specific characteristics.",
  limitations: [
    { title: "Gravity", text: "Nowhere on Earth reproduces the low gravity of the Moon or Mars." },
    { title: "Lunar vacuum", text: "Earth's atmosphere rules out the near-vacuum found on the lunar surface." },
    { title: "Martian atmosphere", text: "Earth's atmosphere cannot reproduce the thin atmosphere of Mars." },
    { title: "Radiation", text: "Earth's atmosphere and magnetic field shield the surface, so radiation exposure is very different." },
  ],
  methodology: {
    title: "How we compare worlds",
    intro: "We compare five numerical variables and show matching geological and environmental tags separately.",
    formula: "Index = 100 × (1 − weighted mean distance). Only pairs with at least three available variables enter the ranking.",
    missing: "Missing values are shown as unavailable and left out of the calculation. They are never replaced with zero.",
    tags: "Tags describe qualitative matches; on their own, they do not amount to numerical similarity.",
    caution: "Before reading the ranking, check the sources, the data coverage and where each analogy breaks down.",
  },
};
