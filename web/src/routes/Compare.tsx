import { Link, useParams } from "react-router-dom";
import { Comparador } from "../components/compare/Comparador";
import { FichaPanel } from "../components/FichaPanel";
import { LimitationsPanel } from "../components/ui";
import { ErrorState, Loading } from "../components/ui/extra";
import { useT } from "../i18n";
import { loadErrorText, useData } from "../lib/data";

export function Compare() {
  const { siteId, candidateId } = useParams();
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

  const entry = results.sites[site.id]?.find((e) => e.candidate_id === candidate.id) ?? null;
  const ficha = fichas[candidate.id];

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
      <Comparador
        site={site}
        candidate={candidate}
        entry={entry}
        limitations={<LimitationsPanel />}
        breaksDown={ficha?.breaks_down}
      />
      <FichaPanel candidate={candidate} ficha={ficha} />
    </div>
  );
}
