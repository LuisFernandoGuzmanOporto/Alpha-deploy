import { Link, useParams } from "react-router-dom";
import { Comparador } from "../components/compare/Comparador";
import { FichaPanel } from "../components/FichaPanel";
import { LimitationsPanel } from "../components/placeholders/LimitationsPanel";
import { useContent, useT } from "../i18n";
import { loadErrorText, useData } from "../lib/data";

export function Compare() {
  const { siteId, candidateId } = useParams();
  const state = useData();
  const t = useT();
  const { ui } = useContent();

  if (state.status === "loading") return <p>{ui.states.loading}</p>;
  if (state.status === "error") return <p role="alert">{loadErrorText(t, state.error)}</p>;

  const { sites, candidates, results, fichas } = state.data;
  const site = sites.find((s) => s.id === siteId);
  const candidate = candidates.find((c) => c.id === candidateId);
  if (!site || !candidate) {
    return (
      <>
        <p>{t("compare.notFound")}</p>
        <Link to="/">{t("common.backHome")}</Link>
      </>
    );
  }

  const entry = results.sites[site.id]?.find((e) => e.candidate_id === candidate.id) ?? null;
  const ficha = fichas[candidate.id];

  return (
    <>
      <p>
        <Link to={`/?sitio=${site.id}&analogo=${candidate.id}`}>{t("compare.back")}</Link>
      </p>
      <Comparador
        site={site}
        candidate={candidate}
        entry={entry}
        limitations={<LimitationsPanel />}
        breaksDown={ficha?.breaks_down}
      />
      <FichaPanel candidate={candidate} ficha={ficha} />
    </>
  );
}
