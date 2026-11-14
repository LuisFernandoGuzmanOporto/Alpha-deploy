import { Link } from "react-router-dom";
import { useData } from "../lib/data";

export function Home() {
  const state = useData();

  if (state.status === "loading") return <p>Cargando datos…</p>;
  if (state.status === "error") return <p role="alert">Error al cargar los datos: {state.message}</p>;

  const { sites, candidates, results } = state.data;
  if (sites.length === 0 || candidates.length === 0) {
    return <p>Aún no hay sitios o candidatos cargados.</p>;
  }

  return (
    <>
      <h1>Earth Analogs</h1>
      <p>
        {sites.length} sitios, {candidates.length} candidatos terrestres. Generado el {results.generated_at}.
      </p>
      <ul>
        {sites.map((site) => {
          const top = results.sites[site.id]?.[0];
          return (
            <li key={site.id}>
              {site.name}
              {top && (
                <>
                  {" "}
                  — <Link to={`/comparar/${site.id}/${top.candidate_id}`}>mejor análogo ({top.score})</Link>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
