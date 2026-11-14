import type { ReactNode } from "react";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { VARIABLE_INFO, formatValue } from "../../lib/variables";
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
  /** Texto legible de cada etiqueta (de `content/es.ts`); por defecto, el identificador. */
  tagLabel?: (tag: Tag) => string;
  /** "Dónde falla" redactado y citado en la ficha del candidato (`fichas.json`). */
  breaksDown?: string[];
}

const identity = (tag: Tag): string => tag;

/** F3: comparación lado a lado de un sitio de la Luna o Marte con un lugar de la Tierra. */
export function Comparador({
  site,
  candidate,
  entry,
  limitations,
  tagLabel = identity,
  breaksDown = [],
}: ComparadorProps) {
  const rows = compareVariables(site.variables, candidate.variables, entry);
  const gaps = biggestGaps(rows);
  const missingTags = entry?.tag_overlap?.only_site ?? [];
  const hasBreaks = gaps.length > 0 || missingTags.length > 0 || breaksDown.length > 0;
  const radarData = rows
    .filter((row) => row.similarity !== null)
    .map((row) => ({ label: VARIABLE_INFO[row.variable].label, similarity: row.similarity }));
  const radarSummary = radarData.map((d) => `${d.label} ${d.similarity} %`).join(", ");

  return (
    <article className="comparador">
      <header>
        <h2>
          {site.name} <span aria-hidden="true">↔</span>
          <span className="visually-hidden">comparado con</span> {candidate.name}
        </h2>
        {entry ? (
          <p className="comparador-score">
            Índice de similitud: <strong>{entry.score.toFixed(1)}</strong> de 100, con {entry.n_vars_used} de{" "}
            {rows.length} variables.
          </p>
        ) : (
          <p className="comparador-score">Este par no entra al ranking: tiene menos de 3 variables con dato en ambos lados.</p>
        )}
      </header>

      <section aria-labelledby="cmp-variables">
        <h3 id="cmp-variables">Variable por variable</h3>
        <div className="comparador-table-wrap">
          <table className="comparador-table">
            <thead>
              <tr>
                <th scope="col">Variable</th>
                <th scope="col">{site.name}</th>
                <th scope="col">{candidate.name}</th>
                <th scope="col">Similitud</th>
                <th scope="col">En palabras</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.variable}>
                  <th scope="row">{VARIABLE_INFO[row.variable].label}</th>
                  <td>{formatValue(row.variable, row.siteValue)}</td>
                  <td>{formatValue(row.variable, row.candidateValue)}</td>
                  <td>
                    {row.similarity === null ? (
                      "sin dato"
                    ) : (
                      <span className="comparador-bar">
                        <meter min={0} max={100} value={row.similarity} aria-label={`Similitud en ${VARIABLE_INFO[row.variable].label}`} />
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
        <p className="comparador-note">
          «Mucho» y «algo» son relativos al rango de todos los lugares comparados, no a la diferencia absoluta.
        </p>
      </section>

      {radarData.length >= 3 && (
        <section aria-labelledby="cmp-radar">
          <h3 id="cmp-radar">Perfil de similitud</h3>
          <figure className="comparador-radar" role="img" aria-label={`Similitud por variable: ${radarSummary}`}>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData} outerRadius="75%">
                <PolarGrid />
                <PolarAngleAxis dataKey="label" />
                <PolarRadiusAxis domain={[0, 100]} tickCount={5} angle={90} />
                <Radar dataKey="similarity" name="Similitud" />
              </RadarChart>
            </ResponsiveContainer>
            <figcaption>100 % es idéntico en esa variable; 0 % es la mayor diferencia entre todos los lugares.</figcaption>
          </figure>
        </section>
      )}

      <section aria-labelledby="cmp-tags">
        <h3 id="cmp-tags">Coincidencias cualitativas</h3>
        {entry?.tag_overlap ? (
          <dl className="comparador-tags">
            <TagGroup title="Comparten" tags={entry.tag_overlap.shared} tagLabel={tagLabel} />
            <TagGroup title={`Solo ${site.name}`} tags={entry.tag_overlap.only_site} tagLabel={tagLabel} />
            <TagGroup title={`Solo ${candidate.name}`} tags={entry.tag_overlap.only_candidate} tagLabel={tagLabel} />
          </dl>
        ) : (
          <p>Sin etiquetas suficientes para comparar geología, hielo, cuevas o polvo.</p>
        )}
      </section>

      <section aria-labelledby="cmp-breaks" className="comparador-breaks">
        <h3 id="cmp-breaks">Dónde falla la analogía</h3>
        {hasBreaks ? (
          <ul>
            {gaps.map((row) => (
              <li key={row.variable}>
                <strong>{VARIABLE_INFO[row.variable].label}:</strong> el lugar terrestre es {row.description} (
                {formatValue(row.variable, row.candidateValue)} frente a {formatValue(row.variable, row.siteValue)}).
              </li>
            ))}
            {missingTags.map((tag) => (
              <li key={tag}>
                <strong>{tagLabel(tag)}:</strong> {site.name} lo tiene; {candidate.name} no.
              </li>
            ))}
            {breaksDown.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        ) : (
          <p>
            Ninguna variable ni etiqueta difiere mucho.
            {limitations && " Aun así valen los límites de abajo."}
          </p>
        )}
        {limitations}
      </section>
    </article>
  );
}

function TagGroup({ title, tags, tagLabel }: { title: string; tags: Tag[]; tagLabel: (tag: Tag) => string }) {
  return (
    <div>
      <dt>{title}</dt>
      <dd>
        {tags.length > 0 ? (
          <ul className="comparador-taglist">
            {tags.map((tag) => (
              <li key={tag}>{tagLabel(tag)}</li>
            ))}
          </ul>
        ) : (
          "ninguna"
        )}
      </dd>
    </div>
  );
}
