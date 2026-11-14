import { useContent } from "../../i18n";

// Marcador de posición: se reemplaza por LimitationsPanel de web/src/components/ui/ (Noe).
// El texto viene de web/src/content/ (es.ts y en.ts) según el idioma.
export function LimitationsPanel() {
  const { ui } = useContent();
  return (
    <aside className="limitations" aria-label={ui.limitationsTitle}>
      <h2>{ui.limitationsTitle}</h2>
      <p>{ui.limitationsIntro}</p>
      <ul>
        {ui.limitations.map((item) => (
          <li key={item.title}>
            <strong>{item.title}:</strong> {item.text}
          </li>
        ))}
      </ul>
    </aside>
  );
}
