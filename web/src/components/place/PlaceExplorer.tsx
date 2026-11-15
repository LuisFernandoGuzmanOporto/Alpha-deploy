import { useEffect, useMemo, useState } from "react";
import { useT } from "../../i18n";
import { CATEGORIES, loadCommonsPhotos, placeCategory, type Photo, type PlaceCategory } from "../../lib/photos";
import type { RankingRow } from "../../lib/ranking";
import { scoreColor } from "../../lib/scoreColor";
import { CategoryArt } from "./CategoryArt";

/** Normaliza para buscar sin tildes ni mayúsculas ("ollague" encuentra "Ollagüe"). */
export function fold(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export interface ExplorerFilters {
  query: string;
  category: PlaceCategory | "all";
  country: string;
}

/** Filtra el ranking por texto (nombre o país), categoría y país, conservando el orden del ranking. */
export function filterPlaces(rows: RankingRow[], filters: ExplorerFilters): RankingRow[] {
  const query = fold(filters.query.trim());
  return rows.filter(({ candidate }) => {
    if (filters.category !== "all" && placeCategory(candidate.tags) !== filters.category) return false;
    if (filters.country && candidate.country !== filters.country) return false;
    if (!query) return true;
    return fold(candidate.name).includes(query) || fold(candidate.country).includes(query);
  });
}

interface Props {
  rows: RankingRow[];
  selectedId: string | null;
  onSelect: (candidateId: string) => void;
}

/** Panel de exploración: buscador, filtros por categoría y país, destacados y lista con miniaturas. */
export function PlaceExplorer({ rows, selectedId, onSelect }: Props) {
  const t = useT();
  const [filters, setFilters] = useState<ExplorerFilters>({ query: "", category: "all", country: "" });
  const [photos, setPhotos] = useState<Record<string, Photo[]>>({});

  useEffect(() => {
    let active = true;
    loadCommonsPhotos().then(
      (places) => active && setPhotos(places),
      () => undefined, // sin fotos: la lista muestra la ilustración de cada categoría
    );
    return () => {
      active = false;
    };
  }, []);

  const countries = useMemo(() => [...new Set(rows.map((row) => row.candidate.country))].sort((a, b) => a.localeCompare(b)), [rows]);
  const categories = useMemo(() => CATEGORIES.filter((c) => rows.some((row) => placeCategory(row.candidate.tags) === c)), [rows]);
  const results = useMemo(() => filterPlaces(rows, filters), [rows, filters]);
  const filtering = filters.query !== "" || filters.category !== "all" || filters.country !== "";
  const featured = filtering ? [] : rows.filter((row) => photos[row.candidate.id]?.length).slice(0, 3);

  return (
    <div className="explorer">
      <label className="explorer__search">
        <span className="visually-hidden">{t("explorer.search")}</span>
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          value={filters.query}
          placeholder={t("explorer.searchPlaceholder")}
          onChange={(event) => setFilters((f) => ({ ...f, query: event.target.value }))}
        />
      </label>

      <div className="explorer__chips" role="group" aria-label={t("explorer.category")}>
        {(["all", ...categories] as const).map((category) => (
          <button
            key={category}
            type="button"
            className="explorer__chip"
            aria-pressed={filters.category === category}
            onClick={() => setFilters((f) => ({ ...f, category }))}
          >
            {category === "all" ? t("explorer.all") : t(`category.${category}`)}
          </button>
        ))}
      </div>

      <label className="explorer__country">
        <span>{t("explorer.country")}</span>
        <select value={filters.country} onChange={(event) => setFilters((f) => ({ ...f, country: event.target.value }))}>
          <option value="">{t("explorer.allCountries")}</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </label>

      {featured.length > 0 && (
        <section aria-labelledby="explorer-featured">
          <h3 id="explorer-featured" className="cc-subhead">
            {t("explorer.featured")}
          </h3>
          <ul className="explorer__featured">
            {featured.map(({ candidate, entry }) => {
              const photo = photos[candidate.id]?.[0];
              return (
                <li key={candidate.id}>
                  <button type="button" className="explorer__feature tilt" onClick={() => onSelect(candidate.id)}>
                    {photo && <img src={photo.thumb} alt="" loading="lazy" decoding="async" />}
                    <span className="explorer__feature-text">
                      <strong>{candidate.name}</strong>
                      <small>
                        {candidate.country} · {entry.score.toFixed(0)}
                      </small>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <p className="cc-muted" aria-live="polite">
        {t(results.length === 1 ? "explorer.countOne" : "explorer.countMany", { n: results.length })}
      </p>
      {results.length === 0 ? (
        <p className="cc-empty">{t("explorer.none")}</p>
      ) : (
        <ul className="explorer__list">
          {results.map(({ candidate, entry }) => {
            const photo = photos[candidate.id]?.[0];
            const rank = rows.findIndex((row) => row.candidate.id === candidate.id) + 1;
            return (
              <li key={candidate.id}>
                <button
                  type="button"
                  className={`explorer__item${candidate.id === selectedId ? " is-selected" : ""}`}
                  onClick={() => onSelect(candidate.id)}
                >
                  <span className="explorer__thumb">
                    {photo ? (
                      <img src={photo.thumb} alt="" loading="lazy" decoding="async" />
                    ) : (
                      <CategoryArt category={placeCategory(candidate.tags)} />
                    )}
                    <span className="explorer__rank" style={{ background: scoreColor(entry.score) }}>
                      {rank}
                    </span>
                  </span>
                  <span className="explorer__text">
                    <strong>{candidate.name}</strong>
                    <small>
                      {candidate.country} · {t(`category.${placeCategory(candidate.tags)}`)}
                    </small>
                  </span>
                  <span className="explorer__score">{entry.score.toFixed(0)}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
