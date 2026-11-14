import type { ReactNode } from "react";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { useContent, useT, type Translate } from "../../i18n";
import { formatValue } from "../../lib/variables";
import type { Candidate, RankingEntry, Site, Tag } from "../../types";
import { biggestGaps, compareVariables } from "./compare";
import "./comparador.css";

export interface ComparadorProps {
  site: Site;
  candidate: Candidate;
  /** Fila del ranking de `results.json` para este par; `null` si el par no entra al ranking. */
  entry: RankingEntry | null;
  /** Panel fijo de limitaciones universales; se muestra dentro de "Dónde falla la analogía". */
  limitations?: ReactNode;
  /** Texto legible de cada etiqueta; por defecto, el de `content/` en el idioma actual. */
  tagLabel?: (tag: Tag) => string;
  /** "Dónde falla" redactado y citado en la ficha del candidato (`fichas.json`). */
  breaksDown?: string[];
}

/** F3: comparación lado a lado de un sitio de la Luna o Marte con un lugar de la Tierra. */
export function Comparador({ site, candidate, entry, limitations, tagLabel, breaksDown = [] }: ComparadorProps) {
  const t = useT();
  const { tags, variables } = useContent();
  const labelOf = tagLabel ?? ((tag: Tag) => tags[tag].label);
  const rows = compareVariables(site.variables, candidate.variables, entry, t);
  const gaps = biggestGaps(rows);
  const missingTags = entry?.tag_overlap?.only_site ?? [];
  const hasBreaks = gaps.length > 0 || missingTags.length > 0 || breaksDown.length > 0;
  const radarData = rows
    .filter((row) => row.similarity !== null)
    .map((row) => ({ label: variables[row.variable].label, similarity: row.similarity }));
  const radarSummary = radarData.map((d) => `${d.label} ${d.similarity} %`).join(", ");

  return (
    <article className="comparador">
      <header>
        <h2>
          {site.name} <span aria-hidden="true">↔</span>
          <span className="visually-hidden">{t("cmp.comparedWith")}</span> {candidate.name}
        </h2>
        {entry ? (
          <p className="comparador-score">
            {t("cmp.scorePre")}
            <strong>{entry.score.toFixed(1)}</strong>
            {t("cmp.scorePost", { n: entry.n_vars_used, total: rows.length })}
          </p>
        ) : (
          <p className="comparador-score">{t("cmp.notRanked")}</p>
        )}
      </header>

      <section aria-labelledby="cmp-variables">
        <h3 id="cmp-variables">{t("cmp.byVariable")}</h3>
        <div className="comparador-table-wrap">
          <table className="comparador-table">
            <thead>
              <tr>
                <th scope="col">{t("cmp.colVariable")}</th>
                <th scope="col">{site.name}</th>
                <th scope="col">{candidate.name}</th>
                <th scope="col">{t("cmp.colSimilarity")}</th>
                <th scope="col">{t("cmp.colWords")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.variable}>
                  <th scope="row">{variables[row.variable].label}</th>
                  <td>{formatValue(row.variable, row.siteValue, t)}</td>
                  <td>{formatValue(row.variable, row.candidateValue, t)}</td>
                  <td>
                    {row.similarity === null ? (
                      t("common.noData")
                    ) : (
                      <span className="comparador-bar">
                        <meter
                          min={0}
                          max={100}
                          value={row.similarity}
                          aria-label={t("cmp.meterAria", { variable: variables[row.variable].label })}
                        />
                        <span>{row.similarity} %</span>
                      </span>
                    )}
                  </td>
                  <td>{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="comparador-note">{t("cmp.note")}</p>
      </section>

      {radarData.length >= 3 && (
        <section aria-labelledby="cmp-radar">
          <h3 id="cmp-radar">{t("cmp.profile")}</h3>
          <figure className="comparador-radar" role="img" aria-label={t("cmp.radarAria", { summary: radarSummary })}>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData} outerRadius="75%">
                <PolarGrid />
                <PolarAngleAxis dataKey="label" />
                <PolarRadiusAxis domain={[0, 100]} tickCount={5} angle={90} />
                <Radar dataKey="similarity" name={t("cmp.radarName")} />
              </RadarChart>
            </ResponsiveContainer>
            <figcaption>{t("cmp.radarCaption")}</figcaption>
          </figure>
        </section>
      )}

      <section aria-labelledby="cmp-tags">
        <h3 id="cmp-tags">{t("cmp.tags")}</h3>
        {entry?.tag_overlap ? (
          <dl className="comparador-tags">
            <TagGroup title={t("cmp.shared")} tags={entry.tag_overlap.shared} labelOf={labelOf} t={t} />
            <TagGroup title={t("cmp.onlySite", { name: site.name })} tags={entry.tag_overlap.only_site} labelOf={labelOf} t={t} />
            <TagGroup
              title={t("cmp.onlySite", { name: candidate.name })}
              tags={entry.tag_overlap.only_candidate}
              labelOf={labelOf}
              t={t}
            />
          </dl>
        ) : (
          <p>{t("cmp.noTags")}</p>
        )}
      </section>

      <section aria-labelledby="cmp-breaks" className="comparador-breaks">
        <h3 id="cmp-breaks">{t("cmp.breaks")}</h3>
        {hasBreaks ? (
          <ul>
            {gaps.map((row) => (
              <li key={row.variable}>
                <strong>{variables[row.variable].label}:</strong>
                {t("cmp.gapText", {
                  description: row.description,
                  candidate: formatValue(row.variable, row.candidateValue, t),
                  site: formatValue(row.variable, row.siteValue, t),
                })}
              </li>
            ))}
            {missingTags.map((tag) => (
              <li key={tag}>
                <strong>{labelOf(tag)}:</strong>
                {t("cmp.missingTag", { site: site.name, candidate: candidate.name })}
              </li>
            ))}
            {breaksDown.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        ) : (
          <p>
            {t("cmp.nothing")}
            {limitations && t("cmp.limitsBelow")}
          </p>
        )}
        {limitations}
      </section>
    </article>
  );
}

function TagGroup({
  title,
  tags,
  labelOf,
  t,
}: {
  title: string;
  tags: Tag[];
  labelOf: (tag: Tag) => string;
  t: Translate;
}) {
  return (
    <div>
      <dt>{title}</dt>
      <dd>
        {tags.length > 0 ? (
          <ul className="comparador-taglist">
            {tags.map((tag) => (
              <li key={tag}>{labelOf(tag)}</li>
            ))}
          </ul>
        ) : (
          t("common.none")
        )}
      </dd>
    </div>
  );
}
