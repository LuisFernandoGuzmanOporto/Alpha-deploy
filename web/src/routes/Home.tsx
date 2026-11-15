import { lazy, Suspense, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Dialog, Switch } from "../components/controls";
import { CountUp, DecryptedText } from "../components/ui/motion";
import { RankingList } from "../components/RankingList";
import { SiteInfo } from "../components/SiteInfo";
import { SiteSelector } from "../components/SiteSelector";
import { Button } from "../components/ui";
import { ErrorState, Fold, Loading } from "../components/ui/extra";
import { WeightSliders } from "../components/WeightSliders";
import { useContent, useT } from "../i18n";
import { loadErrorText } from "../lib/data";
import { useLocalizedData as useData } from "../content/useLocalizedData";
import { buildRanking } from "../lib/ranking";
import { parseWeights, serializeWeights } from "../lib/variables";
import { VARIABLE_IDS } from "../types";

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

  if (state.status === "loading") return <Loading />;
  if (state.status === "error") return <ErrorState detail={loadErrorText(t, state.error)} />;
  if (!data || !siteId || !weights) return <p className="cc-empty">{t("home.empty")}</p>;

  const site = data.sites.find((s) => s.id === siteId);
  const filtersActive = boliviaOnly || unstudiedOnly;

  return (
    <div className="cc-home">
      <section className="cc-band" aria-labelledby="ea-title">
        <div className="cc-band__copy">
          <span className="cc-label">{t("hero.eyebrow")}</span>
          <h1 id="ea-title">
            <DecryptedText
              text={ui.title}
              animateOn="view"
              sequential
              revealDirection="start"
              speed={34}
              maxIterations={8}
              characters="0123456789·:/+-"
              scrambleColor="var(--cc-accent)"
            />
          </h1>
          <p>{ui.intro}</p>
        </div>
        <dl className="cc-telemetry">
          <div>
            <dt>{t("hero.sites")}</dt>
            <dd><CountUp to={data.sites.length} duration={1.1} trigger="load" /></dd>
          </div>
          <div>
            <dt>{t("hero.places")}</dt>
            <dd><CountUp to={data.candidates.length} duration={1.4} trigger="load" /></dd>
          </div>
          <div>
            <dt>{t("hero.variables")}</dt>
            <dd><CountUp to={VARIABLE_IDS.length} duration={0.9} trigger="load" /></dd>
          </div>
        </dl>
      </section>

      <div className="cc-workspace">
        <aside className="cc-rail" aria-label={ui.filters.site}>
          <section aria-labelledby="rail-target">
            <h2 id="rail-target" className="cc-label">01 · {ui.filters.site}</h2>
            <SiteSelector sites={data.sites} value={siteId} onChange={(id) => update({ sitio: id, analogo: null })} />
          </section>

          <section aria-labelledby="rail-filters">
            <h2 id="rail-filters" className="cc-label">02 · {t("home.filters")}</h2>
            <div className="cc-filters">
              <Switch checked={boliviaOnly} onCheckedChange={(on) => update({ bolivia: on ? "1" : null, analogo: null })}>
                {t("filters.bolivia")}
              </Switch>
              <Switch checked={unstudiedOnly} onCheckedChange={(on) => update({ nuevos: on ? "1" : null, analogo: null })}>
                {t("filters.unstudied")}
              </Switch>
            </div>
            <div className="cc-actions">
              <Dialog
                trigger={<Button variant="secondary">{t("rail.paramsOpen")}</Button>}
                title={t("rail.params")}
                description={t("rail.paramsDesc")}
                closeLabel={t("dialog.close")}
              >
                <WeightSliders
                  weights={weights}
                  onChange={(w) => update({ pesos: serializeWeights(w) })}
                  onReset={() => update({ pesos: null })}
                />
              </Dialog>
              {filtersActive && (
                <button type="button" className="ea-text-button" onClick={() => update({ bolivia: null, nuevos: null, analogo: null })}>
                  {ui.filters.reset}
                </button>
              )}
            </div>
          </section>

          {site && (
            <section aria-labelledby="rail-telemetry">
              <h2 id="rail-telemetry" className="cc-label">03 · {t("rail.telemetry")}</h2>
              <SiteInfo site={site} />
            </section>
          )}
        </aside>

        <section className="cc-stage" aria-label={t("map.title")}>
          <Suspense fallback={<Loading label={t("home.loadingMap")} />}>
            <RankingMap rows={rows} selectedId={selectedId} onSelect={(id) => update({ analogo: id })} />
          </Suspense>
        </section>

        <section className="cc-panel" aria-labelledby="ea-rank-title">
          <div className="cc-panel__head">
            <div>
              <span className="cc-label">{t("ranking.title")}</span>
              <h2 id="ea-rank-title">{site?.name}</h2>
            </div>
            <span className="cc-panel__count" aria-live="polite">
              {t(rows.length === 1 ? "home.countOne" : "home.countMany", { n: rows.length })}
            </span>
          </div>
          <RankingList siteId={siteId} rows={rows} selectedId={selectedId} onSelect={(id) => update({ analogo: id })} />
        </section>
      </div>

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
