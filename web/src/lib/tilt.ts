// Inclinación 3D de las tarjetas `.tilt` siguiendo el cursor. Un solo escucha delegado en el documento;
// no hace nada con "reducir movimiento" ni en pantallas táctiles.

const MAX_DEG = 7;

/** Activa el efecto y devuelve la función que lo retira. */
export function installTilt(root: Document = document): () => void {
  const media = typeof window.matchMedia === "function" ? window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)") : null;
  let current: HTMLElement | null = null;

  const reset = (el: HTMLElement) => {
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
  };

  const onMove = (event: PointerEvent) => {
    if (media?.matches) return;
    const target = event.target instanceof Element ? event.target.closest<HTMLElement>(".tilt") : null;
    if (current && current !== target) reset(current);
    current = target;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    target.style.setProperty("--tilt-y", `${((x - 0.5) * 2 * MAX_DEG).toFixed(2)}deg`);
    target.style.setProperty("--tilt-x", `${((0.5 - y) * 2 * MAX_DEG).toFixed(2)}deg`);
    target.style.setProperty("--shine-x", `${(x * 100).toFixed(1)}%`);
    target.style.setProperty("--shine-y", `${(y * 100).toFixed(1)}%`);
  };
  const onLeave = () => {
    if (current) reset(current);
    current = null;
  };

  root.addEventListener("pointermove", onMove, { passive: true });
  root.addEventListener("pointerleave", onLeave);
  return () => {
    root.removeEventListener("pointermove", onMove);
    root.removeEventListener("pointerleave", onLeave);
  };
}
