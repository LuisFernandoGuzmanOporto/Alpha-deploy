import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { useContent } from "../../i18n";
import { scoreColor } from "../../lib/scoreColor";
import { useCountUp } from "../../lib/useCountUp";

type CssVars = CSSProperties & Record<`--${string}`, string | number>;

/** Barra de puntaje con el número al lado; la barra crece al aparecer y usa la escala de color del mapa. */
export function ScoreMeter({ score, size = "md" }: { score: number; size?: "sm" | "md" }) {
  const style: CssVars = { "--w": `${Math.max(0, Math.min(100, score))}%`, "--tone": scoreColor(score) };
  return (
    <span className={`ea-meter ea-meter--${size}`} style={style}>
      <span className="ea-meter__num">{score.toFixed(1)}</span>
      <span className="ea-meter__track" aria-hidden="true">
        <span className="ea-meter__fill" />
      </span>
    </span>
  );
}

/** Anillo con el puntaje en grande; el arco se dibuja y el número sube al aparecer. */
export function ScoreRing({ score, label }: { score: number; label: string }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const [ready, setReady] = useState(false);
  const shown = useCountUp(score, 1000);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);
  const offset = ready ? circumference * (1 - Math.max(0, Math.min(100, score)) / 100) : circumference;
  return (
    <div className="ea-ring" role="img" aria-label={`${label}: ${score.toFixed(1)} / 100`}>
      <svg viewBox="0 0 120 120" width="148" height="148" aria-hidden="true">
        <circle cx="60" cy="60" r={radius} className="ea-ring__bg" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          className="ea-ring__arc"
          stroke={scoreColor(score)}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
        />
      </svg>
      <span className="ea-ring__value" aria-hidden="true">
        <strong>{shown.toFixed(1)}</strong>
        <small>/ 100</small>
      </span>
    </div>
  );
}

/** Sección plegable con animación. `onToggle` avisa si quedó abierta (para cargar el contenido pesado después). */
export function Fold({
  title,
  eyebrow,
  children,
  onToggle,
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
  onToggle?: (open: boolean) => void;
}) {
  return (
    <details className="ea-fold" onToggle={(event) => onToggle?.(event.currentTarget.open)}>
      <summary>
        <span>
          {eyebrow && <span className="ea-eyebrow">{eyebrow}</span>}
          <strong>{title}</strong>
        </span>
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" className="ea-fold__chevron">
          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      <div className="ea-fold__body">{children}</div>
    </details>
  );
}

/** Estado de carga con un indicador que gira. */
export function Loading({ label }: { label?: string }) {
  const { ui } = useContent();
  return (
    <div className="ea-state" role="status">
      <span className="ea-spinner" aria-hidden="true" />
      <span>{label ?? ui.states.loading}</span>
    </div>
  );
}

/** Estado de error con detalle y botón para reintentar. */
export function ErrorState({ detail }: { detail: string }) {
  const { ui } = useContent();
  return (
    <div className="ea-state ea-state--error" role="alert">
      <strong>{ui.states.error}</strong>
      <small>{detail}</small>
      <button type="button" className="ea-button ea-button--secondary" onClick={() => window.location.reload()}>
        {ui.states.retry}
      </button>
    </div>
  );
}
