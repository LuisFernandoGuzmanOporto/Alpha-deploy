import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Dialog, Switch } from "../components/controls";
import { RankingList } from "../components/RankingList";
import { SiteInfo } from "../components/SiteInfo";
import { SiteSelector } from "../components/SiteSelector";
import { ErrorState, Fold, Loading } from "../components/ui/extra";
import { WeightSliders } from "../components/WeightSliders";
import { useContent, useT } from "../i18n";
import { loadErrorText, useData } from "../lib/data";
import { buildRanking } from "../lib/ranking";
import { parseWeights, serializeWeights } from "../lib/variables";
import { VARIABLE_IDS } from "../types";

// MapLibre pesa casi 1 MB: se carga aparte del resto de la app.
const loadRankingMap = () => import("../components/RankingMap");
const RankingMap = lazy(() => loadRankingMap().then((m) => ({ default: m.RankingMap })));
// El globo trae texturas de ~1,3 MB: solo se carga cuando se abre la sección.
const GlobeView = lazy(() => import("../components/globe/GlobeView").then((m) => ({ default: m.GlobeView })));

const GLOBE_ANALOGS = 5;

export function Home() {
  const state = useData();
  // El mapa (MapLibre, ~1 MB) se pide después del primer pintado, en paralelo con los datos, y no cuando estos llegan.
  useEffect(() => {
    void loadRankingMap();
  }, []);
  const t = useT();
  const { ui } = useContent();
  const [params, setParams] = useSearchParams();
  const [globeOpen, setGlobeOpen] = useState(false);

  const data = state.status === "ready" ? state.data : null;
  const siteId = data ? (data.sites.find((s) => s.id === params.get("sitio"))?.id ?? data.sites[0]?.id) : undefined;
  const boliviaOnly = params.get("bolivia") === "1";
  const unstudiedOnly = params.get("nuevos") === "1";
  const selectedId = params.get("analogo");
  const weightsParam = params.get("pesos");
  const defaultWeights = data?.results.weights;
  const weights = useMemo(() => parseWeights(weightsParam) ?? defaultWeights, [weightsParam, defaultWeights]);

  const rows = useMemo(
    () =>
      data && siteId
        ? buildRanking(data.results, data.candidates, siteId, { boliviaOnly, unstudiedOnly }, weights)
        : [],
    [data, siteId, boliviaOnly, unstudiedOnly, weights],
  );

  const update = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(changes)) {
      if (value === null) next.delete(key);
      else next.set(key, value);
    }
    setParams(next, { replace: true });
  };

  if (state.status === "loading") return <Loading />;
  if (state.status === "error") return <ErrorState detail={loadErrorText(t, state.error)} />;
  if (!data || !siteId || !weights) return <p className="cc-empty">{t("home.empty")}</p>;

  const site = data.sites.find((s) => s.id === siteId);
  const active = [
    boliviaOnly && { key: "bolivia", label: t("filters.bolivia") },
    unstudiedOnly && { key: "nuevos", label: t("filters.unstudied") },
    weightsParam && { key: "pesos", label: t("explore.weightsCustom") },
  ].filter((item): item is { key: string; label: string } => Boolean(item));

  return (
    <div className="cc-home">
      <div className="cc-stage">
        <Suspense fallback={<Loading label={t("home.loadingMap")} />}>
          <RankingMap rows={rows} selectedId={selectedId} onSelect={(id) => update({ analogo: id })} />
        </Suspense>

        <section className="cc-float cc-control" aria-labelledby="explore-title">
          <h1 id="explore-title">{ui.title}</h1>
          <p className="cc-lead">{ui.intro}</p>

          <SiteSelector sites={data.sites} value={siteId} onChange={(id) => update({ sitio: id, analogo: null })} />

          <div className="cc-filterbar">
            <Dialog
              trigger={
                <button type="button" className="cc-filterbtn">
                  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                    <path d="M4 6h16M7 12h10M10 18h4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  {t("explore.filters")}
                  {active.length > 0 && <span className="cc-filterbtn__count">{active.length}</span>}
                </button>
              }
              title={t("explore.filters")}
              description={t("explore.filtersDesc")}
              closeLabel={t("dialog.close")}
            >
              <div className="cc-filters">
                <Switch checked={boliviaOnly} onCheckedChange={(on) => update({ bolivia: on ? "1" : null, analogo: null })}>
                  {t("filters.bolivia")}
                </Switch>
                <Switch checked={unstudiedOnly} onCheckedChange={(on) => update({ nuevos: on ? "1" : null, analogo: null })}>
                  {t("filters.unstudied")}
                </Switch>
              </div>
              <h3 className="cc-subhead">{t("explore.weightsTitle")}</h3>
              <WeightSliders
                weights={weights}
                onChange={(w) => update({ pesos: serializeWeights(w) })}
                onReset={() => update({ pesos: null })}
              />
            </Dialog>
            {active.map((filter) => (
              <button
                key={filter.key}
                type="button"
                className="cc-chip"
                aria-label={t("explore.removeFilter", { name: filter.label })}
                onClick={() => update({ [filter.key]: null, analogo: null })}
              >
                {filter.label} <span aria-hidden="true">×</span>
              </button>
            ))}
            {active.length > 1 && (
              <button type="button" className="ea-text-button" onClick={() => update({ bolivia: null, nuevos: null, pesos: null, analogo: null })}>
                {ui.filters.reset}
              </button>
            )}
          </div>
        </section>

        {site && (
          <section className="cc-float cc-panel" aria-labelledby="explore-rank-title">
            <header className="cc-panel__head">
              <h2 id="explore-rank-title">{t("explore.best")}</h2>
              <span className="cc-muted" aria-live="polite">
                {t(rows.length === 1 ? "home.countOne" : "home.countMany", { n: rows.length })}
              </span>
            </header>
            <div className="cc-panel__body">
              <RankingList site={site} rows={rows} selectedId={selectedId} onSelect={(id) => update({ analogo: id })} />
            </div>
          </section>
        )}
      </div>

      <section className="cc-about" aria-labelledby="cc-about-title">
        <h2 id="cc-about-title">{t("explore.about")}</h2>
        <dl className="cc-stats">
          <div>
            <dd>{data.sites.length}</dd>
            <dt>{t("hero.sites")}</dt>
          </div>
          <div>
            <dd>{data.candidates.length}</dd>
            <dt>{t("hero.places")}</dt>
          </div>
          <div>
            <dd>{VARIABLE_IDS.length}</dd>
            <dt>{t("hero.variables")}</dt>
          </div>
        </dl>
        {site && (
          <div className="cc-about__site">
            <h3 className="cc-subhead">{site.name}</h3>
            <SiteInfo site={site} />
          </div>
        )}
      </section>

      <Fold title={t("home.globe")} onToggle={setGlobeOpen}>
        {globeOpen && (
          <Suspense fallback={<Loading label={t("home.loadingGlobe")} />}>
            <GlobeView site={site ?? null} analogs={rows.slice(0, GLOBE_ANALOGS).map((row) => row.candidate)} />
          </Suspense>
        )}
      </Fold>
    </div>
  );
}
