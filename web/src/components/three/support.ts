// Utilidades compartidas por las escenas 3D (hero y globo).
import { useEffect, useState } from "react";

let webglCache: boolean | null = null;

/** Verdadero si el navegador puede crear un contexto WebGL. Se calcula una sola vez. */
export function hasWebGL(): boolean {
  if (webglCache !== null) return webglCache;
  try {
    const canvas = document.createElement("canvas");
    webglCache = Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    webglCache = false;
  }
  return webglCache;
}

/** Sigue la preferencia "reducir movimiento" del sistema. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/** Verdadero mientras el elemento está en pantalla: las escenas dejan de dibujar fuera de la vista. */
export function useInView<T extends Element>(): [(el: T | null) => void, boolean] {
  const [element, setElement] = useState<T | null>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => setVisible(entries.some((e) => e.isIntersecting)), {
      rootMargin: "120px 0px",
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);
  return [setElement, visible];
}

/**
 * Latitud y longitud (grados) a un punto sobre una esfera de three.js con las UV por defecto
 * (textura equirectangular, longitud -180 en el borde izquierdo, norte arriba).
 */
export function latLonToXYZ(lat: number, lon: number, radius: number): [number, number, number] {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return [-radius * Math.sin(phi) * Math.cos(theta), radius * Math.cos(phi), radius * Math.sin(phi) * Math.sin(theta)];
}
