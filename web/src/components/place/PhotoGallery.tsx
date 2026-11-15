import * as RadixDialog from "@radix-ui/react-dialog";
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { useT } from "../../i18n";
import type { Photo, PhotoSource } from "../../lib/photos";

const SWIPE_PX = 40;

/** Deslizar con el dedo o el mouse: devuelve los manejadores y llama a `onSwipe(±1)`. */
function useSwipe(onSwipe: (step: 1 | -1) => void) {
  const start = useRef<number | null>(null);
  return {
    onPointerDown: (event: PointerEvent) => {
      start.current = event.clientX;
    },
    onPointerUp: (event: PointerEvent) => {
      if (start.current === null) return;
      const dx = event.clientX - start.current;
      start.current = null;
      if (Math.abs(dx) >= SWIPE_PX) onSwipe(dx < 0 ? 1 : -1);
    },
    onPointerCancel: () => {
      start.current = null;
    },
  };
}

/** Atribución obligatoria de cada foto: autor, licencia y fuente, con enlace. */
export function PhotoCredit({ photo, source }: { photo: Photo; source: PhotoSource }) {
  const t = useT();
  return (
    <p className="photo-credit">
      <span>{t("photos.by", { author: photo.author })}</span>
      {photo.license && (
        <>
          {" · "}
          {photo.license_url ? (
            <a href={photo.license_url} target="_blank" rel="noreferrer">
              {photo.license}
            </a>
          ) : (
            <span>{photo.license}</span>
          )}
        </>
      )}
      {" · "}
      <a href={photo.page} target="_blank" rel="noreferrer">
        {t(source === "google" ? "photos.sourceGoogle" : "photos.sourceCommons")}
      </a>
    </p>
  );
}

interface GalleryProps {
  photos: Photo[];
  source: PhotoSource;
  placeName: string;
}

/** Galería de la tarjeta: foto principal con flechas, gesto de deslizar, miniaturas y ampliación. */
export function PhotoGallery({ photos: all, source, placeName }: GalleryProps) {
  const t = useT();
  const [broken, setBroken] = useState<ReadonlySet<string>>(new Set());
  const photos = all.filter((photo) => !broken.has(photo.thumb));
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState<ReadonlySet<string>>(new Set());
  const [zoomed, setZoomed] = useState(false);
  const zoomButton = useRef<HTMLButtonElement>(null);

  useEffect(() => setIndex(0), [all]);
  useEffect(() => {
    if (index >= photos.length && photos.length > 0) setIndex(photos.length - 1);
  }, [index, photos.length]);

  const go = (step: number) => setIndex((i) => (photos.length ? (i + step + photos.length) % photos.length : 0));
  const swipe = useSwipe(go);
  const current = photos[index];
  if (!current) return null;

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") go(1);
    else if (event.key === "ArrowLeft") go(-1);
    else return;
    event.preventDefault();
  };

  const markBroken = (photo: Photo) => setBroken((prev) => new Set(prev).add(photo.thumb));

  return (
    <div className="gallery" role="group" aria-roledescription={t("photos.gallery")} aria-label={t("photos.galleryOf", { name: placeName })}>
      <div className="gallery__stage" tabIndex={0} onKeyDown={onKeyDown} {...swipe}>
        {!loaded.has(current.thumb) && <span className="gallery__placeholder" aria-hidden="true" />}
        <img
          key={current.thumb}
          className={`gallery__img${loaded.has(current.thumb) ? " is-loaded" : ""}`}
          src={current.thumb}
          alt={t("photos.alt", { name: placeName, title: current.title })}
          width={current.width}
          height={current.height}
          decoding="async"
          draggable={false}
          onLoad={() => setLoaded((prev) => new Set(prev).add(current.thumb))}
          onError={() => markBroken(current)}
        />
        <span className="gallery__count" aria-live="polite">
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <rect x="3" y="6" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="13" r="3.5" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M8 6l1.5-2h5L16 6" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
          {t("photos.count", { n: index + 1, total: photos.length })}
        </span>
        <button ref={zoomButton} type="button" className="gallery__zoom" onClick={() => setZoomed(true)} aria-label={t("photos.expand")}>
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        {photos.length > 1 && (
          <>
            <button type="button" className="gallery__nav gallery__nav--prev" onClick={() => go(-1)} aria-label={t("photos.prev")}>
              ‹
            </button>
            <button type="button" className="gallery__nav gallery__nav--next" onClick={() => go(1)} aria-label={t("photos.next")}>
              ›
            </button>
          </>
        )}
      </div>
      {photos.length > 1 && (
        <ul className="gallery__thumbs">
          {photos.map((photo, i) => (
            <li key={photo.thumb}>
              <button
                type="button"
                className={i === index ? "is-active" : undefined}
                aria-current={i === index}
                aria-label={t("photos.show", { n: i + 1 })}
                onClick={() => setIndex(i)}
              >
                <img src={photo.thumb} alt="" loading="lazy" decoding="async" onError={() => markBroken(photo)} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <PhotoCredit photo={current} source={source} />
      <Lightbox
        open={zoomed}
        onOpenChange={setZoomed}
        onClosed={() => zoomButton.current?.focus()}
        photos={photos} index={index} onIndex={setIndex} source={source} placeName={placeName} />
    </div>
  );
}

interface LightboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Al cerrar, el foco vuelve al botón que abrió la foto ampliada. */
  onClosed: () => void;
  photos: Photo[];
  index: number;
  onIndex: (index: number) => void;
  source: PhotoSource;
  placeName: string;
}

/** Foto ampliada a pantalla completa: flechas, teclado, deslizar y Esc para cerrar. */
function Lightbox({ open, onOpenChange, onClosed, photos, index, onIndex, source, placeName }: LightboxProps) {
  const t = useT();
  const [ready, setReady] = useState(false);
  const go = (step: number) => onIndex((index + step + photos.length) % photos.length);
  const swipe = useSwipe(go);
  const photo = photos[index];
  useEffect(() => setReady(false), [photo?.large]);
  if (!photo) return null;
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="lightbox__overlay" />
        <RadixDialog.Content
          className="lightbox"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            onClosed();
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") go(1);
            if (event.key === "ArrowLeft") go(-1);
          }}
        >
          <RadixDialog.Title className="lightbox__title">
            {placeName} <span>{t("photos.count", { n: index + 1, total: photos.length })}</span>
          </RadixDialog.Title>
          <RadixDialog.Description className="visually-hidden">{t("photos.lightboxHelp")}</RadixDialog.Description>
          <div className="lightbox__stage" {...swipe}>
            {/* Mientras llega la versión grande se muestra la miniatura, ya en caché. */}
            <img className="lightbox__img lightbox__img--low" src={photo.thumb} alt="" aria-hidden="true" draggable={false} />
            <img
              key={photo.large}
              className={`lightbox__img${ready ? " is-loaded" : ""}`}
              src={photo.large}
              alt={t("photos.alt", { name: placeName, title: photo.title })}
              decoding="async"
              draggable={false}
              onLoad={() => setReady(true)}
            />
            {photos.length > 1 && (
              <>
                <button type="button" className="gallery__nav gallery__nav--prev" onClick={() => go(-1)} aria-label={t("photos.prev")}>
                  ‹
                </button>
                <button type="button" className="gallery__nav gallery__nav--next" onClick={() => go(1)} aria-label={t("photos.next")}>
                  ›
                </button>
              </>
            )}
          </div>
          <PhotoCredit photo={photo} source={source} />
          <RadixDialog.Close className="lightbox__close" aria-label={t("dialog.close")}>
            ×
          </RadixDialog.Close>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
