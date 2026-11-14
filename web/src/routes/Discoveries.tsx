import { Link } from "react-router-dom";
import { KnownBadge } from "../components/placeholders/KnownBadge";
import { useContent, useT } from "../i18n";
import { loadErrorText, useData } from "../lib/data";
import { topUnstudied } from "../lib/ranking";

const TOP_N = 5;

export function Discoveries() {
  const state = useData();
  const t = useT();
  const { ui } = useContent();

  if (state.status === "loading") return <p>{ui.states.loading}</p>;
  if (state.status === "error") return <p role="alert">{loadErrorText(t, state.error)}</p>;

  const { sites, candidates, results } = state.data;
  if (sites.length === 0) return <p>{t("discoveries.noSites")}</p>;

  return (
    <>
      <h1>{t("discoveries.title")}</h1>
      <p>{t("discoveries.intro", { n: TOP_N })}</p>
      {sites.map((site) => {
        const rows = topUnstudied(results, candidates, site.id, TOP_N);
        return (
          <section key={site.id}>
            <h2>{site.name}</h2>
            {rows.length === 0 ? (
              <p>{t("discoveries.none")}</p>
            ) : (
              <ol>
                {rows.map(({ entry, candidate }) => (
                  <li key={candidate.id}>
                    <Link to={`/comparar/${site.id}/${candidate.id}`}>{candidate.name}</Link> — {entry.score.toFixed(1)}{" "}
                    <KnownBadge known={candidate.known} /> <small>{candidate.country}</small>
                  </li>
                ))}
              </ol>
            )}
          </section>
        );
      })}
    </>
  );
}
