import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { useT } from "../../i18n";
import { clampLat, project, wrapLon, type View } from "./orthographic";
import { spreadMarkers } from "./layout";

export interface GlobeMarker {
  id: string;
  lat: number;
  lon: number;
  /** Texto corto dentro del marcador (por ejemplo, el puesto en el ranking). */
  badge: string;
  kind: "site" | "analog";
  /** Nombre accesible del marcador (globo 3D). */
  title?: string;
}

export interface GlobeProps {
  /** URL de una textura equirectangular 2:1 (longitud -180 a 180, norte arriba). */
  texture: string;
  markers: GlobeMarker[];
  initialView: View;
  /** Descripción accesible del globo. */
  label: string;
  /** Lado del globo en píxeles CSS. */
  size?: number;
}

const KEY_STEP_DEG = 10;
/** Mientras se arrastra se calcula un píxel de cada bloque de 2 × 2 para que el giro sea fluido. */
const DRAG_BLOCK = 2;
const SHADE_MIN = 0.55;
const MAX_PIXEL_RATIO = 2;
const MARKER_RADIUS = 9;
/** Espacio mínimo (en px a 360 px de lado) entre marcadores agrupados. */
const MARKER_GAP = 3;
/** Colores de tokens.css: el sitio con el acento (cian) y los análogos con la escala del puntaje (ámbar). */
function tokenColor(name: string, fallback: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

interface Texture {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

/** Globo en proyección ortográfica dibujado en un canvas: se arrastra o se gira con las flechas. */
export function Globe({ texture, markers, initialView, label, size = 360 }: GlobeProps) {
  const t = useT();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textureRef = useRef<Texture | null>(null);
  const dragRef = useRef<{ x: number; y: number } | null>(null);
  const frameRef = useRef(0);
  const [view, setView] = useState<View>(initialView);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  const { lat: initialLat, lon: initialLon } = initialView;
  useEffect(() => setView({ lat: initialLat, lon: initialLon }), [initialLat, initialLon]);

  useEffect(() => {
    let active = true;
    setStatus("loading");
    const image = new Image();
    image.onload = () => {
      if (!active) return;
      const scratch = document.createElement("canvas");
      scratch.width = image.naturalWidth;
      scratch.height = image.naturalHeight;
      const ctx = scratch.getContext("2d");
      if (!ctx) return setStatus("error");
      ctx.drawImage(image, 0, 0);
      const { data } = ctx.getImageData(0, 0, scratch.width, scratch.height);
      textureRef.current = { data, width: scratch.width, height: scratch.height };
      setStatus("ready");
    };
    image.onerror = () => active && setStatus("error");
    image.src = texture;
    return () => {
      active = false;
    };
  }, [texture]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const tex = textureRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !tex || !ctx) return;
    const px = Math.round(size * Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO));
    if (canvas.width !== px) {
      canvas.width = px;
      canvas.height = px;
    }
    renderSphere(ctx, px, tex, view, dragging ? DRAG_BLOCK : 1);
    renderMarkers(ctx, px, markers, view);
  }, [size, view, markers, dragging]);

  useEffect(() => {
    if (status !== "ready") return;
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, [draw, status]);

  const rotate = (dLon: number, dLat: number) =>
    setView((v) => ({ lat: clampLat(v.lat + dLat), lon: wrapLon(v.lon + dLon) }));

  const onPointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { x: event.clientX, y: event.clientY };
    setDragging(true);
  };

  const endDrag = () => {
    dragRef.current = null;
    setDragging(false);
  };

  const onPointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    const start = dragRef.current;
    if (!start) return;
    const degPerPx = 180 / (Math.PI * (size / 2));
    rotate(-(event.clientX - start.x) * degPerPx, (event.clientY - start.y) * degPerPx);
    dragRef.current = { x: event.clientX, y: event.clientY };
  };

  const onKeyDown = (event: KeyboardEvent<HTMLCanvasElement>) => {
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-KEY_STEP_DEG, 0],
      ArrowRight: [KEY_STEP_DEG, 0],
      ArrowUp: [0, KEY_STEP_DEG],
      ArrowDown: [0, -KEY_STEP_DEG],
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    rotate(move[0], move[1]);
  };

  return (
    <div className="globe" style={{ maxWidth: size }}>
      <canvas
        ref={canvasRef}
        className="globe-canvas"
        style={{ width: "100%", aspectRatio: "1" }}
        role="img"
        aria-label={`${label}. ${t("globe.help")}`}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
      />
      {status === "loading" && <p className="globe-status">{t("globe.loadingTexture")}</p>}
      {status === "error" && (
        <p className="globe-status" role="alert">
          {t("globe.textureError")}
        </p>
      )}
      <button type="button" className="globe-reset" onClick={() => setView(initialView)}>
        {t("globe.reset")}
      </button>
    </div>
  );
}

/**
 * Pinta la esfera con la proyección ortográfica inversa y un sombreado hacia el borde.
 * Calcula un píxel por bloque de `block × block` y lo copia al resto del bloque.
 */
function renderSphere(ctx: CanvasRenderingContext2D, px: number, tex: Texture, view: View, block: number) {
  const out = ctx.createImageData(px, px);
  const radius = px / 2;
  const sinPhi0 = Math.sin((view.lat * Math.PI) / 180);
  const cosPhi0 = Math.cos((view.lat * Math.PI) / 180);
  const lon0 = (view.lon * Math.PI) / 180;
  for (let row = 0; row < px; row += block) {
    const y = (radius - row - block / 2) / radius;
    for (let col = 0; col < px; col += block) {
      const x = (col + block / 2 - radius) / radius;
      const rho2 = x * x + y * y;
      if (rho2 > 1) continue;
      const cosC = Math.sqrt(1 - rho2);
      const lat = Math.asin(Math.max(-1, Math.min(1, cosC * sinPhi0 + y * cosPhi0)));
      const lon = lon0 + Math.atan2(x, cosC * cosPhi0 - y * sinPhi0);
      const u = ((((lon / (2 * Math.PI) + 0.5) % 1) + 1) % 1) * tex.width;
      const v = (0.5 - lat / Math.PI) * tex.height;
      const src = (Math.min(tex.height - 1, Math.floor(v)) * tex.width + Math.min(tex.width - 1, Math.floor(u))) * 4;
      const shade = SHADE_MIN + (1 - SHADE_MIN) * cosC;
      const r = (tex.data[src] ?? 0) * shade;
      const g = (tex.data[src + 1] ?? 0) * shade;
      const b = (tex.data[src + 2] ?? 0) * shade;
      for (let dy = 0; dy < block && row + dy < px; dy++) {
        for (let dx = 0; dx < block && col + dx < px; dx++) {
          const dst = ((row + dy) * px + col + dx) * 4;
          out.data[dst] = r;
          out.data[dst + 1] = g;
          out.data[dst + 2] = b;
          out.data[dst + 3] = 255;
        }
      }
    }
  }
  ctx.putImageData(out, 0, 0);
}

/** Dibuja los marcadores visibles; el sitio va encima de los análogos. */
function renderMarkers(ctx: CanvasRenderingContext2D, px: number, markers: GlobeMarker[], view: View) {
  const radius = px / 2;
  const scale = px / 360;
  const r = MARKER_RADIUS * Math.max(1, scale);
  const ordered = [...markers].sort((a, b) => (a.kind === b.kind ? 0 : a.kind === "site" ? 1 : -1));
  const visible = ordered.flatMap((marker) => {
    const p = project(marker.lat, marker.lon, view);
    return p ? [{ marker, point: { x: radius + p.x * radius, y: radius - p.y * radius } }] : [];
  });
  const placed = spreadMarkers(
    visible.map((v) => v.point),
    2 * r + MARKER_GAP * scale,
  );
  const outline = tokenColor("--cc-bg", "#0b0f17");
  const siteColor = tokenColor("--cc-accent", "#4cc9f0");
  const analogColor = tokenColor("--cc-scale-mid", "#ffb566");
  ctx.lineWidth = Math.max(1.5, scale * 1.5);
  ctx.strokeStyle = outline;
  visible.forEach(({ point }, i) => {
    const at = placed[i]!;
    if (at.x === point.x && at.y === point.y) return;
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    ctx.lineTo(at.x, at.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(point.x, point.y, Math.max(2, r / 4), 0, 2 * Math.PI);
    ctx.fillStyle = outline;
    ctx.fill();
  });
  ctx.font = `bold ${Math.round(r * 1.1)}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  visible.forEach(({ marker }, i) => {
    const { x, y } = placed[i]!;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = marker.kind === "site" ? siteColor : analogColor;
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = outline;
    ctx.fillText(marker.badge, x, y + 0.5);
  });
}
