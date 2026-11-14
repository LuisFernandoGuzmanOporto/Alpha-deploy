import { useContent, useT } from "../i18n";
import { formatValue } from "../lib/variables";
import { VARIABLE_IDS, type Site } from "../types";

interface Props {
  site: Site;
}

export function SiteInfo({ site }: Props) {
  const t = useT();
  const { tags, variables } = useContent();
  return (
    <section className="site-info" aria-label={t("siteinfo.aria", { name: site.name })}>
      <h2>{site.name}</h2>
      <p>
        {site.region} ·{" "}
        {site.lat === null || site.lon === null ? t("siteinfo.noCoords") : `${site.lat}°, ${site.lon}°`}
      </p>
      <ul>
        {VARIABLE_IDS.map((variable) => (
          <li key={variable} title={site.sources[variable]}>
            {variables[variable].label}: {formatValue(variable, site.variables[variable], t)}
          </li>
        ))}
      </ul>
      <p>
        {t("siteinfo.tags", {
          tags: site.tags.length > 0 ? site.tags.map((tag) => tags[tag].label).join(", ") : t("common.noData"),
        })}
      </p>
      {site.notes && (
        <p>
          <small>{site.notes}</small>
        </p>
      )}
    </section>
  );
}
