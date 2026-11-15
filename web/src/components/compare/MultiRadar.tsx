import { useId } from "react";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { useContent, useT } from "../../i18n";
import { VARIABLE_IDS, type Candidate, type RankingEntry } from "../../types";
import { Card } from "../ui";

export const MAX_ANALOGS = 3;

interface Props {
  /** Ranking del sitio (`results.json`), en su orden. */
  entries: readonly RankingEntry[];
  candidates: readonly Candidate[];
  /** Ids elegidos (1 a 3), en el orden de las series. */
  selected: readonly string[];
  onChange: (ids: string[]) => void;
}

/** Similitud por variable de 0 a 100, igual que en el comparador: 100 × (1 − diferencia normalizada). */
function similarity(entry: RankingEntry, variable: (typeof VARIABLE_IDS)[number]): number | null {
  const difference = entry.norm_diff[variable];
  return typeof difference === "number" ? Math.round(100 * (1 - difference)) : null;
}

const reducedMotion = (): boolean => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Tarea 4c: hasta tres análogos del mismo sitio en un radar superpuesto. Cada serie tiene color y trazo
 * propios (continuo, rayado, punteado) y la tabla da los mismos números para lectores de pantalla.
 */
export function MultiRadar({ entries, candidates, selected, onChange }: Props) {
  const t = useT();
  const { variables } = useContent();
  const titleId = useId();
  const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));
  const entryById = new Map(entries.map((entry) => [entry.candidate_id, entry]));
  const series = selected.flatMap((id) => {
    const entry = entryById.get(id);
    const candidate = byId.get(id);
    return entry && candidate ? [{ id, entry, candidate }] : [];
  });
  // Solo las variables que tienen dato en todas las series: así los polígonos son comparables.
  const shared = VARIABLE_IDS.filter((variable) => series.every((s) => similarity(s.entry, variable) !== null));
  const data = shared.map((variable) => ({
    label: variables[variable].label,
    ...Object.fromEntries(series.map((s, index) => [`s${index}`, similarity(s.entry, variable)])),
  }));

  const setSlot = (slot: number, id: string) => {
    const next = [...selected];
    if (id) next[slot] = id;
    else next.splice(slot, 1);
    onChange([...new Set(next.filter(Boolean))].slice(0, MAX_ANALOGS));
  };

  return (
    <Card className="comparador-card cc-multi" aria-labelledby={titleId}>
      <h3 id={titleId}>{t("multi.title")}</h3>
      <p className="comparador-note">{t("multi.intro")}</p>
      <div className="cc-multi__pickers">
        {Array.from({ length: Math.min(MAX_ANALOGS, selected.length + 1) }, (_, slot) => (
          <label key={slot} className={`cc-multi__picker cc-multi__picker--${slot}`}>
            <span>
              <span className="cc-multi__swatch" aria-hidden="true" /> {t("multi.slot", { n: slot + 1 })}
            </span>
            <select value={selected[slot] ?? ""} onChange={(event) => setSlot(slot, event.target.value)}>
              {slot > 0 && <option value="">{slot < selected.length ? t("multi.remove") : t("multi.add")}</option>}
              {entries.map((entry, index) => {
                const candidate = byId.get(entry.candidate_id);
                if (!candidate) return null;
                const takenElsewhere = selected.includes(entry.candidate_id) && selected[slot] !== entry.candidate_id;
                return (
                  <option key={entry.candidate_id} value={entry.candidate_id} disabled={takenElsewhere}>
                    {index + 1}. {candidate.name} ({entry.score.toFixed(1)})
                  </option>
                );
              })}
            </select>
          </label>
        ))}
      </div>

      {data.length >= 3 ? (
        <figure className="comparador-radar cc-multi__radar" aria-hidden="true">
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={data} outerRadius="70%" accessibilityLayer={false}>
              <PolarGrid />
              <PolarAngleAxis dataKey="label" />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              {series.map((s, index) => (
                <Radar
                  key={s.id}
                  dataKey={`s${index}`}
                  name={s.candidate.name}
                  className={`cc-multi__series cc-multi__series--${index}`}
                  isAnimationActive={!reducedMotion()}
                />
              ))}
            </RadarChart>
          </ResponsiveContainer>
        </figure>
      ) : (
        <p className="comparador-note">{t("multi.tooFew")}</p>
      )}

      <div className="comparador-table-wrap">
        <table className="comparador-table cc-multi__table">
          <caption className="visually-hidden">{t("multi.caption")}</caption>
          <thead>
            <tr>
              <th scope="col">{t("cmp.colVariable")}</th>
              {series.map((s, index) => (
                <th key={s.id} scope="col" className={`cc-multi__head cc-multi__head--${index}`}>
                  <span className="cc-multi__swatch" aria-hidden="true" /> {s.candidate.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {VARIABLE_IDS.map((variable) => (
              <tr key={variable}>
                <th scope="row">{variables[variable].label}</th>
                {series.map((s) => {
                  const value = similarity(s.entry, variable);
                  return <td key={s.id}>{value === null ? t("common.noData") : `${value} %`}</td>;
                })}
              </tr>
            ))}
            <tr>
              <th scope="row">{t("multi.score")}</th>
              {series.map((s) => (
                <td key={s.id}>
                  <strong>{s.entry.score.toFixed(1)}</strong>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p className="comparador-note">{t("cmp.radarCaption")}</p>
    </Card>
  );
}
