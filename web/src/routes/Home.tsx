import { lazy, Suspense, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { RankingList } from "../components/RankingList";
import { SiteInfo } from "../components/SiteInfo";
import { SiteSelector } from "../components/SiteSelector";
import { WeightSliders } from "../components/WeightSliders";
import { useContent, useT } from "../i18n";
import { loadErrorText, useData } from "../lib/data";
import { buildRanking } from "../lib/ranking";
import { parseWeights, serializeWeights } from "../lib/variables";

// MapLibre pesa casi 1 MB: se carga aparte del resto de la app.
const RankingMap = lazy(() => import("../components/RankingMap").then((m) => ({ default: m.RankingMap })));
// El globo trae texturas de ~1,3 MB: solo se carga cuando se abre la sección.
const GlobeView = lazy(() => import("../components/globe/GlobeView").then((m) => ({ default: m.GlobeView })));

const GLOBE_ANALOGS = 5;

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

  if (state.status === "loading") return <p>{ui.states.loading}</p>;
  if (state.status === "error") return <p role="alert">{loadErrorText(t, state.error)}</p>;
  if (!data || !siteId || !weights) return <p>{t("home.empty")}</p>;

  const site = data.sites.find((s) => s.id === siteId);

  return (
    <>
      <h1>Earth Analogs</h1>
      <div className="controls">
        <SiteSelector sites={data.sites} value={siteId} onChange={(id) => update({ sitio: id, analogo: null })} />
        <label>
          <input
            type="checkbox"
            checked={boliviaOnly}
            onChange={(event) => update({ bolivia: event.target.checked ? "1" : null, analogo: null })}
          />{" "}
          {t("filters.bolivia")}
        </label>
        <label>
          <input
            type="checkbox"
            checked={unstudiedOnly}
            onChange={(event) => update({ nuevos: event.target.checked ? "1" : null, analogo: null })}
          />{" "}
          {t("filters.unstudied")}
        </label>
      </div>
      {site && (
        <details>
          <summary>{t("home.siteData")}</summary>
          <SiteInfo site={site} />
        </details>
      )}
      <details>
        <summary>{t("home.weights")}</summary>
        <WeightSliders
          weights={weights}
          onChange={(w) => update({ pesos: serializeWeights(w) })}
          onReset={() => update({ pesos: null })}
        />
      </details>
      <p aria-live="polite">
        {t(rows.length === 1 ? "home.countOne" : "home.countMany", { n: rows.length })}
      </p>
      <div className="explorer">
        <Suspense fallback={<p>{t("home.loadingMap")}</p>}>
          <RankingMap rows={rows} selectedId={selectedId} onSelect={(id) => update({ analogo: id })} />
        </Suspense>
        <RankingList siteId={siteId} rows={rows} selectedId={selectedId} onSelect={(id) => update({ analogo: id })} />
      </div>
      <details onToggle={(event) => setGlobeOpen(event.currentTarget.open)}>
        <summary>{t("home.globe")}</summary>
        {globeOpen && (
          <Suspense fallback={<p>{t("home.loadingGlobe")}</p>}>
            <GlobeView site={site ?? null} analogs={rows.slice(0, GLOBE_ANALOGS).map((row) => row.candidate)} />
          </Suspense>
        )}
      </details>
    </>
  );
}
