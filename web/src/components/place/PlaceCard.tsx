import { m } from "motion/react";
import { Link } from "react-router-dom";
import { useContent, useT } from "../../i18n";
import { placeCategory, usePlacePhotos } from "../../lib/photos";
import { scoreColor } from "../../lib/scoreColor";
import type { Candidate } from "../../types";
import { KnownBadge } from "../ui";
import { CategoryArt } from "./CategoryArt";
import { PhotoGallery } from "./PhotoGallery";

export interface PlaceCardProps {
  candidate: Candidate;
  rank?: number;
  score?: number;
  /** Enlace a la comparación con el sitio elegido. */
  compareTo?: { siteId: string; siteName: string };
  onClose?: () => void;
  /** "float": tarjeta sobre el mapa (hoja inferior en móvil); "inline": dentro de otro panel. */
  variant?: "float" | "inline";
}

/** Tarjeta fotográfica de un lugar: galería real (o ilustración rotulada), datos y acciones. */
export function PlaceCard({ candidate, rank, score, compareTo, onClose, variant = "float" }: PlaceCardProps) {
  const t = useT();
  const { tags } = useContent();
  const state = usePlacePhotos(candidate);
  const category = placeCategory(candidate.tags);

  return (
    <m.article
      className={`place-card place-card--${variant}`}
      aria-label={t("photos.cardOf", { name: candidate.name })}
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <div className="place-card__media">
        {state.status === "loading" && (
          <div className="place-card__loading" role="status">
            <span className="gallery__placeholder" aria-hidden="true" />
            <span className="place-card__status">{t("photos.loading")}</span>
          </div>
        )}
        {state.status === "ready" && <PhotoGallery photos={state.photos} source={state.source} placeName={candidate.name} />}
        {state.status === "empty" && (
          <figure className="place-card__art">
            <CategoryArt category={category} />
            <figcaption>
              <strong>{t("photos.illustration", { category: t(`category.${category}`) })}</strong>
              <span>{t(`photos.empty.${state.reason}`)}</span>
            </figcaption>
          </figure>
        )}
        {onClose && (
          <button type="button" className="place-card__close" onClick={onClose} aria-label={t("dialog.close")}>
            ×
          </button>
        )}
      </div>

      <div className="place-card__body">
        <header className="place-card__head">
          {rank !== undefined && (
            <span className="place-card__rank" style={score !== undefined ? { background: scoreColor(score) } : undefined}>
              {rank}
            </span>
          )}
          <div className="place-card__title">
            <h3>{candidate.name}</h3>
            <p>
              {candidate.country} <KnownBadge known={candidate.known} />
            </p>
          </div>
          {score !== undefined && (
            <span className="place-card__score">
              <strong>{score.toFixed(1)}</strong>
              <small>/100</small>
            </span>
          )}
        </header>
        <ul className="place-card__chips" aria-label={t("ui.tagsAria")}>
          <li className="place-card__chip place-card__chip--cat">{t(`category.${category}`)}</li>
          {candidate.tags.slice(0, 3).map((tag) => (
            <li key={tag} className="place-card__chip">
              {tags[tag].label}
            </li>
          ))}
        </ul>
        <p className="place-card__why">{candidate.why}</p>
        <footer className="place-card__foot">
          <span className="cc-mono place-card__coords">
            {candidate.lat === null || candidate.lon === null
              ? t("siteinfo.noCoords")
              : `${Math.abs(candidate.lat).toFixed(2)}° ${candidate.lat >= 0 ? "N" : "S"} · ${Math.abs(candidate.lon).toFixed(2)}° ${candidate.lon >= 0 ? "E" : t("globe.west")}`}
          </span>
          {compareTo && (
            <Link className="btn btn--primary btn--sm" to={`/comparar/${compareTo.siteId}/${candidate.id}`}>
              {t("photos.explore", { site: compareTo.siteName })} →
            </Link>
          )}
        </footer>
      </div>
    </m.article>
  );
}
