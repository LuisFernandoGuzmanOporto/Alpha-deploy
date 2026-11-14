import { Link } from "react-router-dom";
import { useContent, useT } from "../i18n";
import type { RankingRow } from "../lib/ranking";
import { KnownBadge } from "./placeholders/KnownBadge";

interface Props {
  siteId: string;
  rows: RankingRow[];
  selectedId: string | null;
  onSelect: (candidateId: string) => void;
}

export function RankingList({ siteId, rows, selectedId, onSelect }: Props) {
  const t = useT();
  const { tags } = useContent();

  if (rows.length === 0) {
    return <p>{t("ranking.empty")}</p>;
  }

  return (
    <ol className="ranking-list">
      {rows.map(({ entry, candidate }) => {
        const selected = candidate.id === selectedId;
        return (
          <li key={candidate.id} className={selected ? "selected" : undefined}>
            <button type="button" aria-pressed={selected} onClick={() => onSelect(candidate.id)}>
              <span className="ranking-name">
                <strong>{candidate.name}</strong> — {entry.score.toFixed(1)} <KnownBadge known={candidate.known} />
              </span>
              <small className="ranking-place">
                {candidate.country}
                {candidate.lat === null || candidate.lon === null ? t("ranking.noCoords") : ""}
              </small>
            </button>
            {selected && (
              <p>
                {candidate.why}
                <br />
                {entry.tag_overlap
                  ? t("ranking.shared", {
                      tags: entry.tag_overlap.shared.map((tag) => tags[tag].label).join(", ") || t("common.none"),
                      jaccard: entry.tag_overlap.jaccard.toFixed(2),
                    })
                  : t("ranking.noOverlap")}
                <Link to={`/comparar/${siteId}/${candidate.id}`}>{t("ranking.compare")}</Link>
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
