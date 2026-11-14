import { Link } from "react-router-dom";
import type { RankingRow } from "../lib/ranking";
import { KnownBadge } from "./placeholders/KnownBadge";

interface Props {
  siteId: string;
  rows: RankingRow[];
  selectedId: string | null;
  onSelect: (candidateId: string) => void;
}

export function RankingList({ siteId, rows, selectedId, onSelect }: Props) {
  if (rows.length === 0) {
    return <p>No hay análogos que cumplan los filtros.</p>;
  }

  return (
    <ol className="ranking-list">
      {rows.map(({ entry, candidate }) => {
        const selected = candidate.id === selectedId;
        return (
          <li key={candidate.id} className={selected ? "selected" : undefined}>
            <button type="button" aria-pressed={selected} onClick={() => onSelect(candidate.id)}>
              <strong>{candidate.name}</strong> — {entry.score.toFixed(1)} <KnownBadge known={candidate.known} />
              <br />
              <small>
                {candidate.country}
                {candidate.lat === null || candidate.lon === null ? " · sin coordenadas" : ""}
              </small>
            </button>
            {selected && (
              <p>
                {entry.tag_overlap ? (
                  <>
                    Coincidencias: {entry.tag_overlap.shared.join(", ") || "ninguna"} (
                    {entry.tag_overlap.jaccard.toFixed(2)}).{" "}
                  </>
                ) : (
                  <>Coincidencias cualitativas: sin dato. </>
                )}
                <Link to={`/comparar/${siteId}/${candidate.id}`}>Ver comparación</Link>
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
