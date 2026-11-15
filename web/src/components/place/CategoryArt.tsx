import type { PlaceCategory } from "../../lib/photos";

// Ilustraciones vectoriales por categoría de lugar. Se usan cuando no hay foto verificada y siempre
// van rotuladas como ilustración: nunca se presentan como una foto del lugar.

const SKY: Record<PlaceCategory, [string, string]> = {
  desert: ["#3b2416", "#c2763a"],
  salt: ["#1b2c45", "#9fc2dd"],
  volcanic: ["#1a1218", "#7a2e22"],
  cave: ["#0b0f17", "#2a2230"],
  ice: ["#0e2035", "#8fc7e8"],
  crater: ["#151a24", "#5d6576"],
  terrain: ["#141c28", "#566a7c"],
};

function Scene({ category }: { category: PlaceCategory }) {
  switch (category) {
    case "desert":
      return (
        <>
          <circle cx="250" cy="70" r="26" fill="#ffd59a" opacity="0.85" />
          <path d="M0 150 Q80 110 160 140 T320 130 V200 H0Z" fill="#a85a2a" />
          <path d="M0 170 Q100 135 200 165 T320 160 V200 H0Z" fill="#7a3d1c" />
        </>
      );
    case "salt":
      return (
        <>
          <path d="M0 120 L60 95 L110 112 L170 84 L230 108 L320 92 V130 H0Z" fill="#3e5872" />
          <rect y="128" width="320" height="72" fill="#e8f1f8" />
          <path d="M20 150 l40 10 l30 -12 M120 170 l50 -8 l40 14 M220 145 l45 12 l35 -9" stroke="#b9cfe0" strokeWidth="2" fill="none" />
        </>
      );
    case "volcanic":
      return (
        <>
          <path d="M40 200 L150 70 L170 70 L280 200Z" fill="#3a2422" />
          <path d="M150 70 L160 60 L170 70 L165 90 L155 90Z" fill="#ff6a00" opacity="0.8" />
          <path d="M0 180 Q160 160 320 185 V200 H0Z" fill="#20161a" />
        </>
      );
    case "cave":
      return (
        <>
          <path d="M0 0 H320 V200 H0Z" fill="#1c1820" />
          <ellipse cx="160" cy="150" rx="120" ry="80" fill="#0b0f17" />
          <ellipse cx="160" cy="160" rx="70" ry="38" fill="#3a3040" opacity="0.6" />
        </>
      );
    case "ice":
      return (
        <>
          <path d="M0 130 L50 80 L90 110 L140 60 L200 115 L250 75 L320 120 V200 H0Z" fill="#dcecf6" />
          <path d="M140 60 L160 82 L150 80 L132 70Z M250 75 L268 92 L246 88Z" fill="#ffffff" />
          <rect y="160" width="320" height="40" fill="#bcd8ea" />
        </>
      );
    case "crater":
      return (
        <>
          <rect y="110" width="320" height="90" fill="#3f4656" />
          <ellipse cx="160" cy="150" rx="110" ry="30" fill="#2a2f3b" />
          <ellipse cx="160" cy="146" rx="96" ry="22" fill="#222733" />
        </>
      );
    default:
      return (
        <>
          <path d="M0 140 L70 100 L130 125 L200 85 L320 130 V200 H0Z" fill="#3a4a5c" />
          <path d="M0 170 Q120 140 320 168 V200 H0Z" fill="#26313f" />
        </>
      );
  }
}

/** Ilustración de la categoría (decorativa: el rótulo de texto acompaña siempre). */
export function CategoryArt({ category, className = "" }: { category: PlaceCategory; className?: string }) {
  const [top, bottom] = SKY[category];
  const id = `sky-${category}`;
  return (
    <svg className={`category-art ${className}`} viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={bottom} />
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill={`url(#${id})`} />
      <Scene category={category} />
    </svg>
  );
}
