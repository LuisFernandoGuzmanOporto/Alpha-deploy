import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import methodology from "../../../docs/METODOLOGIA.md?raw";

export function Methodology() {
  return (
    <article className="methodology">
      <Markdown remarkPlugins={[remarkGfm]}>{methodology}</Markdown>
    </article>
  );
}
