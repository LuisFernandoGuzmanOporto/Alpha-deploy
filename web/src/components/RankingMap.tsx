import { useEffect, useRef, useState } from "react";
import { LngLatBounds, Map as MapLibreMap, Marker, setWorkerUrl } from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import "maplibre-gl/dist/maplibre-gl.css";
import { useT } from "../i18n";
import { loadCommonsPhotos } from "../lib/photos";
import type { RankingRow } from "../lib/ranking";
import { SCORE_GRADIENT, scoreColor } from "../lib/scoreColor";

// Vite empaqueta el worker aparte; sin esto MapLibre no lo encuentra en dev ni en producción.
setWorkerUrl(workerUrl);

/** Puestos con número dentro del marcador; el resto se ve como un punto. */
const NUMBERED = 9;

interface Props {
  rows: RankingRow[];
  selectedId: string | null;
  onSelect: (candidateId: string) => void;
}

/** Tamaño del marcador según el puntaje: los más parecidos se ven más grandes. */
function pinSize(score: number): number {
  return Math.round(18 + Math.max(0, Math.min(1, (score - 40) / 45)) * 18);
}

/** Elemento del marcador. Es decorativo para el lector de pantalla: la lista de resultados tiene lo mismo. */
function createPin(row: RankingRow, rank: number, onSelect: (id: string) => void): HTMLDivElement {
  const { candidate, entry } = row;
  const el = document.createElement("div");
  el.className = `map-pin${rank <= 3 ? " map-pin--top" : ""}`;
  el.setAttribute("aria-hidden", "true");
  el.dataset.id = candidate.id;
  el.style.setProperty("--pin-color", scoreColor(entry.score));
  el.style.setProperty("--pin-size", `${pinSize(entry.score)}px`);
  el.style.setProperty("--pin-delay", `${Math.min(rank, 30) * 18}ms`);

  const halo = document.createElement("span");
  halo.className = "map-pin__halo";
  const dot = document.createElement("span");
  dot.className = "map-pin__dot";
  if (rank <= NUMBERED) dot.textContent = String(rank);

  // Previsualización al pasar el cursor: miniatura (solo de Commons, sin coste), nombre, país y puntaje.
  const preview = document.createElement("span");
  preview.className = "map-pin__preview";
  const thumb = document.createElement("span");
  thumb.className = "map-pin__thumb";
  const text = document.createElement("span");
  text.className = "map-pin__text";
  const name = document.createElement("strong");
  name.textContent = candidate.name; // textContent: el nombre nunca se interpreta como HTML
  const meta = document.createElement("small");
  meta.textContent = `${candidate.country} · ${entry.score.toFixed(1)}`;
  text.append(name, meta);
  preview.append(thumb, text);
  el.append(halo, dot, preview);

  let requested = false;
  el.addEventListener("pointerenter", () => {
    if (requested) return;
    requested = true;
    thumb.classList.add("is-loading");
    loadCommonsPhotos()
      .then((places) => {
        const photo = places[candidate.id]?.[0];
        if (!photo) {
          thumb.classList.add("is-empty");
          return;
        }
        const img = document.createElement("img");
        img.alt = "";
        img.decoding = "async";
        img.addEventListener("load", () => thumb.classList.add("is-loaded"), { once: true });
        img.addEventListener("error", () => thumb.classList.add("is-empty"), { once: true });
        img.src = photo.thumb;
        thumb.append(img);
      })
      .catch(() => thumb.classList.add("is-empty"))
      .finally(() => thumb.classList.remove("is-loading"));
  });
  el.addEventListener("click", (event) => {
    event.stopPropagation();
    onSelect(candidate.id);
  });
  return el;
}

/** Color de fondo del mapa, leído de tokens.css. */
function waterColor(): string {
  return getComputedStyle(document.documentElement).getPropertyValue("--cc-map-water").trim() || "#0f2240";
}

/** Con "reducir movimiento" el mapa salta al destino sin animar el recorrido. */
function moveDuration(ms: number): number {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : ms;
}

/** Margen para que los puntos no queden tapados por el selector (izquierda) y el panel (derecha). */
function overlayPadding(map: MapLibreMap) {
  const wide = map.getContainer().clientWidth > 1100;
  return wide ? { top: 80, bottom: 80, left: 400, right: 540 } : { top: 40, bottom: 40, left: 40, right: 40 };
}

export function RankingMap({ rows, selectedId, onSelect }: Props) {
  const t = useT();
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLOutputElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const onSelectRef = useRef(onSelect);
  const rowsRef = useRef(rows);
  rowsRef.current = rows;
  const markersRef = useRef<Marker[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    if (!containerRef.current) return;
    const map = new MapLibreMap({
      container: containerRef.current,
      center: [0, 20],
      zoom: 1,
      // En pantallas estrechas el mapa va entre bloques: un dedo desplaza la página y dos mueven el mapa.
      cooperativeGestures: window.matchMedia("(max-width: 1100px)").matches,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            maxzoom: 19,
            attribution: "© OpenStreetMap contributors",
          },
        },
        layers: [
          // Fondo azul noche (token --cc-map-water) bajo las teselas en gris: tiñe el mapa sin competir con los puntos.
          { id: "water", type: "background", paint: { "background-color": waterColor() } },
          { id: "osm", type: "raster", source: "osm", paint: { "raster-saturation": -1, "raster-brightness-max": 0.5, "raster-contrast": 0.1, "raster-opacity": 0.42 } },
        ],
      },
    });
    mapRef.current = map;

    map.on("load", () => {
      map.on("mousemove", (event) => {
        if (!cursorRef.current) return;
        const lon = ((((event.lngLat.lng + 180) % 360) + 360) % 360) - 180;
        cursorRef.current.textContent = `LAT ${event.lngLat.lat.toFixed(2)} · LON ${lon.toFixed(2)}`;
      });
      setReady(true);
    });

    return () => {
      for (const marker of markersRef.current) marker.remove();
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
      setReady(false);
    };
  }, []);

  // Marcadores: se crean de nuevo cuando cambia el ranking (son pocos) y el mapa encuadra a todos.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    for (const marker of markersRef.current) marker.remove();
    const located = rows.filter((row) => row.candidate.lat !== null && row.candidate.lon !== null);
    // Los peores primero: los mejores quedan encima cuando se superponen.
    markersRef.current = located
      .map((row) => ({ row, rank: rows.indexOf(row) + 1 }))
      .reverse()
      .map(({ row, rank }) =>
        new Marker({ element: createPin(row, rank, (id) => onSelectRef.current(id)), anchor: "center" })
          .setLngLat([row.candidate.lon as number, row.candidate.lat as number])
          .addTo(map),
      );
    if (located.length > 0) {
      const bounds = new LngLatBounds();
      for (const { candidate } of located) bounds.extend([candidate.lon as number, candidate.lat as number]);
      map.fitBounds(bounds, { padding: overlayPadding(map), maxZoom: 6, duration: moveDuration(600) });
    }
  }, [rows, ready]);

  // Selección: el elegido resalta y late; los demás se atenúan; el mapa vuela hasta él.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    for (const marker of markersRef.current) {
      const el = marker.getElement();
      const isSelected = el.dataset.id === selectedId;
      el.classList.toggle("is-selected", isSelected);
      el.classList.toggle("is-dimmed", Boolean(selectedId) && !isSelected);
      el.style.zIndex = isSelected ? "5" : "";
    }
    const target = rowsRef.current.find((row) => row.candidate.id === selectedId)?.candidate;
    if (target && target.lat !== null && target.lon !== null) {
      map.easeTo({ center: [target.lon, target.lat], zoom: Math.max(map.getZoom(), 4), padding: overlayPadding(map), duration: moveDuration(700) });
    }
  }, [selectedId, ready, rows]);

  return (
    <div className="cc-map">
      <div ref={containerRef} className="cc-map__canvas" role="region" aria-label={t("map.aria")} aria-describedby="cc-map-desc" />
      <p id="cc-map-desc" className="visually-hidden">
        {rows[0] ? t("map.desc", { n: rows.length, best: rows[0].candidate.name }) : t("map.descEmpty")}
      </p>
      <output ref={cursorRef} className="cc-hud cc-hud--cursor" aria-hidden="true">
        LAT — · LON —
      </output>
      <div className="cc-legend" aria-hidden="true">
        <span className="cc-label">{t("map.legend")}</span>
        <span className="cc-legend__bar" style={{ background: SCORE_GRADIENT }} />
        <span className="cc-legend__labels">
          <span>{t("map.legendLow")}</span>
          <span>{t("map.legendHigh")}</span>
        </span>
      </div>
    </div>
  );
}
