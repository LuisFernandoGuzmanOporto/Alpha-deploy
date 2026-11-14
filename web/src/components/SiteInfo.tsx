import { useContent, useT } from "../i18n";
import { formatValue } from "../lib/variables";
import { VARIABLE_IDS, type Site } from "../types";
import { TagList } from "./ui";

interface Props {
  site: Site;
}

export function SiteInfo({ site }: Props) {
  const t = useT();
  const { variables } = useContent();
  return (
    <section aria-label={t("siteinfo.aria", { name: site.name })}>
      <p className="ea-sitenote">
        {site.region} ·{" "}
        {site.lat === null || site.lon === null ? t("siteinfo.noCoords") : `${site.lat}°, ${site.lon}°`}
      </p>
      <ul className="ea-varchips">
        {VARIABLE_IDS.map((variable) => (
          <li className="ea-varchip" key={variable} title={site.sources[variable]}>
            <small>{variables[variable].label}</small>
            <strong>{formatValue(variable, site.variables[variable], t)}</strong>
          </li>
        ))}
      </ul>
      <TagList tags={site.tags} />
      {site.notes && <p className="ea-sitenote">{site.notes}</p>}
    </section>
  );
}
