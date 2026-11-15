import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useLang, useT, type MessageKey } from "../i18n";
import methodologyEn from "../../../docs/METODOLOGIA.en.md?raw";
import methodologyEs from "../../../docs/METODOLOGIA.md?raw";

const STEPS: { title: MessageKey; text: MessageKey; icon: string }[] = [
  { title: "flow.s1", text: "flow.s1d", icon: "M4 18l5-7 4 4 3-5 4 8z" },
  { title: "flow.s2", text: "flow.s2d", icon: "M4 19V5m0 14h16M8 15v-4m4 4V8m4 7v-6" },
  { title: "flow.s3", text: "flow.s3d", icon: "M7 5v14m10-14v14M3 9l4-4 4 4m2 6l4 4 4-4" },
  { title: "flow.s4", text: "flow.s4d", icon: "M12 4v16M5 8h14M5 8l-2 6h4zm14 0l-2 6h4zM8 20h8" },
  { title: "flow.s5", text: "flow.s5d", icon: "M5 16a7 7 0 1 1 14 0M12 16l4-6" },
];

export function Methodology() {
  const { lang } = useLang();
  const t = useT();
  return (
    <article className="methodology">
      <section className="flow" aria-labelledby="flow-title">
        <h2 id="flow-title" className="flow__title">
          {t("flow.title")}
        </h2>
        <ol className="flow__steps">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flow__step" style={{ animationDelay: `${index * 90}ms` }}>
              <span className="flow__num" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <svg className="flow__icon" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
                <path d={step.icon} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <strong>{t(step.title)}</strong>
              <span>{t(step.text)}</span>
            </li>
          ))}
        </ol>
        <p className="flow__formula" aria-hidden="true">
          <span>score</span> = 100 × (1 − <span>Σ wᵢ·|Δᵢ|</span> / <span>Σ wᵢ</span>)
        </p>
      </section>
      <div lang={lang}>
        <Markdown remarkPlugins={[remarkGfm]}>{lang === "en" ? methodologyEn : methodologyEs}</Markdown>
      </div>
    </article>
  );
}
