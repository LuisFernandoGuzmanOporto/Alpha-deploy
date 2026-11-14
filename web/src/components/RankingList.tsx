import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useContent, useT } from "../i18n";
import type { RankingRow } from "../lib/ranking";
import { scoreColor } from "../lib/scoreColor";
import { formatValue } from "../lib/variables";
import type { Site } from "../types";
import { biggestGaps, compareVariables } from "./compare/compare";
import { KnownBadge } from "./ui";

const TOP = 3;

interface Props {
  site: Site;
  rows: RankingRow[];
  selectedId: string | null;
  onSelect: (candidateId: string | null) => void;
}

/** Panel de resultados: los tres mejores con nombre, puntaje y una razón breve; el detalle aparece al elegir uno. */
export function RankingList({ site, rows, selectedId, onSelect }: Props) {
  const t = useT();
  const { ui } = useContent();
  const [showAll, setShowAll] = useState(false);

  if (rows.length === 0) return <p className="cc-empty">{ui.states.empty}</p>;

  const selectedIndex = rows.findIndex((row) => row.candidate.id === selectedId);
  const selected = selectedIndex >= 0 ? rows[selectedIndex] : undefined;

  if (selected) {
    return <Detail site={site} row={selected} rank={selectedIndex + 1} onBack={() => onSelect(null)} />;
  }

  const visible = showAll ? rows : rows.slice(0, TOP);
  return (
    <div className="cc-results">
      <ol className="cc-results__list">
        <AnimatePresence initial={false} mode="popLayout">
          {visible.map(({ entry, candidate }, index) => (
            <motion.li
              key={candidate.id}
              layout="position"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: Math.min(index, 8) * 0.02 }}
            >
              <button
                type="button"
                className={`cc-result${index < TOP ? " cc-result--top" : ""}`}
                onClick={() => onSelect(candidate.id)}
              >
                <span className="cc-result__rank" style={{ background: scoreColor(entry.score) }}>{index + 1}</span>
                <span className="cc-result__main">
                  <span className="cc-result__name">{candidate.name}</span>
                  <span className="cc-result__country">{candidate.country}</span>
                  {index < TOP && <span className="cc-result__why">{candidate.why}</span>}
                </span>
                <span className="cc-result__score">
                  <strong>{entry.score.toFixed(0)}</strong>
                  <small>/100</small>
                </span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>
      {rows.length > TOP && (
        <button type="button" className="cc-more" onClick={() => setShowAll((v) => !v)}>
          {showAll ? t("explore.seeTop") : t("explore.seeAll", { n: rows.length })}
        </button>
      )}
    </div>
  );
}

function Detail({ site, row, rank, onBack }: { site: Site; row: RankingRow; rank: number; onBack: () => void }) {
  const t = useT();
  const { variables, tags } = useContent();
  const { entry, candidate } = row;
  const comparison = compareVariables(site.variables, candidate.variables, entry, t);
  const gaps = biggestGaps(comparison);

  return (
    <motion.div className="cc-detail" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.22 }}>
      <button type="button" className="cc-detail__back" onClick={onBack}>{t("explore.back")}</button>

      <header className="cc-detail__head">
        <span className="cc-result__rank cc-result__rank--lg" style={{ background: scoreColor(entry.score) }}>{rank}</span>
        <div>
          <h3>{candidate.name}</h3>
          <p className="cc-detail__sub">
            {candidate.country} <KnownBadge known={candidate.known} />
          </p>
        </div>
        <span className="cc-result__score cc-result__score--lg">
          <strong>{entry.score.toFixed(1)}</strong>
          <small>/100</small>
        </span>
      </header>

      <p className="cc-detail__why">{candidate.why}</p>

      <section>
        <h4 className="cc-subhead">{t("explore.vs", { site: site.name })}</h4>
        <table className="cc-vs">
          <thead>
            <tr>
              <th scope="col">{t("explore.colVar")}</th>
              <th scope="col">{t("explore.colSite")}</th>
              <th scope="col">{t("explore.colPlace")}</th>
            </tr>
          </thead>
          <tbody>
            {comparison.map((item) => {
              const gap = item.normDiff !== null && item.normDiff >= 0.3;
              const close = item.normDiff !== null && item.normDiff < 0.1;
              return (
                <tr key={item.variable} className={gap ? "is-gap" : close ? "is-close" : undefined}>
                  <th scope="row">
                    {variables[item.variable].label}
                    <span className="cc-vs__desc">{item.description}</span>
                  </th>
                  <td>{formatValue(item.variable, item.siteValue, t)}</td>
                  <td>{formatValue(item.variable, item.candidateValue, t)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section>
        <h4 className="cc-subhead">{t("explore.gaps")}</h4>
        {gaps.length === 0 ? (
          <p className="cc-muted">{t("explore.noGaps")}</p>
        ) : (
          <ul className="cc-gaps">
            {gaps.map((gap) => (
              <li key={gap.variable}>
                <strong>{variables[gap.variable].label}</strong> — {gap.description}
              </li>
            ))}
          </ul>
        )}
        {entry.tag_overlap && entry.tag_overlap.shared.length > 0 && (
          <p className="cc-muted cc-shared">
            {t("ranking.shared", {
              tags: entry.tag_overlap.shared.map((tag) => tags[tag].label).join(", "),
              jaccard: entry.tag_overlap.jaccard.toFixed(2),
            })}
          </p>
        )}
      </section>

      <dl className="cc-facts">
        <div>
          <dt>{t("explore.coords")}</dt>
          <dd className="cc-mono">
            {candidate.lat === null || candidate.lon === null ? t("siteinfo.noCoords") : `${candidate.lat.toFixed(3)}°, ${candidate.lon.toFixed(3)}°`}
          </dd>
        </div>
        {candidate.reference_urls.length > 0 && (
          <div>
            <dt>{t("explore.sources")}</dt>
            <dd>
              {candidate.reference_urls.map((url, i) => (
                <a key={url} href={url} target="_blank" rel="noreferrer">[{i + 1}]</a>
              ))}
            </dd>
          </div>
        )}
      </dl>

      <Link className="ea-button ea-button--primary" to={`/comparar/${site.id}/${candidate.id}`}>
        {t("ranking.compare")} →
      </Link>
    </motion.div>
  );
}
