import { lazy, Suspense, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { RankingList } from "../components/RankingList";
import { SiteInfo } from "../components/SiteInfo";
import { SiteSelector } from "../components/SiteSelector";
import { Card } from "../components/ui";
import { ErrorState, Fold, Loading } from "../components/ui/extra";
import { WeightSliders } from "../components/WeightSliders";
import { useContent, useT } from "../i18n";
import { loadErrorText, useData } from "../lib/data";
import { buildRanking } from "../lib/ranking";
import { useCountUp } from "../lib/useCountUp";
import { parseWeights, serializeWeights } from "../lib/variables";
import { VARIABLE_IDS } from "../types";

// MapLibre pesa casi 1 MB: se carga aparte del resto de la app.
const RankingMap = lazy(() => import("../components/RankingMap").then((m) => ({ default: m.RankingMap })));
// El globo trae texturas de ~1,3 MB: solo se carga cuando se abre la sección.
const GlobeView = lazy(() => import("../components/globe/GlobeView").then((m) => ({ default: m.GlobeView })));

const GLOBE_ANALOGS = 5;

function Stat({ value, label }: { value: number; label: string }) {
  const shown = useCountUp(value, 1100);
  return (
    <li>
      <strong>{Math.round(shown)}</strong>
      <span>{label}</span>
    </li>
  );
}

export function Home() {
  const state = useData();
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
  if (!data || !siteId || !weights) return <p className="ea-empty">{t("home.empty")}</p>;

  const site = data.sites.find((s) => s.id === siteId);
  const filtersActive = boliviaOnly || unstudiedOnly;

  return (
    <div className="ea-home ea-page">
      <section className="ea-hero" aria-labelledby="ea-title">
        <svg className="ea-hero__orbit" viewBox="0 0 400 400" aria-hidden="true">
          <circle cx="200" cy="200" r="190" fill="none" stroke="#fff" strokeWidth="1.2" strokeDasharray="3 9" />
          <circle cx="200" cy="200" r="140" fill="none" stroke="#fff" strokeWidth="1.2" />
          <circle cx="200" cy="200" r="90" fill="none" stroke="#fff" strokeWidth="1.2" strokeDasharray="2 6" />
          <circle cx="200" cy="10" r="7" fill="#fff" />
          <circle cx="340" cy="200" r="5" fill="#fff" />
        </svg>
        <span className="ea-hero__planet" aria-hidden="true" />
        <span className="ea-eyebrow">{t("hero.eyebrow")}</span>
        <h1 id="ea-title">{ui.title}</h1>
        <p>{ui.intro}</p>
        <ul className="ea-stats">
          <Stat value={data.sites.length} label={t("hero.sites")} />
          <Stat value={data.candidates.length} label={t("hero.places")} />
          <Stat value={VARIABLE_IDS.length} label={t("hero.variables")} />
        </ul>
      </section>

      <section className="ea-section" aria-labelledby="ea-dest">
        <div className="ea-section__head">
          <span className="ea-eyebrow">01</span>
          <h2 id="ea-dest">{ui.filters.site}</h2>
        </div>
        <SiteSelector sites={data.sites} value={siteId} onChange={(id) => update({ sitio: id, analogo: null })} />
      </section>

      <div className="ea-toolbar" role="group" aria-label={t("home.filters")}>
        <div className="ea-toolbar__chips">
          <label className="ea-chip">
            <input
              type="checkbox"
              checked={boliviaOnly}
              onChange={(event) => update({ bolivia: event.target.checked ? "1" : null, analogo: null })}
            />
            <span>{t("filters.bolivia")}</span>
          </label>
          <label className="ea-chip">
            <input
              type="checkbox"
              checked={unstudiedOnly}
              onChange={(event) => update({ nuevos: event.target.checked ? "1" : null, analogo: null })}
            />
            <span>{t("filters.unstudied")}</span>
          </label>
          {filtersActive && (
            <button type="button" className="ea-text-button" onClick={() => update({ bolivia: null, nuevos: null, analogo: null })}>
              {ui.filters.reset}
            </button>
          )}
        </div>
        <span className="ea-toolbar__count" aria-live="polite">
          {t(rows.length === 1 ? "home.countOne" : "home.countMany", { n: rows.length })}{" "}
          {site && t("home.forSite", { site: site.name })}
        </span>
      </div>

      <div className="ea-explorer">
        <Card className="ea-map-card" aria-label={t("map.title")}>
          <Suspense fallback={<Loading label={t("home.loadingMap")} />}>
            <RankingMap rows={rows} selectedId={selectedId} onSelect={(id) => update({ analogo: id })} />
          </Suspense>
        </Card>
        <Card className="ea-rank-card" aria-labelledby="ea-rank-title">
          <div className="ea-rank-card__head">
            <div>
              <span className="ea-eyebrow">Ranking</span>
              <h2 id="ea-rank-title">{t("ranking.title")}</h2>
            </div>
          </div>
          <RankingList siteId={siteId} rows={rows} selectedId={selectedId} onSelect={(id) => update({ analogo: id })} />
        </Card>
      </div>

      {site && (
        <Fold title={t("home.siteData")} eyebrow={site.name}>
          <SiteInfo site={site} />
        </Fold>
      )}
      <Fold title={t("home.weights")}>
        <WeightSliders
          weights={weights}
          onChange={(w) => update({ pesos: serializeWeights(w) })}
          onReset={() => update({ pesos: null })}
        />
      </Fold>
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
