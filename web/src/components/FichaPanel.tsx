import { useT } from "../i18n";
import type { Candidate, Ficha } from "../types";
import { Card } from "./ui";

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
  const t = useT();
  return (
    <Card className="ea-ficha" aria-label={t("ficha.aria", { name: candidate.name })}>
      <h2>{t("ficha.title", { name: candidate.name })}</h2>
      {!ficha ? (
        <p>{t("ficha.none")}</p>
      ) : (
        <>
          {ficha.summary && <p>{ficha.summary}</p>}
          <List title={t("ficha.processes")} items={ficha.processes} />
          <List title={t("ficha.useCases")} items={ficha.use_cases} />
          {ficha.references.length > 0 && (
            <section>
              <h3>{t("ficha.references")}</h3>
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
    </Card>
  );
}
