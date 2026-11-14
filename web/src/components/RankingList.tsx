import { AnimatePresence, motion } from "motion/react";
import { Link } from "react-router-dom";
import { useContent, useT } from "../i18n";
import type { RankingRow } from "../lib/ranking";
import { KnownBadge, Tag, TagList } from "./ui";
import { ScoreMeter } from "./ui/extra";

interface Props {
  siteId: string;
  rows: RankingRow[];
  selectedId: string | null;
  onSelect: (candidateId: string) => void;
}

/** Ranking como tabla densa: puesto, análogo y puntaje. Al cambiar el sitio o los filtros las filas se reordenan con animación. */
export function RankingList({ siteId, rows, selectedId, onSelect }: Props) {
  const t = useT();
  const { ui, tags } = useContent();

  if (rows.length === 0) {
    return <p className="cc-empty">{ui.states.empty}</p>;
  }

  return (
    <>
      <div className="cc-rank__cols" aria-hidden="true">
        <span>{t("ranking.colRank")}</span>
        <span>{t("ranking.colAnalog")}</span>
        <span>{t("ranking.colScore")}</span>
      </div>
      <ol className="cc-rank">
        <AnimatePresence initial={false} mode="popLayout">
          {rows.map(({ entry, candidate }, index) => {
            const selected = candidate.id === selectedId;
            return (
              <motion.li
                key={candidate.id}
                layout="position"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22, delay: Math.min(index, 10) * 0.015 }}
                className={`cc-rank__item${selected ? " is-selected" : ""}`}
              >
                <button
                  type="button"
                  className="cc-rank__row"
                  aria-expanded={selected}
                  onClick={() => onSelect(candidate.id)}
                >
                  <span className="cc-rank__pos" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <span className="cc-rank__main">
                    <span className="cc-rank__name">{candidate.name}</span>
                    <span className="cc-rank__meta">
                      {candidate.country}
                      {candidate.lat === null || candidate.lon === null ? t("ranking.noCoords") : ""}
                      <KnownBadge known={candidate.known} />
                      {candidate.is_bolivia && <Tag>Bolivia</Tag>}
                    </span>
                  </span>
                  <ScoreMeter score={entry.score} />
                </button>
                <AnimatePresence initial={false}>
                  {selected && (
                    <motion.div
                      className="cc-rank__body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.24, ease: [0.2, 0.7, 0.2, 1] }}
                    >
                      <div className="cc-rank__inner">
                        <p>{candidate.why}</p>
                        <TagList tags={candidate.tags} />
                        <p className="cc-rank__overlap">
                          {entry.tag_overlap
                            ? t("ranking.shared", {
                                tags: entry.tag_overlap.shared.map((tag) => tags[tag].label).join(", ") || t("common.none"),
                                jaccard: entry.tag_overlap.jaccard.toFixed(2),
                              })
                            : t("ranking.noOverlap")}
                        </p>
                        <Link className="ea-button ea-button--primary" to={`/comparar/${siteId}/${candidate.id}`}>
                          {t("ranking.compare")} →
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ol>
    </>
  );
}
