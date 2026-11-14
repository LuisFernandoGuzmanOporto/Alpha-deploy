import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { Card, KnownBadge } from "../components/ui";
import { ErrorState, Loading, ScoreMeter } from "../components/ui/extra";
import { useT } from "../i18n";
import { loadErrorText, useData } from "../lib/data";
import { topUnstudied } from "../lib/ranking";

const TOP_N = 5;

export function Discoveries() {
  const state = useData();
  const t = useT();

  if (state.status === "loading") return <Loading />;
  if (state.status === "error") return <ErrorState detail={loadErrorText(t, state.error)} />;

  const { sites, candidates, results } = state.data;
  if (sites.length === 0) return <p className="ea-empty">{t("discoveries.noSites")}</p>;

  return (
    <div className="ea-page">
      <header className="ea-page-head">
        <span className="ea-eyebrow">{t("discoveries.eyebrow")}</span>
        <h1>{t("discoveries.title")}</h1>
        <p>{t("discoveries.intro", { n: TOP_N })}</p>
      </header>
      <div className="ea-disc-grid ea-stagger">
        {sites.map((site, siteIndex) => {
          const rows = topUnstudied(results, candidates, site.id, TOP_N);
          return (
            <Card className="ea-disc-card" key={site.id} style={{ "--i": siteIndex } as CSSProperties}>
              <div className="ea-disc-card__head">
                <span className={`ea-disc ea-disc--${site.body}`} aria-hidden="true" />
                <div>
                  <span className="ea-eyebrow">{t(`body.${site.body}`)}</span>
                  <h2>{site.name}</h2>
                </div>
              </div>
              {rows.length === 0 ? (
                <p className="ea-empty">{t("discoveries.none")}</p>
              ) : (
                <ol className="ea-disc-list">
                  {rows.map(({ entry, candidate }, index) => (
                    <li key={candidate.id}>
                      <Link className="ea-disc-row" to={`/comparar/${site.id}/${candidate.id}`} style={{ "--i": index } as CSSProperties}>
                        <span className="ea-rank__pos" aria-hidden="true">{index + 1}</span>
                        <span className="ea-disc-row__main">
                          <strong>{candidate.name}</strong>
                          <span className="ea-disc-row__meta">
                            {candidate.country} <KnownBadge known={candidate.known} />
                          </span>
                        </span>
                        <ScoreMeter score={entry.score} size="sm" />
                      </Link>
                    </li>
                  ))}
                </ol>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
