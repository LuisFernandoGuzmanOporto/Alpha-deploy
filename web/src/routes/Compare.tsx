import { Link, useParams } from "react-router-dom";
import { LimitationsPanel } from "../components/placeholders/LimitationsPanel";
import { useData } from "../lib/data";

export function Compare() {
  const { siteId, candidateId } = useParams();
  const state = useData();

  if (state.status === "loading") return <p>Cargando datos…</p>;
  if (state.status === "error") return <p role="alert">Error al cargar los datos: {state.message}</p>;

  const site = state.data.sites.find((s) => s.id === siteId);
  const candidate = state.data.candidates.find((c) => c.id === candidateId);
  if (!site || !candidate) {
    return (
      <>
        <p>No existe esa comparación.</p>
        <Link to="/">Volver al inicio</Link>
      </>
    );
  }

  // Aquí se integrará el componente Comparador de Dante (web/src/components/compare/).
  return (
    <>
      <h1>
        {site.name} vs. {candidate.name}
      </h1>
      <LimitationsPanel />
    </>
  );
}
