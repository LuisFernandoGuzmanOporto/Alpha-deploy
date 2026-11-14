import { useContent } from "../../i18n";

// Marcador de posición: se reemplaza por KnownBadge de web/src/components/ui/ (Noe) con las mismas props.
interface Props {
  known: boolean;
}

export function KnownBadge({ known }: Props) {
  const { ui } = useContent();
  return <span className={known ? "badge badge-known" : "badge badge-new"}>{known ? ui.known : ui.new}</span>;
}
