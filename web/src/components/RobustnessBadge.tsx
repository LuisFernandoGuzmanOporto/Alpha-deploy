import { useLang, useT, type Lang } from "../i18n";
import { stability, type Robustness } from "../lib/robustness";

/** 1.º, 2.º… en español; 1st, 2nd, 3rd, 11th… en inglés. */
export function ordinal(n: number, lang: Lang): string {
  if (lang === "es") return `${n}.º`;
  const lastTwo = n % 100;
  const suffix = lastTwo >= 11 && lastTwo <= 13 ? "th" : ["th", "st", "nd", "rd"][n % 10] ?? "th";
  return `${n}${suffix}`;
}

/**
 * Insignia de robustez (tarea 4b): cuánto se mueve el puesto con los 15 escenarios de pesos.
 * El texto dice la categoría y el intervalo; el color solo la refuerza.
 */
export function RobustnessBadge({ robustness, detailed = false }: { robustness: Robustness; detailed?: boolean }) {
  const t = useT();
  const { lang } = useLang();
  const level = stability(robustness);
  const params = {
    label: t(`robust.${level}`),
    best: ordinal(robustness.best, lang),
    worst: ordinal(robustness.worst, lang),
    present: robustness.present,
    total: robustness.total,
  };
  const text = robustness.best === robustness.worst ? t("robust.same", params) : t("robust.range", params);
  return (
    <span className={`cc-robust cc-robust--${level}`} title={detailed ? undefined : t("robust.help")}>
      <span className="cc-robust__dot" aria-hidden="true" />
      <span>
        {text}
        {detailed && <small className="cc-robust__help">{t("robust.help")}</small>}
      </span>
    </span>
  );
}
