import { lazy, Suspense, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { RankingList } from "../components/RankingList";
import { SiteSelector } from "../components/SiteSelector";
import { WeightSliders } from "../components/WeightSliders";
import { useData } from "../lib/data";
import { buildRanking, type Weights } from "../lib/ranking";

// MapLibre pesa casi 1 MB: se carga aparte del resto de la app.
const RankingMap = lazy(() => import("../components/RankingMap").then((m) => ({ default: m.RankingMap })));

export function Home() {
  const state = useData();
  const [params, setParams] = useSearchParams();
  const [customWeights, setCustomWeights] = useState<Weights | null>(null);

  const data = state.status === "ready" ? state.data : null;
  const siteId = data ? (data.sites.find((s) => s.id === params.get("sitio"))?.id ?? data.sites[0]?.id) : undefined;
  const boliviaOnly = params.get("bolivia") === "1";
  const unstudiedOnly = params.get("nuevos") === "1";
  const selectedId = params.get("analogo");
  const weights = customWeights ?? data?.results.weights;

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

  if (state.status === "loading") return <p>Cargando datos…</p>;
  if (state.status === "error") return <p role="alert">Error al cargar los datos: {state.message}</p>;
  if (!data || !siteId || !weights) return <p>Aún no hay sitios o candidatos cargados.</p>;

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
          Solo Bolivia
        </label>
        <label>
          <input
            type="checkbox"
            checked={unstudiedOnly}
            onChange={(event) => update({ nuevos: event.target.checked ? "1" : null, analogo: null })}
          />{" "}
          Solo lugares poco estudiados
        </label>
      </div>
      <WeightSliders weights={weights} onChange={setCustomWeights} onReset={() => setCustomWeights(null)} />
      <div className="explorer">
        <Suspense fallback={<p>Cargando mapa…</p>}>
          <RankingMap rows={rows} selectedId={selectedId} onSelect={(id) => update({ analogo: id })} />
        </Suspense>
        <RankingList siteId={siteId} rows={rows} selectedId={selectedId} onSelect={(id) => update({ analogo: id })} />
      </div>
    </>
  );
}
