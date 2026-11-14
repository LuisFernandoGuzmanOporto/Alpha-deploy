import type { Candidate, Ficha } from "../types";

interface Props {
  candidate: Candidate;
  /** `undefined` si el candidato aún no tiene una ficha publicable. */
  ficha: Ficha | undefined;
}

function List({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <section>
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

/** Ficha del análogo (F4, contenido de Lian). */
export function FichaPanel({ candidate, ficha }: Props) {
  return (
    <article className="ficha" aria-label={`Ficha de ${candidate.name}`}>
      <h2>Ficha: {candidate.name}</h2>
      {!ficha ? (
        <p>Este lugar aún no tiene ficha publicada.</p>
      ) : (
        <>
          {ficha.summary && <p>{ficha.summary}</p>}
          <List title="Procesos que sirven de análogo" items={ficha.processes} />
          <List title="Para qué sirve" items={ficha.use_cases} />
          {ficha.references.length > 0 && (
            <section>
              <h3>Referencias</h3>
              <ul>
                {ficha.references.map((reference) => (
                  <li key={reference.url}>
                    <a href={reference.url} target="_blank" rel="noopener noreferrer">
                      {reference.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </article>
  );
}
