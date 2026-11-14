import type { Site, SiteBody } from "../types";

const BODY_LABELS: Record<SiteBody, string> = { moon: "Luna", mars: "Marte" };

interface Props {
  sites: Site[];
  value: string;
  onChange: (siteId: string) => void;
}

export function SiteSelector({ sites, value, onChange }: Props) {
  return (
    <label>
      Sitio de la Luna o Marte{" "}
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {(Object.keys(BODY_LABELS) as SiteBody[]).map((body) => {
          const group = sites.filter((site) => site.body === body);
          if (group.length === 0) return null;
          return (
            <optgroup key={body} label={BODY_LABELS[body]}>
              {group.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </optgroup>
          );
        })}
      </select>
    </label>
  );
}
