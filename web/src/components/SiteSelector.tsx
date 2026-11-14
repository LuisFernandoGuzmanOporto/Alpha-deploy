import type { CSSProperties } from "react";
import { useT } from "../i18n";
import type { Site } from "../types";
import { SiteCard } from "./ui";

interface Props {
  sites: Site[];
  value: string;
  onChange: (siteId: string) => void;
}

/** Elección del destino: una tarjeta por sitio (primero la Luna, luego Marte; cada tarjeta dice su cuerpo). */
export function SiteSelector({ sites, value, onChange }: Props) {
  const t = useT();
  const ordered = [...sites].sort((a, b) => Number(a.body === "mars") - Number(b.body === "mars"));
  return (
    <div className="ea-sites ea-stagger" role="group" aria-label={`${t("body.moon")} / ${t("body.mars")}`}>
      {ordered.map((site, index) => (
        <div key={site.id} style={{ "--i": index } as CSSProperties} className="ea-sites__item">
          <SiteCard site={site} selected={site.id === value} onSelect={onChange} />
        </div>
      ))}
    </div>
  );
}
