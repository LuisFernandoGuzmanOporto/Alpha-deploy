import { useId } from "react";
import { useContent, useLang, useT } from "../../i18n";
import { explainPair } from "../../lib/explain";
import { ordinal } from "../../lib/ordinal";
import type { Candidate, RankingEntry, Site } from "../../types";
import { Card } from "../ui";

interface Props {
  site: Site;
  candidate: Candidate;
  /** Fila del par en `results.json` (pesos iguales) y su puesto en ese ranking. */
  entry: RankingEntry;
  rank: number;
  total: number;
}

/** F7 (tarea 4d): por qué un par del top 5 aparece arriba, con una plantilla fija. Fuera del top 5 no muestra nada. */
export function Explanation({ site, candidate, entry, rank, total }: Props) {
  const t = useT();
  const { lang } = useLang();
  const { variables, tags } = useContent();
  const titleId = useId();
  const sentences = explainPair(site, candidate, entry, rank, total, t, {
    variable: (variable) => variables[variable].label,
    tag: (tag) => tags[tag].label,
    ordinal: (n) => ordinal(n, lang),
  });
  if (!sentences) return null;
  return (
    <Card className="comparador-card cc-explain" aria-labelledby={titleId}>
      <h3 id={titleId}>{t("explain.title")}</h3>
      <p>{sentences.join(" ")}</p>
      <p className="comparador-note">{t("explain.note")}</p>
    </Card>
  );
}
