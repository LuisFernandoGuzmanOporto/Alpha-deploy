import type { Lang } from "../i18n/messages";

/** 1.º, 2.º… en español; 1st, 2nd, 3rd, 11th… en inglés. */
export function ordinal(n: number, lang: Lang): string {
  if (lang === "es") return `${n}.º`;
  const lastTwo = n % 100;
  const suffix = lastTwo >= 11 && lastTwo <= 13 ? "th" : (["th", "st", "nd", "rd"][n % 10] ?? "th");
  return `${n}${suffix}`;
}
