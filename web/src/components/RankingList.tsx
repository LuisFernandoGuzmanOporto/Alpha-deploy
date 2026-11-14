import type { CSSProperties } from "react";
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

export function RankingList({ siteId, rows, selectedId, onSelect }: Props) {
  const t = useT();
  const { ui, tags } = useContent();

  if (rows.length === 0) {
    return <p className="ea-empty">{ui.states.empty}</p>;
  }

  return (
    <ol className="ea-rank ea-stagger">
      {rows.map(({ entry, candidate }, index) => {
        const selected = candidate.id === selectedId;
        const style = { "--i": index } as CSSProperties;
        return (
          <li key={candidate.id} className={`ea-rank__item${selected ? " is-selected" : ""}`} style={style}>
            <button
              type="button"
              className="ea-rank__head"
              aria-pressed={selected}
              aria-expanded={selected}
              onClick={() => onSelect(candidate.id)}
            >
              <span className="ea-rank__pos" aria-hidden="true">{index + 1}</span>
              <span className="ea-rank__main">
                <span className="ea-rank__name">{candidate.name}</span>
                <span className="ea-rank__meta">
                  {candidate.country}
                  {candidate.lat === null || candidate.lon === null ? t("ranking.noCoords") : ""}
                  <KnownBadge known={candidate.known} />
                  {candidate.is_bolivia && <Tag>Bolivia</Tag>}
                </span>
              </span>
              <ScoreMeter score={entry.score} />
            </button>
            {selected && (
              <div className="ea-rank__body">
                <p>{candidate.why}</p>
                <TagList tags={candidate.tags} />
                <p className="ea-rank__overlap">
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
            )}
          </li>
        );
      })}
    </ol>
  );
}
