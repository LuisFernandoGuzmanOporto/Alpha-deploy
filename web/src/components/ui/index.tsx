import { useId, useRef } from "react";
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode, KeyboardEvent } from "react";
import { NavLink } from "react-router-dom";
import type { Candidate, Site, Tag as DataTag, VariableId } from "../../types";
import { es, tags, variables } from "../../content/es";
import "../../styles/ui.css";

/** <Button onClick={reset}>Limpiar filtros</Button> */
export function Button({ variant = "primary", className = "", type = "button", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" }) {
  return <button type={type} className={`ea-button ea-button--${variant} ${className}`} {...props} />;
}

/** <Card aria-label="Resultados">Contenido</Card> */
export function Card({ className = "", ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={`ea-card ${className}`} {...props} />;
}

/** <Header /> dentro de BrowserRouter. */
export function Header() {
  return <header className="ea-header"><NavLink className="ea-brand" to="/" aria-label="Earth Analogs, inicio"><svg viewBox="0 0 40 40" width="36" height="36" aria-hidden="true"><circle cx="20" cy="20" r="13" fill="none" stroke="currentColor" strokeWidth="2"/><ellipse cx="20" cy="20" rx="19" ry="6" transform="rotate(-35 20 20)" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="29" cy="8" r="3" fill="currentColor"/></svg>{es.brand}</NavLink><nav aria-label="Navegación principal"><NavLink end to="/">{es.nav.explore}</NavLink><NavLink to="/descubrimientos">{es.nav.discoveries}</NavLink><NavLink to="/metodologia">{es.nav.methodology}</NavLink></nav></header>;
}

/** <Footer /> */
export function Footer() {
  return <footer className="ea-footer"><strong>{es.tagline}</strong><span>Proyecto del equipo · NASA Space Apps Challenge · Cochabamba 2026</span><small>Proyecto independiente. No implica respaldo de NASA.</small></footer>;
}

/** <Layout><Outlet /></Layout> dentro de BrowserRouter. */
export function Layout({ children }: { children: ReactNode }) {
  return <div className="ea-layout"><a className="ea-skip" href="#ea-main">Saltar al contenido</a><Header/><main id="ea-main" tabIndex={-1}>{children}</main><Footer/></div>;
}

/** <ScoreBadge score={entry.score} /> */
export function ScoreBadge({ score }: { score: number | null }) {
  const valid = score !== null && Number.isFinite(score) && score >= 0 && score <= 100;
  return <span className="ea-score" title={es.scoreHelp}><span>{es.score}</span><strong>{valid ? score.toLocaleString("es", { maximumFractionDigits: 1 }) : "—"}<small> / 100</small></strong>{!valid && <span>{es.states.noData}</span>}</span>;
}

/** <Tag>Bolivia</Tag> */
export function Tag({ children, title }: { children: ReactNode; title?: string }) {
  return <span className="ea-tag" title={title}>{children}</span>;
}

/** <KnownBadge known={candidate.known} /> */
export function KnownBadge({ known }: { known: boolean }) {
  return <span className={`ea-tag ${known ? "ea-known" : "ea-new"}`} title={known ? "Documentado en la literatura como análogo planetario." : es.newHelp}>{known ? "◎ Conocido" : "◇ Nuevo"}</span>;
}

/** <TagList tags={candidate.tags} /> */
export function TagList({ tags: values }: { tags: readonly DataTag[] }) {
  return <ul className="ea-tags" aria-label="Características del terreno">{[...new Set(values)].map(value => <li key={value}><Tag title={tags[value].description}><span aria-hidden="true">{tags[value].icon}</span> {tags[value].label}</Tag></li>)}</ul>;
}

/** <SiteCard site={site} selected={selected} onSelect={setSite} /> */
export function SiteCard({ site, selected = false, onSelect }: { site: Site; selected?: boolean; onSelect: (id: string) => void }) {
  return <button className="ea-site" type="button" aria-pressed={selected} onClick={() => onSelect(site.id)}><span className="ea-eyebrow">{site.body === "moon" ? "Luna" : "Marte"}</span><strong>{site.name}</strong><span>{site.region}</span><span>{selected ? "✓ Seleccionado" : "Elegir destino →"}</span></button>;
}

/** <AnalogCard candidate={candidate} rank={1} score={84} onSelect={setCandidate} /> */
export function AnalogCard({ candidate, rank, score, selected = false, onSelect }: { candidate: Candidate; rank: number; score: number | null; selected?: boolean; onSelect: (id: string) => void }) {
  return <article className={`ea-card ea-analog ${selected ? "ea-selected" : ""}`}><span className="ea-eyebrow">Posición {rank.toLocaleString("es")}</span><h3><button className="ea-text-button" type="button" aria-pressed={selected} onClick={() => onSelect(candidate.id)}>{candidate.name}</button></h3><p>{candidate.country}</p><div className="ea-inline"><KnownBadge known={candidate.known}/>{candidate.is_bolivia && <Tag>Bolivia</Tag>}</div><p>{candidate.why}</p><ScoreBadge score={score}/><TagList tags={candidate.tags}/></article>;
}

/** <VariableBar variable="albedo" value={0.2} min={0} max={1} /> */
export function VariableBar({ variable, value, min, max }: { variable: VariableId; value: number | null; min: number; max: number }) {
  const id = useId();
  const available = value !== null && Number.isFinite(value);
  const scaleValid = Number.isFinite(min) && Number.isFinite(max) && max > min;
  const percent = available && scaleValid ? Math.max(0, Math.min(100, (value - min) / (max - min) * 100)) : 0;
  return <div className="ea-variable"><div className="ea-inline"><strong id={id}>{variables[variable].label}</strong><span>{available ? `${value.toLocaleString("es", { maximumFractionDigits: 2 })} ${variables[variable].unit}` : es.states.noData}</span></div><div className="ea-track" aria-hidden="true"><span style={{ width: `${percent}%` }}/></div><small>{variables[variable].description}{!scaleValid && " Escala no disponible."}</small></div>;
}

export interface TabItem { id: string; label: string; content: ReactNode }
/** <Tabs items={items} value={activeId} onChange={setActiveId} label="Vista" /> */
export function Tabs({ items, value, onChange, label }: { items: readonly TabItem[]; value: string; onChange: (id: string) => void; label: string }) {
  const prefix = useId();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const selected = items.some(item => item.id === value) ? value : items[0]?.id;
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
  return <div className="ea-tabs"><div role="tablist" aria-label={label}>{items.map((item, index) => <button type="button" key={item.id} ref={element => { refs.current[index] = element; }} role="tab" id={`${prefix}-tab-${item.id}`} aria-controls={`${prefix}-panel-${item.id}`} aria-selected={item.id === selected} tabIndex={item.id === selected ? 0 : -1} onKeyDown={event => navigate(event, index)} onClick={() => onChange(item.id)}>{item.label}</button>)}</div>{items.map(item => <div key={item.id} role="tabpanel" id={`${prefix}-panel-${item.id}`} aria-labelledby={`${prefix}-tab-${item.id}`} tabIndex={0} hidden={item.id !== selected}>{item.content}</div>)}</div>;
}

/** <LimitationsPanel /> */
export function LimitationsPanel() {
  const id = useId();
  return <aside className="ea-limitations" aria-labelledby={id}><span className="ea-eyebrow">Interpretar con cuidado</span><h2 id={id}>{es.limitationsTitle}</h2><p>{es.limitationsIntro}</p><ul>{es.limitations.map(item => <li key={item.title}><strong>{item.title}.</strong> {item.text}</li>)}</ul></aside>;
}
