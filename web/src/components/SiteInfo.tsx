import { VARIABLE_INFO, formatValue } from "../lib/variables";
import { VARIABLE_IDS, type Site } from "../types";

interface Props {
  site: Site;
}

export function SiteInfo({ site }: Props) {
  return (
    <section className="site-info" aria-label={`Datos de ${site.name}`}>
      <h2>{site.name}</h2>
      <p>
        {site.region} ·{" "}
        {site.lat === null || site.lon === null ? "coordenadas sin dato" : `${site.lat}°, ${site.lon}°`}
      </p>
      <ul>
        {VARIABLE_IDS.map((variable) => (
          <li key={variable} title={site.sources[variable]}>
            {VARIABLE_INFO[variable].label}: {formatValue(variable, site.variables[variable])}
          </li>
        ))}
      </ul>
      <p>Etiquetas: {site.tags.length > 0 ? site.tags.join(", ") : "sin dato"}</p>
      {site.notes && (
        <p>
          <small>{site.notes}</small>
        </p>
      )}
    </section>
  );
}
