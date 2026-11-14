import { motion, useReducedMotion } from "motion/react";
import { useRef, type KeyboardEvent } from "react";
import { useT } from "../i18n";
import { formatValue } from "../lib/variables";
import type { Site } from "../types";

interface Props {
  sites: Site[];
  value: string;
  onChange: (siteId: string) => void;
}

/** Elección del destino como grupo de opciones: flechas para moverse y cambiar, Tab para salir. */
export function SiteSelector({ sites, value, onChange }: Props) {
  const t = useT();
  const reduce = useReducedMotion();
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const ordered = [...sites].sort((a, b) => Number(a.body === "mars") - Number(b.body === "mars"));

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const index = ordered.findIndex((site) => site.id === value);
    const next = ordered[(index + step + ordered.length) % ordered.length];
    if (!next) return;
    onChange(next.id);
    refs.current[next.id]?.focus();
  };

  return (
    <div className="cc-targets" role="radiogroup" aria-label={`${t("body.moon")} / ${t("body.mars")}`} onKeyDown={onKeyDown}>
      {ordered.map((site) => {
        const selected = site.id === value;
        return (
          <button
            key={site.id}
            ref={(node) => {
              refs.current[site.id] = node;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            className="cc-target"
            onClick={() => onChange(site.id)}
          >
            {selected && (
              <motion.span
                layoutId="target-active"
                className="cc-target__active"
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 42 }}
              />
            )}
            <span className={`cc-disc cc-disc--${site.body}`} aria-hidden="true" />
            <span className="cc-target__main">
              <span className="cc-target__name">{site.name}</span>
              <span className="cc-target__meta">
                {t(`body.${site.body}`)} · {site.region}
              </span>
            </span>
            <span className="cc-target__stats">
              <span>{formatValue("slope_deg", site.variables.slope_deg, t)}</span>
              <span>{formatValue("temp_mean_c", site.variables.temp_mean_c, t)}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
