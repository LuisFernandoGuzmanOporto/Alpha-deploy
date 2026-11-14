import { useContent, useT } from "../i18n";
import { formatValue } from "../lib/variables";
import { VARIABLE_IDS, type Site } from "../types";
import { TagList } from "./ui";

interface Props {
  site: Site;
}

/** Telemetría del sitio: coordenadas y las cinco variables, en tipografía monoespaciada. */
export function SiteInfo({ site }: Props) {
  const t = useT();
  const { variables } = useContent();
  return (
    <section aria-label={t("siteinfo.aria", { name: site.name })}>
      <dl className="cc-readout">
        <div>
          <dt>LAT · LON</dt>
          <dd>{site.lat === null || site.lon === null ? t("siteinfo.noCoords") : `${site.lat}° · ${site.lon}°`}</dd>
        </div>
        {VARIABLE_IDS.map((variable) => (
          <div key={variable} title={site.sources[variable]}>
            <dt>{variables[variable].label}</dt>
            <dd>{formatValue(variable, site.variables[variable], t)}</dd>
          </div>
        ))}
      </dl>
      <TagList tags={site.tags} />
      {site.notes && <p className="cc-note">{site.notes}</p>}
    </section>
  );
}
