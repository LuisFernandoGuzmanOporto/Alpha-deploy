import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useLang, useT } from "../i18n";
import methodology from "../../../docs/METODOLOGIA.md?raw";

export function Methodology() {
  const { lang } = useLang();
  const t = useT();
  return (
    <article className="methodology">
      {lang === "en" && <p lang="en">{t("methodology.notice")}</p>}
      <div lang="es">
        <Markdown remarkPlugins={[remarkGfm]}>{methodology}</Markdown>
      </div>
    </article>
  );
}
