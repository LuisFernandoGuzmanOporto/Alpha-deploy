import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { Candidate, Site } from "../../types";
import { Globe, type GlobeMarker } from "./Globe";
import { wrapLon, type View } from "./orthographic";
import earthTexture from "./textures/earth.jpg";
import marsTexture from "./textures/mars.jpg";
import moonTexture from "./textures/moon.jpg";
import "./globe.css";

type Body = "earth" | "moon" | "mars";

const BODIES: { id: Body; label: string; texture: string; credit: string }[] = [
  { id: "earth", label: "Tierra", texture: earthTexture, credit: "NASA Blue Marble Next Generation, vía NASA GIBS" },
  { id: "moon", label: "Luna", texture: moonTexture, credit: "Mosaico global LRO WAC (NASA/GSFC/ASU), vía Moon Trek" },
  { id: "mars", label: "Marte", texture: marsTexture, credit: "Mosaico color Viking MDIM 2.1 (NASA/USGS), vía Mars Trek" },
];

const ORIGIN: View = { lat: 0, lon: 0 };

export interface GlobeViewProps {
  /** Sitio elegido; se marca en el globo de su cuerpo. */
  site: Site | null;
  /** Mejores análogos en orden de ranking (normalmente los 5 primeros); se marcan en la Tierra. */
  analogs: Candidate[];
}

/** F6: globo 3D con pestañas Tierra, Luna y Marte, el sitio elegido y sus mejores análogos. */
export function GlobeView({ site, analogs }: GlobeViewProps) {
  const [body, setBody] = useState<Body>(site?.body ?? "earth");
  const tabRefs = useRef<Partial<Record<Body, HTMLButtonElement | null>>>({});

  useEffect(() => {
    if (site) setBody(site.body);
  }, [site]);

  const siteMarker: GlobeMarker | null =
    site && site.lat !== null && site.lon !== null
      ? { id: site.id, lat: site.lat, lon: wrapLon(site.lon), badge: "", kind: "site" }
      : null;
  const analogMarkers: GlobeMarker[] = analogs.flatMap((c, i) =>
    c.lat !== null && c.lon !== null
      ? [{ id: c.id, lat: c.lat, lon: wrapLon(c.lon), badge: String(i + 1), kind: "analog" as const }]
      : [],
  );
  const markers = body === "earth" ? analogMarkers : siteMarker && site?.body === body ? [siteMarker] : [];
  const first = markers[0];
  const initialView: View = first ? { lat: first.lat, lon: first.lon } : ORIGIN;
  const current = BODIES.find((b) => b.id === body) ?? BODIES[0]!;

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const index = BODIES.findIndex((b) => b.id === body);
    const next = BODIES[(index + step + BODIES.length) % BODIES.length]!.id;
    setBody(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section className="globe-view" aria-labelledby="globe-title">
      <h2 id="globe-title">Globo</h2>
      <div role="tablist" aria-label="Cuerpo" className="globe-tabs">
        {BODIES.map((b) => (
          <button
            key={b.id}
            ref={(el) => {
              tabRefs.current[b.id] = el;
            }}
            type="button"
            role="tab"
            id={`globe-tab-${b.id}`}
            aria-selected={body === b.id}
            aria-controls="globe-panel"
            tabIndex={body === b.id ? 0 : -1}
            onClick={() => setBody(b.id)}
            onKeyDown={onTabKeyDown}
          >
            {b.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id="globe-panel" aria-labelledby={`globe-tab-${body}`}>
        <Globe
          texture={current.texture}
          markers={markers}
          initialView={initialView}
          label={`Globo de ${current.label}${markerSummary(markers.length)}`}
        />
        <MarkerList body={body} site={site} analogs={analogs} />
        <p className="globe-credit">Textura: {current.credit}.</p>
      </div>
    </section>
  );
}

function MarkerList({ body, site, analogs }: { body: Body; site: Site | null; analogs: Candidate[] }) {
  if (body === "earth") {
    if (analogs.length === 0) return <p>Elige un sitio para ver sus mejores análogos en la Tierra.</p>;
    return (
      <ol className="globe-list">
        {analogs.map((c) => (
          <li key={c.id}>
            {c.name} ({c.country}) {formatCoords(c.lat, c.lon)}
          </li>
        ))}
      </ol>
    );
  }
  if (!site) return <p>Elige un sitio para marcarlo en el globo.</p>;
  if (site.body !== body) {
    return <p>El sitio elegido, {site.name}, está en {site.body === "moon" ? "la Luna" : "Marte"}.</p>;
  }
  return (
    <p className="globe-list">
      <span className="globe-swatch" aria-hidden="true" /> {site.name} {formatCoords(site.lat, site.lon)}
    </p>
  );
}

function markerSummary(count: number): string {
  if (count === 0) return "";
  return count === 1 ? " con 1 marcador" : ` con ${count} marcadores`;
}

function formatCoords(lat: number | null, lon: number | null): string {
  if (lat === null || lon === null) return "(sin coordenadas)";
  const ns = lat >= 0 ? "N" : "S";
  const lonW = wrapLon(lon);
  const ew = lonW >= 0 ? "E" : "O";
  return `(${Math.abs(lat).toFixed(2)}° ${ns}, ${Math.abs(lonW).toFixed(2)}° ${ew})`;
}
