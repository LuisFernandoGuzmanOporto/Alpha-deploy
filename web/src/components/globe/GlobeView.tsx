import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useT, type MessageKey, type Translate } from "../../i18n";
import type { Candidate, Site } from "../../types";
import { Globe, type GlobeMarker } from "./Globe";
import { wrapLon, type View } from "./orthographic";
import earthTexture from "./textures/earth.jpg";
import marsTexture from "./textures/mars.jpg";
import moonTexture from "./textures/moon.jpg";
import "./globe.css";

type Body = "earth" | "moon" | "mars";

const BODIES: { id: Body; texture: string; creditKey: MessageKey }[] = [
  { id: "earth", texture: earthTexture, creditKey: "globe.creditEarth" },
  { id: "moon", texture: moonTexture, creditKey: "globe.creditMoon" },
  { id: "mars", texture: marsTexture, creditKey: "globe.creditMars" },
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
  const t = useT();
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
      <h3 id="globe-title">{t("globe.title")}</h3>
      <div role="tablist" aria-label={t("globe.tabs")} className="globe-tabs">
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
            {t(`body.${b.id}`)}
          </button>
        ))}
      </div>
      <div role="tabpanel" id="globe-panel" aria-labelledby={`globe-tab-${body}`}>
        <Globe
          texture={current.texture}
          markers={markers}
          initialView={initialView}
          label={t("globe.aria", { body: t(`body.${body}`), summary: markerSummary(t, markers.length) })}
          size={440}
        />
        <div className="globe-side">
          <MarkerList body={body} site={site} analogs={analogs} t={t} />
          <p className="globe-credit">{t("globe.credit", { credit: t(current.creditKey) })}</p>
        </div>
      </div>
    </section>
  );
}

function MarkerList({ body, site, analogs, t }: { body: Body; site: Site | null; analogs: Candidate[]; t: Translate }) {
  if (body === "earth") {
    if (analogs.length === 0) return <p>{t("globe.pickEarth")}</p>;
    return (
      <ol className="globe-list">
        {analogs.map((c) => (
          <li key={c.id}>
            {c.name} ({c.country}) {formatCoords(t, c.lat, c.lon)}
          </li>
        ))}
      </ol>
    );
  }
  if (!site) return <p>{t("globe.pickSite")}</p>;
  if (site.body !== body) {
    return <p>{t("globe.elsewhere", { site: site.name, body: t(site.body === "moon" ? "globe.onMoon" : "globe.onMars") })}</p>;
  }
  return (
    <p className="globe-list">
      <span className="globe-swatch" aria-hidden="true" /> {site.name} {formatCoords(t, site.lat, site.lon)}
    </p>
  );
}

function markerSummary(t: Translate, count: number): string {
  if (count === 0) return "";
  return count === 1 ? t("globe.summaryOne") : t("globe.summaryMany", { n: count });
}

function formatCoords(t: Translate, lat: number | null, lon: number | null): string {
  if (lat === null || lon === null) return t("globe.noCoords");
  const ns = lat >= 0 ? "N" : "S";
  const lonW = wrapLon(lon);
  const ew = lonW >= 0 ? "E" : t("globe.west");
  return `(${Math.abs(lat).toFixed(2)}° ${ns}, ${Math.abs(lonW).toFixed(2)}° ${ew})`;
}
