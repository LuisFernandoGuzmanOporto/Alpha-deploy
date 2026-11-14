import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useT } from "../i18n";
import type { Site, SiteBody } from "../types";

interface Props {
  sites: Site[];
  value: string;
  onChange: (siteId: string) => void;
}

const BODIES: readonly SiteBody[] = ["moon", "mars"];

/** Paso de la tecla de flecha: 1 hacia adelante, -1 hacia atrás, 0 si no es una flecha. */
function arrowStep(key: string): number {
  if (key === "ArrowDown" || key === "ArrowRight") return 1;
  if (key === "ArrowUp" || key === "ArrowLeft") return -1;
  return 0;
}

/** Selector compacto: primero Luna o Marte, debajo el sitio elegido; los demás aparecen al abrirlo. */
export function SiteSelector({ sites, value, onChange }: Props) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const bodyRefs = useRef<Partial<Record<SiteBody, HTMLButtonElement | null>>>({});
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const current = sites.find((site) => site.id === value);
  const body = current?.body ?? "moon";
  const options = sites.filter((site) => site.body === body);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onEscape);
    // Al abrir, el foco va al sitio elegido para seguir con las flechas.
    const index = Math.max(0, options.findIndex((site) => site.id === value));
    optionRefs.current[index]?.focus();
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onEscape);
    };
    // Solo al abrir o cerrar: mover el foco en cada render rompería la navegación con flechas.
  }, [open]);

  // Si el sitio cambia con la lista abierta (por ejemplo, al pasar de la Luna a Marte), la lista se cierra.
  useEffect(() => setOpen(false), [value]);

  const pickBody = (next: SiteBody) => {
    if (next === body) return;
    const first = sites.find((site) => site.body === next);
    if (first) onChange(first.id);
  };

  const onBodyKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = arrowStep(event.key);
    if (!step) return;
    event.preventDefault();
    const next = BODIES[(BODIES.indexOf(body) + step + BODIES.length) % BODIES.length] ?? "moon";
    pickBody(next);
    bodyRefs.current[next]?.focus();
  };

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onMenuKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const step = event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0;
    const items = optionRefs.current.filter((item): item is HTMLButtonElement => item !== null);
    const index = items.findIndex((item) => item === document.activeElement);
    let next = -1;
    if (step) next = (index + step + items.length) % items.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    if (next < 0) return;
    event.preventDefault();
    items[next]?.focus();
  };

  return (
    <div className="cc-picker" ref={rootRef}>
      <div className="cc-seg" role="radiogroup" aria-label={t("selector.body")} onKeyDown={onBodyKeyDown}>
        {BODIES.map((option) => (
          <button
            key={option}
            ref={(node) => {
              bodyRefs.current[option] = node;
            }}
            type="button"
            role="radio"
            aria-checked={option === body}
            tabIndex={option === body ? 0 : -1}
            className="cc-seg__btn"
            onClick={() => pickBody(option)}
          >
            <span className={`cc-disc cc-disc--${option}`} aria-hidden="true" />
            {t(`body.${option}`)}
          </button>
        ))}
      </div>

      <button
        ref={triggerRef}
        type="button"
        className="cc-current"
        aria-expanded={open}
        aria-controls="cc-site-menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="cc-current__text">
          <span className="visually-hidden">{t("selector.label")}: </span>
          <span className="cc-current__name">{current?.name}</span>
          <span className="cc-current__meta">{current?.region}</span>
        </span>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="cc-current__chev">
          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul id="cc-site-menu" className="cc-menu" aria-label={t("selector.label")} onKeyDown={onMenuKeyDown}>
          {options.map((site, index) => (
            <li key={site.id}>
              <button
                ref={(node) => {
                  optionRefs.current[index] = node;
                }}
                type="button"
                className="cc-menu__item"
                aria-current={site.id === value}
                onClick={() => {
                  onChange(site.id);
                  close();
                }}
              >
                <span className="cc-menu__name">{site.name}</span>
                <span className="cc-menu__meta">{site.region}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
