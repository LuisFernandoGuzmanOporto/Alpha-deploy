import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useT } from "../i18n";
import type { Candidate, Site } from "../types";
import { hasWebGL, usePrefersReducedMotion } from "./three/support";

// three.js y las texturas (~1 MB) llegan en un fragmento aparte, después del primer pintado.
const HeroScene = lazy(() => import("./three/HeroScene"));

export interface HeroProps {
  sites: Site[];
  candidates: Candidate[];
  /** id del ancla a la que baja el botón principal. */
  exploreTarget: string;
}

/** Portada de la pantalla Explorar: mensaje principal, cifras reales del catálogo y la escena 3D. */
export function Hero({ sites, candidates, exploreTarget }: HeroProps) {
  const t = useT();
  const [webgl, setWebgl] = useState(false);
  // La escena se pide cuando el navegador queda libre: no compite con el mapa ni con los datos.
  useEffect(() => {
    // En teléfonos y con "ahorro de datos" se queda el planeta en CSS: three.js y las texturas pesan ~1,5 MB.
    const small = window.matchMedia?.("(max-width: 760px)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (small || saveData || !hasWebGL()) return;
    const start = () => setWebgl(true);
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(start, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(start, 300);
    return () => window.clearTimeout(id);
  }, []);

  const stats = [
    { value: sites.length, label: t("hero.sites") },
    { value: candidates.length, label: t("hero.places") },
    { value: candidates.filter((c) => !c.known).length, label: t("hero.unstudied") },
    { value: candidates.filter((c) => c.is_bolivia).length, label: t("hero.bolivia") },
  ];

  const goExplore = () => {
    const target = document.getElementById(exploreTarget);
    if (!target) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    target.focus({ preventScroll: true });
  };

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__backdrop" aria-hidden="true" />
      <div className="hero__visual">
        {/* Planeta en CSS: se ve mientras carga la escena y es la alternativa sin WebGL. */}
        <div className="hero__planet" aria-hidden="true" />
        {webgl && (
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        )}
      </div>

      <div className="hero__copy">
        <p className="hero__eyebrow">
          <span className="hero__pulse" aria-hidden="true" />
          {t("hero.eyebrow")}
        </p>
        <h1 id="hero-title" className="hero__title">
          {t("hero.title")} <span className="hero__accent">{t("hero.titleAccent")}</span>
        </h1>
        <p className="hero__lead">{t("hero.lead")}</p>
        <div className="hero__actions">
          <button type="button" className="btn btn--primary" onClick={goExplore}>
            {t("hero.ctaExplore")}
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M12 5v14M6 13l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <Link className="btn btn--ghost" to="/descubrimientos">
            {t("hero.ctaDiscover")}
          </Link>
        </div>
        <dl className="hero__stats">
          {stats.map((stat) => (
            <div key={stat.label} className="hero__stat">
              <dd>
                <CountUp value={stat.value} />
              </dd>
              <dt>{stat.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** Número que cuenta desde 0 al entrar; con "reducir movimiento" se muestra fijo. */
function CountUp({ value, duration = 1100 }: { value: number; duration?: number }) {
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = useState(reduced ? value : 0);
  const frame = useRef(0);
  useEffect(() => {
    if (reduced) {
      setShown(value);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setShown(Math.round(value * (1 - (1 - p) ** 3)));
      if (p < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [value, duration, reduced]);
  return (
    <>
      <span aria-hidden="true">{shown}</span>
      <span className="visually-hidden">{value}</span>
    </>
  );
}
