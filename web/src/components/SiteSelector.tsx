import { useT } from "../i18n";
import type { Site, SiteBody } from "../types";

const BODIES: SiteBody[] = ["moon", "mars"];

interface Props {
  sites: Site[];
  value: string;
  onChange: (siteId: string) => void;
}

export function SiteSelector({ sites, value, onChange }: Props) {
  const t = useT();
  return (
    <label>
      {t("selector.label")}{" "}
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {BODIES.map((body) => {
          const group = sites.filter((site) => site.body === body);
          if (group.length === 0) return null;
          return (
            <optgroup key={body} label={t(`body.${body}`)}>
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
