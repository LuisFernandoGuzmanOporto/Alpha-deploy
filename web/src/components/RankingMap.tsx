import { useEffect, useRef, useState } from "react";
import { LngLatBounds, Map as MapLibreMap, Popup, setWorkerUrl, type GeoJSONSource } from "maplibre-gl";
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

export function RankingMap({ rows, selectedId, onSelect }: Props) {
  const t = useT();
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLOutputElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const onSelectRef = useRef(onSelect);
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
        layers: [{ id: "osm", type: "raster", source: "osm", paint: { "raster-saturation": -1, "raster-brightness-max": 0.42, "raster-contrast": 0.12 } }],
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
          "circle-stroke-color": "#0f1113",
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
          "circle-stroke-color": "#f3ede4",
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
      map.fitBounds(bounds, { padding: 60, maxZoom: 6, duration: 600 });
    }
  }, [rows, ready]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    map.setFilter(SELECTED_LAYER, ["==", ["get", "id"], selectedId ?? ""]);
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
      <div ref={containerRef} className="cc-map__canvas" role="region" aria-label={t("map.aria")} />
      <span className="cc-hud cc-hud--title">{t("map.title")}</span>
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
