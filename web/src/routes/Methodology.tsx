import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useLang } from "../i18n";
import methodologyEn from "../../../docs/METODOLOGIA.en.md?raw";
import methodologyEs from "../../../docs/METODOLOGIA.md?raw";

export function Methodology() {
  const { lang } = useLang();
  return (
    <article className="methodology">
      <div lang={lang}>
        <Markdown remarkPlugins={[remarkGfm]}>{lang === "en" ? methodologyEn : methodologyEs}</Markdown>
      </div>
    </article>
  );
}
