import type { Ficha, Reference } from "../types";

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isWebUrl(value: string): boolean {
  try {
    const { protocol } = new URL(value);
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
}

function toReferences(value: unknown): Reference[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item): Reference[] => {
    if (typeof item !== "object" || item === null) return [];
    const { title, url } = item as Record<string, unknown>;
    return typeof title === "string" && typeof url === "string" && isWebUrl(url) ? [{ title, url }] : [];
  });
}

/**
 * Indexa `fichas.json` por candidato. Una ficha sin `breaks_down` no se publica
 * (CONTEXT.md, regla 5) y solo se conservan referencias con enlace http(s).
 */
export function indexFichas(raw: unknown): Record<string, Ficha> {
  const fichas: Record<string, Ficha> = {};
  if (!Array.isArray(raw)) return fichas;
  for (const item of raw) {
    if (typeof item !== "object" || item === null) continue;
    const record = item as Record<string, unknown>;
    if (typeof record.candidate_id !== "string") continue;
    if (!isStringArray(record.breaks_down) || record.breaks_down.length === 0) continue;
    fichas[record.candidate_id] = {
      candidate_id: record.candidate_id,
      summary: typeof record.summary === "string" ? record.summary : "",
      processes: isStringArray(record.processes) ? record.processes : [],
      use_cases: isStringArray(record.use_cases) ? record.use_cases : [],
      breaks_down: record.breaks_down,
      references: toReferences(record.references),
    };
  }
  return fichas;
}
