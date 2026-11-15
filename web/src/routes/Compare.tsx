import { Link, useParams, useSearchParams } from "react-router-dom";
import { Comparador } from "../components/compare/Comparador";
import { Explanation } from "../components/compare/Explanation";
import { MAX_ANALOGS, MultiRadar } from "../components/compare/MultiRadar";
import { FichaPanel } from "../components/FichaPanel";
import { LimitationsPanel } from "../components/ui";
import { ErrorState, Loading } from "../components/ui/extra";
import { useT } from "../i18n";
import { loadErrorText, useData } from "../lib/data";

export function Compare() {
  const { siteId, candidateId } = useParams();
  const [params, setParams] = useSearchParams();
  const state = useData();
  const t = useT();

  if (state.status === "loading") return <Loading />;
  if (state.status === "error") return <ErrorState detail={loadErrorText(t, state.error)} />;

  const { sites, candidates, results, fichas } = state.data;
  const site = sites.find((s) => s.id === siteId);
  const candidate = candidates.find((c) => c.id === candidateId);
  if (!site || !candidate) {
    return (
      <div className="ea-state">
        <strong>{t("compare.notFound")}</strong>
        <Link className="ea-button ea-button--secondary" to="/">
          {t("common.backHome")}
        </Link>
      </div>
    );
  }

  const siteEntries = results.sites[site.id] ?? [];
  const entry = siteEntries.find((e) => e.candidate_id === candidate.id) ?? null;
  const ficha = fichas[candidate.id];
  // Tarea 4c: `analogos=a,b,c` en la URL; sin el parámetro, la serie es el análogo de esta comparación.
  const ranked = new Set(siteEntries.map((e) => e.candidate_id));
  const fromUrl = (params.get("analogos") ?? "").split(",").filter((id) => ranked.has(id));
  const analogs = [...new Set(fromUrl.length > 0 ? fromUrl : entry ? [candidate.id] : [])].slice(0, MAX_ANALOGS);
  const setAnalogs = (ids: string[]) => {
    const next = new URLSearchParams(params);
    if (ids.length === 0 || (ids.length === 1 && ids[0] === candidate.id)) next.delete("analogos");
    else next.set("analogos", ids.join(","));
    setParams(next, { replace: true });
  };

  return (
    <div className="cc-compare">
      <div className="cc-compare__bar">
        <Link className="ea-back" to={`/?sitio=${site.id}&analogo=${candidate.id}`}>
          {t("compare.back")}
        </Link>
        {/* F8: la hoja de impresión de app.css deja solo la comparación, la ficha y las referencias con su URL. */}
        <button type="button" className="ea-back cc-print-button" title={t("compare.exportPdfHint")} onClick={() => window.print()}>
          {t("compare.exportPdf")}
        </button>
      </div>
      {entry && (
        <Explanation
          site={site}
          candidate={candidate}
          entry={entry}
          rank={siteEntries.indexOf(entry) + 1}
          total={siteEntries.length}
        />
      )}
      <Comparador
        site={site}
        candidate={candidate}
        entry={entry}
        limitations={<LimitationsPanel />}
        breaksDown={ficha?.breaks_down}
      />
      {analogs.length > 0 && (
        <MultiRadar entries={siteEntries} candidates={candidates} selected={analogs} onChange={setAnalogs} />
      )}
      <FichaPanel candidate={candidate} ficha={ficha} />
    </div>
  );
}
