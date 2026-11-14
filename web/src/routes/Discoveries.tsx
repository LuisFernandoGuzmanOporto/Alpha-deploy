import { Link } from "react-router-dom";
import { KnownBadge } from "../components/placeholders/KnownBadge";
import { useData } from "../lib/data";
import { topUnstudied } from "../lib/ranking";

const TOP_N = 5;

export function Discoveries() {
  const state = useData();

  if (state.status === "loading") return <p>Cargando datos…</p>;
  if (state.status === "error") return <p role="alert">Error al cargar los datos: {state.message}</p>;

  const { sites, candidates, results } = state.data;
  if (sites.length === 0) return <p>Aún no hay sitios cargados.</p>;

  return (
    <>
      <h1>Descubrimientos</h1>
      <p>
        Los {TOP_N} mejores análogos poco estudiados de cada sitio: lugares que la literatura aún no documenta como
        análogo planetario, evaluados con el mismo índice que los conocidos.
      </p>
      {sites.map((site) => {
        const rows = topUnstudied(results, candidates, site.id, TOP_N);
        return (
          <section key={site.id}>
            <h2>{site.name}</h2>
            {rows.length === 0 ? (
              <p>No hay candidatos poco estudiados con datos suficientes para este sitio.</p>
            ) : (
              <ol>
                {rows.map(({ entry, candidate }) => (
                  <li key={candidate.id}>
                    <Link to={`/comparar/${site.id}/${candidate.id}`}>{candidate.name}</Link> — {entry.score.toFixed(1)}{" "}
                    <KnownBadge known={candidate.known} /> <small>{candidate.country}</small>
                  </li>
                ))}
              </ol>
            )}
          </section>
        );
      })}
    </>
  );
}
