import { useId, useRef } from "react";
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode, KeyboardEvent } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { LANGS, useContent, useLang, useT } from "../../i18n";
import { Select } from "../controls";
import { formatValue } from "../../lib/variables";
import type { Candidate, Site, Tag as DataTag, VariableId } from "../../types";
import "../../styles/ui.css";
import "../../styles/app.css";

// Componentes de Noe (sistema visual) conectados al idioma de la app. El idioma sale de
// `useLang`; si no hay proveedor (la vista de diseño `preview.html`) se usa español.

/** <Button onClick={reset}>Limpiar filtros</Button> */
export function Button({ variant = "primary", className = "", type = "button", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" }) {
  return <button type={type} className={`ea-button ea-button--${variant} ${className}`} {...props} />;
}

/** <Card aria-label="Resultados">Contenido</Card> */
export function Card({ className = "", ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={`ea-card ${className}`} {...props} />;
}

/** Selector de idioma del encabezado. */
export function LangSwitch() {
  const { lang, setLang } = useLang();
  const [searchParams, setSearchParams] = useSearchParams();
  const t = useT();
  return (
    <Select
      value={lang}
      onValueChange={(value) => {
        const next = value === "en" ? "en" : "es";
        setLang(next);
        // Mantiene coherente un enlace que ya fija idioma, sin tocar filtros ni selección.
        if (searchParams.has("lang")) {
          const updated = new URLSearchParams(searchParams);
          updated.set("lang", next);
          setSearchParams(updated, { replace: true });
        }
      }}
      label={t("lang.label")}
      icon={
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      }
      options={LANGS.map((code) => ({ value: code, label: t(`lang.${code}`), lang: code }))}
    />
  );
}

/** <Header /> dentro de BrowserRouter. */
export function Header() {
  const { ui } = useContent();
  const t = useT();
  return (
    <header className="cc-topbar">
      <OrbitalSky navigation />
      <NavLink className="cc-brand" to="/" aria-label={t("ui.brandAria")}>
        <svg viewBox="0 0 40 40" width="28" height="28" aria-hidden="true">
          <circle cx="20" cy="20" r="13" fill="none" stroke="currentColor" strokeWidth="2" />
          <ellipse cx="20" cy="20" rx="19" ry="6" transform="rotate(-35 20 20)" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="29" cy="8" r="3" fill="var(--cc-accent)" />
        </svg>
        <span className="cc-brand__name">{ui.brand}</span>
      </NavLink>
      <nav className="cc-nav" aria-label={t("ui.navLabel")}>
        <NavLink end to="/">{ui.nav.explore}</NavLink>
        <NavLink to="/descubrimientos">{ui.nav.discoveries}</NavLink>
        <NavLink to="/metodologia">{ui.nav.methodology}</NavLink>
      </nav>
      <LangSwitch />
    </header>
  );
}

/** <Footer /> */
export function Footer() {
  const t = useT();
  return (
    <footer className="cc-footer">
      <span>{t("ui.footerTeam")}</span>
      <small>{t("ui.footerDisclaimer")}</small>
    </footer>
  );
}

// Campo determinista: misma distribución al navegar, sin cálculos por fotograma.
const skyStars = Array.from({ length: 560 }, (_, i) => ({
  x: (Math.sin(i * 127.1 + 13) * 43758.5453 % 1 + 1) % 1 * 1440,
  y: (Math.sin(i * 311.7 + 29) * 22578.1459 % 1 + 1) % 1 * 900,
  radius: i % 23 === 0 ? 1.9 : i % 5 === 0 ? 0.95 : 0.5,
}));

/** Nebulosa ilustrativa original. Decoración sin significado científico. */
function OrbitalSky({ navigation = false }: { navigation?: boolean }) {
  return (
    <svg className={`cc-sky${navigation ? " cc-sky--nav" : ""}`} viewBox={navigation ? "0 0 1440 160" : "0 0 1440 900"} preserveAspectRatio="xMidYMin slice" aria-hidden="true" focusable="false">
      <g className="cc-sky__stars">
        {skyStars.filter((star) => star.radius < 1.9).map((star, i) => <circle key={i} cx={star.x} cy={star.y} r={star.radius} />)}
      </g>
      <g className="cc-sky__bright">
        {skyStars.filter((star) => star.radius >= 1.9).map((star, i) => (
          <g className="cc-sky__twinkle" key={i}>
            <circle cx={star.x} cy={star.y} r="13" opacity="0.1" />
            <circle cx={star.x} cy={star.y} r="5.5" opacity="0.25" />
            <path className="cc-sky__diffraction" d={`M${star.x - 6} ${star.y}h12 M${star.x} ${star.y - 8}v16`} />
            <circle cx={star.x} cy={star.y} r="2" />
          </g>
        ))}
      </g>
    </svg>
  );
}
export function Layout({ children }: { children: ReactNode }) {
  const t = useT();
  return (
    <div className="cc-app">
      <OrbitalSky />
      <a className="ea-skip" href="#ea-main">{t("ui.skip")}</a>
      <Header />
      <main id="ea-main" tabIndex={-1}>{children}</main>
      <Footer />
    </div>
  );
}

/** <ScoreBadge score={entry.score} /> */
export function ScoreBadge({ score }: { score: number | null }) {
  const { lang } = useLang();
  const { ui } = useContent();
  const valid = score !== null && Number.isFinite(score) && score >= 0 && score <= 100;
  return (
    <span className="ea-score" title={ui.scoreHelp}>
      <span>{ui.score}</span>
      <strong>{valid ? score.toLocaleString(lang, { maximumFractionDigits: 1 }) : "—"}<small> / 100</small></strong>
      {!valid && <span>{ui.states.noData}</span>}
    </span>
  );
}

/** <Tag>Bolivia</Tag> */
export function Tag({ children, title }: { children: ReactNode; title?: string }) {
  return <span className="ea-tag" title={title}>{children}</span>;
}

/** <KnownBadge known={candidate.known} /> */
export function KnownBadge({ known }: { known: boolean }) {
  const { ui } = useContent();
  const t = useT();
  return (
    <span className={`ea-tag ${known ? "ea-known" : "ea-new"}`} title={known ? t("ui.knownHelp") : ui.newHelp}>
      {known ? `◎ ${ui.known}` : `◇ ${ui.new}`}
    </span>
  );
}

/** <TagList tags={candidate.tags} /> */
export function TagList({ tags: values }: { tags: readonly DataTag[] }) {
  const { tags } = useContent();
  const t = useT();
  if (values.length === 0) return null;
  return (
    <ul className="ea-tags" aria-label={t("ui.tagsAria")}>
      {[...new Set(values)].map((value) => (
        <li key={value}>
          <Tag title={tags[value].description}>
            <span aria-hidden="true">{tags[value].icon}</span> {tags[value].label}
          </Tag>
        </li>
      ))}
    </ul>
  );
}

/** <SiteCard site={site} selected={selected} onSelect={setSite} /> */
export function SiteCard({ site, selected = false, onSelect }: { site: Site; selected?: boolean; onSelect: (id: string) => void }) {
  const t = useT();
  const { variables } = useContent();
  const highlights = (["slope_deg", "temp_mean_c"] as const).filter((variable) => site.variables[variable] !== null);
  return (
    <button className="ea-site" type="button" aria-pressed={selected} onClick={() => onSelect(site.id)}>
      <span className={`ea-disc ea-disc--${site.body}`} aria-hidden="true" />
      <span className="ea-eyebrow">{t(`body.${site.body}`)}</span>
      <strong>{site.name}</strong>
      <span className="ea-site__region">{site.region}</span>
      {highlights.length > 0 && (
        <span className="ea-site__stats">
          {highlights.map((variable) => (
            <span key={variable} title={variables[variable].label}>
              {formatValue(variable, site.variables[variable], t)}
            </span>
          ))}
        </span>
      )}
      <span className="ea-site__cta">{selected ? t("ui.selected") : t("ui.chooseSite")}</span>
    </button>
  );
}

/** <AnalogCard candidate={candidate} rank={1} score={84} onSelect={setCandidate} /> */
export function AnalogCard({ candidate, rank, score, selected = false, onSelect }: { candidate: Candidate; rank: number; score: number | null; selected?: boolean; onSelect: (id: string) => void }) {
  const t = useT();
  return (
    <article className={`ea-card ea-analog ${selected ? "ea-selected" : ""}`}>
      <span className="ea-eyebrow">{t("ui.position", { n: rank })}</span>
      <h3>
        <button className="ea-text-button" type="button" aria-pressed={selected} onClick={() => onSelect(candidate.id)}>{candidate.name}</button>
      </h3>
      <p>{candidate.country}</p>
      <div className="ea-inline">
        <KnownBadge known={candidate.known} />
        {candidate.is_bolivia && <Tag>Bolivia</Tag>}
      </div>
      <p>{candidate.why}</p>
      <ScoreBadge score={score} />
      <TagList tags={candidate.tags} />
    </article>
  );
}

/** <VariableBar variable="albedo" value={0.2} min={0} max={1} /> */
export function VariableBar({ variable, value, min, max }: { variable: VariableId; value: number | null; min: number; max: number }) {
  const id = useId();
  const { lang } = useLang();
  const { ui, variables } = useContent();
  const available = value !== null && Number.isFinite(value);
  const scaleValid = Number.isFinite(min) && Number.isFinite(max) && max > min;
  const percent = available && scaleValid ? Math.max(0, Math.min(100, (value - min) / (max - min) * 100)) : 0;
  return (
    <div className="ea-variable">
      <div className="ea-inline">
        <strong id={id}>{variables[variable].label}</strong>
        <span>{available ? `${value.toLocaleString(lang, { maximumFractionDigits: 2 })} ${variables[variable].unit}` : ui.states.noData}</span>
      </div>
      <div className="ea-track" aria-hidden="true"><span style={{ width: `${percent}%` }} /></div>
      <small>{variables[variable].description}</small>
    </div>
  );
}

export interface TabItem { id: string; label: string; content: ReactNode }
/** <Tabs items={items} value={activeId} onChange={setActiveId} label="Vista" /> */
export function Tabs({ items, value, onChange, label }: { items: readonly TabItem[]; value: string; onChange: (id: string) => void; label: string }) {
  const prefix = useId();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const selected = items.some((item) => item.id === value) ? value : items[0]?.id;
  const navigate = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % items.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + items.length) % items.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    else return;
    event.preventDefault();
    refs.current[next]?.focus();
    const item = items[next];
    if (item) onChange(item.id);
  };
  return (
    <div className="ea-tabs">
      <div role="tablist" aria-label={label}>
        {items.map((item, index) => (
          <button
            type="button"
            key={item.id}
            ref={(element) => { refs.current[index] = element; }}
            role="tab"
            id={`${prefix}-tab-${item.id}`}
            aria-controls={`${prefix}-panel-${item.id}`}
            aria-selected={item.id === selected}
            tabIndex={item.id === selected ? 0 : -1}
            onKeyDown={(event) => navigate(event, index)}
            onClick={() => onChange(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item) => (
        <div key={item.id} role="tabpanel" id={`${prefix}-panel-${item.id}`} aria-labelledby={`${prefix}-tab-${item.id}`} tabIndex={0} hidden={item.id !== selected}>
          {item.content}
        </div>
      ))}
    </div>
  );
}

/** <LimitationsPanel /> */
export function LimitationsPanel() {
  const id = useId();
  const { ui } = useContent();
  const t = useT();
  return (
    <aside className="ea-limitations" aria-labelledby={id}>
      <span className="ea-eyebrow">{t("ui.interpret")}</span>
      <h2 id={id}>{ui.limitationsTitle}</h2>
      <p>{ui.limitationsIntro}</p>
      <ul>
        {ui.limitations.map((item) => (
          <li key={item.title}><strong>{item.title}.</strong> {item.text}</li>
        ))}
      </ul>
    </aside>
  );
}
