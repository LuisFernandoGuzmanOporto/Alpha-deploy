// Tipos del contrato de datos (CONTEXT.md, sección 6). No cambiar sin avisar a Fernando.

export const VARIABLE_IDS = [
  "slope_deg",
  "relief_m",
  "temp_mean_c",
  "precip_mm_year",
  "albedo",
] as const;

export type VariableId = (typeof VARIABLE_IDS)[number];

export const TAGS = [
  "basalt",
  "impact-crater",
  "evaporite",
  "aeolian-dunes",
  "dust-activity",
  "polar-ice",
  "permafrost",
  "glacier",
  "lava-tubes",
  "caves",
  "hydrated-minerals",
  "highland-terrain",
  "volcanic-field",
  "extreme-cold",
  "hyper-arid",
] as const;

export type Tag = (typeof TAGS)[number];

export type SiteBody = "moon" | "mars";

/** Valor por variable; `null` cuando no hay dato (nunca se inventa). */
export type VariableValues = Record<VariableId, number | null>;

/** Fuente de cada variable no nula. */
export type VariableSources = Partial<Record<VariableId, string>>;

interface BaseRecord {
  id: string;
  name: string;
  lat: number | null;
  lon: number | null;
  variables: VariableValues;
  sources: VariableSources;
  tags: Tag[];
  notes: string;
}

/** Sitio candidato de base lunar o aterrizaje marciano (`data/sites.json`). */
export interface Site extends BaseRecord {
  body: SiteBody;
  region: string;
}

/** Lugar terrestre candidato a análogo (`data/candidates.json`). */
export interface Candidate extends BaseRecord {
  body: "earth";
  region?: string;
  country: string;
  is_bolivia: boolean;
  /** `true` si la literatura ya lo documenta como análogo planetario. */
  known: boolean;
  analog_for: SiteBody[];
  why: string;
  reference_urls: string[];
}

/** Coincidencia cualitativa de etiquetas entre un sitio y un candidato. */
export interface TagOverlap {
  jaccard: number;
  shared: Tag[];
  only_site: Tag[];
  only_candidate: Tag[];
}

/** Una fila del ranking de un sitio (`results.json`). */
export interface RankingEntry {
  candidate_id: string;
  score: number;
  n_vars_used: number;
  /** Diferencia normalizada (0 a 1) por variable disponible en ambos lados. */
  norm_diff: Partial<Record<VariableId, number>>;
  /** `null` si falta alguno de los dos lados. */
  tag_overlap: TagOverlap | null;
}

/** Salida de `pipeline/similarity.py` (`web/public/data/results.json`). */
export interface Results {
  generated_at: string;
  variables: VariableId[];
  weights: Record<VariableId, number>;
  log_variables: VariableId[];
  ranges: Partial<Record<VariableId, [number, number] | null>>;
  /** Clave: id del sitio. Cada lista va ordenada de mayor a menor `score`. */
  sites: Record<string, RankingEntry[]>;
}

export interface Reference {
  title: string;
  url: string;
}

/** Ficha de un candidato (`web/public/data/fichas.json`, dueña: Lian). */
export interface Ficha {
  candidate_id: string;
  summary: string;
  processes: string[];
  use_cases: string[];
  breaks_down: string[];
  references: Reference[];
}
