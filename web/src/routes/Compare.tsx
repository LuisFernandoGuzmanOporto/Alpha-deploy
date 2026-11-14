import { Link, useParams } from "react-router-dom";
import { Comparador } from "../components/compare/Comparador";
import { LimitationsPanel } from "../components/placeholders/LimitationsPanel";
import { useData } from "../lib/data";

export function Compare() {
  const { siteId, candidateId } = useParams();
  const state = useData();

  if (state.status === "loading") return <p>Cargando datos…</p>;
  if (state.status === "error") return <p role="alert">Error al cargar los datos: {state.message}</p>;

  const { sites, candidates, results } = state.data;
  const site = sites.find((s) => s.id === siteId);
  const candidate = candidates.find((c) => c.id === candidateId);
  if (!site || !candidate) {
    return (
      <>
        <p>No existe esa comparación.</p>
        <Link to="/">Volver al inicio</Link>
      </>
    );
  }

  const entry = results.sites[site.id]?.find((e) => e.candidate_id === candidate.id) ?? null;

  return (
    <>
      <p>
        <Link to={`/?sitio=${site.id}&analogo=${candidate.id}`}>← Volver al ranking</Link>
      </p>
      <Comparador site={site} candidate={candidate} entry={entry} limitations={<LimitationsPanel />} />
    </>
  );
}
