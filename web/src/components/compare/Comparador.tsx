import type { CSSProperties, ReactNode } from "react";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { useContent, useT, type Translate } from "../../i18n";
import { scoreColor } from "../../lib/scoreColor";
import { formatValue } from "../../lib/variables";
import { hasClimateBias } from "../../lib/warnings";
import type { Candidate, RankingEntry, Site, Tag, VariableId } from "../../types";
import { Card, KnownBadge } from "../ui";
import { ScoreRing } from "../ui/extra";
import { biggestGaps, compareVariables } from "./compare";

export interface ComparadorProps {
  site: Site;
  candidate: Candidate;
  /** Fila del ranking de `results.json` para este par; `null` si el par no entra al ranking. */
  entry: RankingEntry | null;
  /** Panel fijo de limitaciones universales; se muestra al final de "Dónde falla la analogía". */
  limitations?: ReactNode;
  /** Texto legible de cada etiqueta; por defecto, el de `content/` en el idioma actual. */
  tagLabel?: (tag: Tag) => string;
  /** "Dónde falla" redactado y citado en la ficha del candidato (`fichas.json`). */
  breaksDown?: string[];
}

/** Variables que dependen del clima de NASA POWER, afectadas por el aviso de dato sesgado. */
const CLIMATE_VARIABLES: readonly VariableId[] = ["temp_mean_c", "precip_mm_year"];

/** F3: comparación lado a lado de un sitio de la Luna o Marte con un lugar de la Tierra. */
export function Comparador({ site, candidate, entry, limitations, tagLabel, breaksDown = [] }: ComparadorProps) {
  const t = useT();
  const { ui, tags, variables } = useContent();
  const labelOf = tagLabel ?? ((tag: Tag) => tags[tag].label);
  const rows = compareVariables(site.variables, candidate.variables, entry, t);
  const gaps = biggestGaps(rows);
  const missingTags = entry?.tag_overlap?.only_site ?? [];
  const hasBreaks = gaps.length > 0 || missingTags.length > 0 || breaksDown.length > 0;
  const biased = hasClimateBias(candidate);
  const radarData = rows
    .filter((row) => row.similarity !== null)
    .map((row) => ({ label: variables[row.variable].label, similarity: row.similarity }));
  const radarSummary = radarData.map((d) => `${d.label} ${d.similarity} %`).join(", ");

  return (
    <article className="comparador">
      <h1 className="visually-hidden">
        {site.name} {t("cmp.comparedWith")} {candidate.name}
      </h1>

      <Card className="ea-duel">
        <div className="ea-world">
          <span className={`ea-disc ea-disc--${site.body}`} aria-hidden="true" />
          <span className="ea-eyebrow">{t(`body.${site.body}`)}</span>
          <h2>{site.name}</h2>
          <span className="ea-world__sub">{site.region}</span>
        </div>
        <div className="ea-duel__center">
          {entry ? (
            <>
              <ScoreRing score={entry.score} label={ui.score} />
              <span className="ea-duel__coverage">{t("cmp.coverage", { n: entry.n_vars_used, total: rows.length })}</span>
            </>
          ) : (
            <p className="comparador-note">{t("cmp.notRanked")}</p>
          )}
        </div>
        <div className="ea-world">
          <span className="ea-disc ea-disc--earth" aria-hidden="true" />
          <span className="ea-eyebrow">{t("body.earth")}</span>
          <h2>{candidate.name}</h2>
          <span className="ea-world__sub">
            {candidate.country} <KnownBadge known={candidate.known} />
          </span>
        </div>
      </Card>

      {biased && (
        <div className="ea-notice" role="note">
          <span className="ea-notice__icon" aria-hidden="true">⚠</span>
          <div>
            <strong>{t("cmp.biasTitle")}</strong>
            <p>{t("cmp.bias")}</p>
          </div>
        </div>
      )}

      <Card className="comparador-card" aria-labelledby="cmp-variables">
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
              {rows.map((row, index) => (
                <tr key={row.variable}>
                  <th scope="row">{variables[row.variable].label}</th>
                  <td>{formatValue(row.variable, row.siteValue, t)}</td>
                  <td>
                    {formatValue(row.variable, row.candidateValue, t)}
                    {biased && CLIMATE_VARIABLES.includes(row.variable) && row.candidateValue !== null && (
                      <span className="comparador-bias" title={t("cmp.biasMark")} role="img" aria-label={t("cmp.biasMark")}>
                        ⚠
                      </span>
                    )}
                  </td>
                  <td>
                    {row.similarity === null ? (
                      t("common.noData")
                    ) : (
                      <span
                        className="comparador-bar"
                        style={{ "--w": `${row.similarity}%`, "--tone": scoreColor(row.similarity), "--i": index } as CSSProperties}
                      >
                        <span
                          className="comparador-bar__track"
                          role="meter"
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={row.similarity}
                          aria-label={t("cmp.meterAria", { variable: variables[row.variable].label })}
                        >
                          <span className="comparador-bar__fill" />
                        </span>
                        <span className="comparador-bar__num">{row.similarity} %</span>
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
      </Card>

      <div className="comparador-grid">
        {radarData.length >= 3 && (
          <Card className="comparador-card" aria-labelledby="cmp-radar">
            <h3 id="cmp-radar">{t("cmp.profile")}</h3>
            <figure className="comparador-radar" role="img" aria-label={t("cmp.radarAria", { summary: radarSummary })}>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData} outerRadius="72%">
                  <PolarGrid stroke="#c5d3ce" />
                  <PolarAngleAxis dataKey="label" />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar dataKey="similarity" name={t("cmp.radarName")} isAnimationActive />
                </RadarChart>
              </ResponsiveContainer>
              <figcaption>{t("cmp.radarCaption")}</figcaption>
            </figure>
          </Card>
        )}

        <Card className="comparador-card" aria-labelledby="cmp-tags">
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
        </Card>
      </div>

      <Card className="comparador-card comparador-breaks" aria-labelledby="cmp-breaks">
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
      </Card>

      {limitations}
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
