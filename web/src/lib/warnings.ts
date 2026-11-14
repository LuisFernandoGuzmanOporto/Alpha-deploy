import type { Candidate } from "../types";

/**
 * `true` si los datos avisan de que el clima de NASA POWER no representa el punto: la celda
 * regional está a más de 500 m de la elevación real (`pipeline/earth/README.md`). El aviso
 * viaja en `notes` como `ATENCION`; no se corrige el valor, solo se avisa.
 */
export function hasClimateBias(candidate: Candidate): boolean {
  return candidate.notes.includes("ATENCION");
}
