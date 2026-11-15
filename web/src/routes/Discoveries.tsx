import { Link } from "react-router-dom";
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
  if (sites.length === 0) return <p className="cc-empty">{t("discoveries.noSites")}</p>;

  const ranks = Array.from({ length: TOP_N }, (_, index) => index + 1);

  return (
    <div className="cc-page">
      <header className="cc-page-head">
        <span className="cc-label">{t("discoveries.eyebrow")}</span>
        <h1>{t("discoveries.title")}</h1>
        <p>{t("discoveries.intro", { n: TOP_N })}</p>
      </header>

      <section aria-labelledby="disc-lead-title">
        <h2 id="disc-lead-title" className="disc-h2">
          {t("discoveries.lead")}
        </h2>
        <ul className="disc-grid">
          {sites.map((site, index) => {
            const best = topUnstudied(results, candidates, site.id, 1)[0];
            if (!best) return null;
            return (
              <li key={site.id} style={{ animationDelay: `${index * 70}ms` }}>
                <Link to={`/comparar/${site.id}/${best.candidate.id}`} className={`disc-card disc-card--${site.body} tilt`}>
                  <span className="disc-card__target">
                    <span className={`cc-disc cc-disc--${site.body}`} aria-hidden="true" />
                    {site.name} · {t(`body.${site.body}`)}
                  </span>
                  <strong className="disc-card__name">{best.candidate.name}</strong>
                  <span className="disc-card__country">{best.candidate.country}</span>
                  <span className="disc-card__foot">
                    <span className="disc-card__score">
                      {best.entry.score.toFixed(1)}
                      <small>/100</small>
                    </span>
                    <span className="disc-card__go">{t("discoveries.open")} →</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <h2 className="disc-h2">{t("discoveries.matrix")}</h2>
      {/* Matriz destino × puesto: se lee de un vistazo qué lugar poco estudiado lidera cada destino. */}
      <div className="cc-matrix-wrap">
        <table className="cc-matrix">
          <thead>
            <tr>
              <th scope="col">{t("discoveries.colTarget")}</th>
              {ranks.map((rank) => (
                <th scope="col" key={rank}>
                  {t("discoveries.colRank", { n: rank })}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sites.map((site) => {
              const rows = topUnstudied(results, candidates, site.id, TOP_N);
              return (
                <tr key={site.id}>
                  <th scope="row">
                    <span className={`cc-disc cc-disc--${site.body}`} aria-hidden="true" />
                    <span>
                      <strong>{site.name}</strong>
                      <small>{t(`body.${site.body}`)}</small>
                    </span>
                  </th>
                  {rows.length === 0 ? (
                    <td colSpan={TOP_N}>{t("discoveries.none")}</td>
                  ) : (
                    rows.map(({ entry, candidate }, index) => (
                      <td key={candidate.id} data-rank={t("discoveries.colRank", { n: index + 1 })}>
                        <Link to={`/comparar/${site.id}/${candidate.id}`}>
                          <span className="cc-matrix__name">{candidate.name}</span>
                          <span className="cc-matrix__country">{candidate.country}</span>
                          <ScoreMeter score={entry.score} size="sm" />
                        </Link>
                      </td>
                    ))
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
