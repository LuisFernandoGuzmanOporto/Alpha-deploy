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
  basalt: { label: "Basalt", description: "Volcanic rock formed when lava rich in iron and magnesium cools.", icon: "◆" },
  "impact-crater": { label: "Impact crater", description: "Depression produced by the impact of a celestial body.", icon: "◎" },
  evaporite: { label: "Evaporites", description: "Minerals left behind when the water that contains them evaporates.", icon: "◇" },
  "aeolian-dunes": { label: "Wind-shaped dunes", description: "Accumulations of sand shaped by wind (aeolian dunes).", icon: "≈" },
  "dust-activity": { label: "Dust activity", description: "Fine particles lifted or carried by wind.", icon: "∿" },
  "polar-ice": { label: "Polar ice", description: "Documented presence of ice in a polar region.", icon: "❄" },
  permafrost: { label: "Permafrost", description: "Ground that stays frozen for at least two years.", icon: "❄" },
  glacier: { label: "Glacier", description: "Mass of land ice that flows under its own weight.", icon: "△" },
  "lava-tubes": { label: "Lava tubes", description: "Conduits left when a lava flow cools and drains.", icon: "◒" },
  caves: { label: "Caves", description: "Natural cavities below the surface.", icon: "◒" },
  "hydrated-minerals": { label: "Hydrated minerals", description: "Minerals that contain water within their structure.", icon: "◈" },
  "highland-terrain": { label: "Highlands", description: "Terrain that is elevated relative to its regional surroundings.", icon: "△" },
  "volcanic-field": { label: "Volcanic field", description: "Region with multiple structures of volcanic origin.", icon: "▲" },
  "extreme-cold": { label: "Extreme cold", description: "Especially low temperatures documented for the site.", icon: "❄" },
  "hyper-arid": { label: "Hyper-arid", description: "Conditions with extremely little available water.", icon: "☼" },
};

export const variablesEn: Record<VariableId, { label: string; unit: string; description: string }> = {
  slope_deg: { label: "Slope", unit: "°", description: "Average terrain slope within the study area." },
  relief_m: { label: "Local relief", unit: "m", description: "Variation in terrain height (standard deviation), not absolute elevation." },
  temp_mean_c: { label: "Surface temperature", unit: "°C", description: "Mean annual temperature of the surface, not of the air." },
  precip_mm_year: { label: "Precipitation", unit: "mm/yr", description: "Mean annual precipitation, used as an indicator of aridity." },
  albedo: { label: "Reflectivity (albedo)", unit: "0–1", description: "Fraction of the incoming light that the surface reflects." },
};

export const en: Content = {
  brand: "Earth Analogs",
  tagline: "Earth, a laboratory for other worlds.",
  title: "Explore Earth. Prepare for other worlds.",
  intro: "Choose a site on the Moon or Mars and compare its characteristics with places on Earth.",
  nav: { explore: "Explore", discoveries: "Discoveries", methodology: "Methodology" },
  filters: { site: "Exploration target", bolivia: "Bolivia only", discoveries: "Less-studied places only", reset: "Clear filters" },
  states: {
    loading: "Loading data…",
    error: "We could not load the data. Please try again.",
    empty: "No analogs match these filters. Try clearing one of the filters.",
    noData: "No data available",
    retry: "Retry",
    notFound: "We could not find this page.",
  },
  actions: { compare: "Compare", details: "View fact sheet", sources: "See sources", back: "Back to the map" },
  score: "Similarity index",
  scoreHelp: "The index compares the available variables. It is not a probability or a guarantee of equivalence.",
  known: "Known",
  new: "New",
  newHelp: "Less studied as a planetary analog. This label does not indicate a confirmed discovery.",
  limitationsTitle: "Limits of Earth as an analog",
  limitationsIntro: "No place on Earth reproduces every condition of another world. Each analog is useful for specific characteristics.",
  limitations: [
    { title: "Gravity", text: "Earth does not reproduce the reduced gravity of the Moon and Mars." },
    { title: "Lunar vacuum", text: "Earth's atmosphere does not reproduce the vacuum at the lunar surface." },
    { title: "Martian atmosphere", text: "Earth's atmosphere does not reproduce the thin Martian atmosphere." },
    { title: "Radiation", text: "The protection of Earth's atmosphere and magnetic field changes radiation exposure." },
  ],
  methodology: {
    title: "How we compare worlds",
    intro: "We compare five numerical variables and show the matches in geological and environmental tags separately.",
    formula: "Index = 100 × (1 − weighted mean distance). Only pairs with at least three available variables enter the ranking.",
    missing: "A missing value is shown as unavailable and left out of the calculation. It is never replaced by zero.",
    tags: "Tags describe qualitative matches; on their own they are not equivalent to a numerical similarity.",
    caution: "Check the sources, the data coverage and where the analogy breaks down before interpreting the ranking.",
  },
};
