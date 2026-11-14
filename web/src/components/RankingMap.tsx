import { useEffect, useRef, useState } from "react";
import { LngLatBounds, Map as MapLibreMap, Popup, setWorkerUrl, type ExpressionSpecification, type GeoJSONSource } from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import type { Feature, FeatureCollection, Point } from "geojson";
import "maplibre-gl/dist/maplibre-gl.css";
import { useT } from "../i18n";
import type { RankingRow } from "../lib/ranking";
import { SCORE_GRADIENT, SCORE_STOPS } from "../lib/scoreColor";

// Vite empaqueta el worker aparte; sin esto MapLibre no lo encuentra en dev ni en producción.
setWorkerUrl(workerUrl);

const SOURCE_ID = "candidates";
const POINTS_LAYER = "candidate-points";
const SELECTED_LAYER = "candidate-selected";

interface Props {
  rows: RankingRow[];
  selectedId: string | null;
  onSelect: (candidateId: string) => void;
}

function toGeoJson(rows: RankingRow[]): FeatureCollection<Point> {
  const features: Feature<Point>[] = [];
  for (const { entry, candidate } of rows) {
    if (candidate.lat === null || candidate.lon === null) continue;
    features.push({
      type: "Feature",
      geometry: { type: "Point", coordinates: [candidate.lon, candidate.lat] },
      properties: { id: candidate.id, name: candidate.name, score: entry.score },
    });
  }
  return { type: "FeatureCollection", features };
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
      map.addSource(SOURCE_ID, { type: "geojson", data: toGeoJson([]) });
      map.addLayer({
        id: POINTS_LAYER,
        type: "circle",
        source: SOURCE_ID,
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["get", "score"], 20, 5, 85, 14],
          "circle-color": ["interpolate", ["linear"], ["get", "score"], ...SCORE_STOPS.flatMap(([score, color]) => [score, color])],
          "circle-stroke-color": "#0b0f17",
          "circle-stroke-width": 1.5,
          "circle-opacity": 0.95,
        },
      });
      map.addLayer({
        id: SELECTED_LAYER,
        type: "circle",
        source: SOURCE_ID,
        filter: ["==", ["get", "id"], ""],
        paint: {
          "circle-radius": 22,
          "circle-color": "rgba(0,0,0,0)",
          "circle-stroke-color": "#4cc9f0",
          "circle-stroke-width": 3,
        },
      });
      map.on("click", POINTS_LAYER, (event) => {
        const id = event.features?.[0]?.properties?.id;
        if (typeof id === "string") onSelectRef.current(id);
      });
      const tooltip = new Popup({ closeButton: false, closeOnClick: false, offset: 12 });
      map.on("mouseenter", POINTS_LAYER, (event) => {
        map.getCanvas().style.cursor = "pointer";
        const feature = event.features?.[0];
        if (feature?.geometry.type !== "Point") return;
        const { name, score } = feature.properties;
        const [lon, lat] = feature.geometry.coordinates;
        if (lon === undefined || lat === undefined) return;
        // setText evita interpretar el nombre como HTML.
        tooltip.setLngLat([lon, lat]).setText(`${String(name)}: ${Number(score).toFixed(1)}`).addTo(map);
      });
      map.on("mouseleave", POINTS_LAYER, () => {
        map.getCanvas().style.cursor = "";
        tooltip.remove();
      });
      map.on("mousemove", (event) => {
        if (!cursorRef.current) return;
        const lon = ((((event.lngLat.lng + 180) % 360) + 360) % 360) - 180;
        cursorRef.current.textContent = `LAT ${event.lngLat.lat.toFixed(2)} · LON ${lon.toFixed(2)}`;
      });
      setReady(true);
    });

    return () => {
      map.remove();
      mapRef.current = null;
      setReady(false);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const data = toGeoJson(rows);
    (map.getSource(SOURCE_ID) as GeoJSONSource).setData(data);
    if (data.features.length > 0) {
      const bounds = new LngLatBounds();
      for (const feature of data.features) bounds.extend(feature.geometry.coordinates as [number, number]);
      map.fitBounds(bounds, { padding: overlayPadding(map), maxZoom: 6, duration: moveDuration(600) });
    }
  }, [rows, ready]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    map.setFilter(SELECTED_LAYER, ["==", ["get", "id"], selectedId ?? ""]);
    // El elegido resalta; los demás se atenúan para que se vea a cuál corresponde el resultado.
    const isSelected: ExpressionSpecification = ["==", ["get", "id"], selectedId ?? ""];
    map.setPaintProperty(POINTS_LAYER, "circle-opacity", selectedId ? ["case", isSelected, 1, 0.22] : 0.95);
    map.setPaintProperty(POINTS_LAYER, "circle-stroke-opacity", selectedId ? ["case", isSelected, 1, 0.3] : 1);
    const target = rowsRef.current.find((row) => row.candidate.id === selectedId)?.candidate;
    if (target && target.lat !== null && target.lon !== null) {
      map.easeTo({ center: [target.lon, target.lat], zoom: Math.max(map.getZoom(), 4), padding: overlayPadding(map), duration: moveDuration(700) });
    }
  }, [selectedId, ready]);

  // El marcador elegido late para que se vea dónde está; sin animación si el usuario la desactivó.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return undefined;
    if (!selectedId || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      map.setPaintProperty(SELECTED_LAYER, "circle-radius", 22);
      map.setPaintProperty(SELECTED_LAYER, "circle-stroke-opacity", 1);
      return undefined;
    }
    let frame = 0;
    const tick = (now: number) => {
      const wave = (Math.sin(now / 320) + 1) / 2;
      map.setPaintProperty(SELECTED_LAYER, "circle-radius", 20 + wave * 6);
      map.setPaintProperty(SELECTED_LAYER, "circle-stroke-opacity", 1 - wave * 0.55);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [selectedId, ready]);

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
