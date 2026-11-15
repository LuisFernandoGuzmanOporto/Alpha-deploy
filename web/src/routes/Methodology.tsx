import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useLang } from "../i18n";
import methodology from "../../../docs/METODOLOGIA.md?raw";
import methodologyEn from "../content/methodology.en.md?raw";

export function Methodology() {
  const { lang } = useLang();
  return (
    <article className="methodology" lang={lang}>
      <div>
        <Markdown remarkPlugins={[remarkGfm]}>{lang === "en" ? methodologyEn : methodology}</Markdown>
      </div>
    </article>
  );
}
