import { lazy, Suspense } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LANGS, useLang, useT } from "./i18n";
import { Discoveries } from "./routes/Discoveries";
import { Home } from "./routes/Home";

// Estas pantallas traen librerías pesadas (recharts, react-markdown): se cargan aparte.
const Compare = lazy(() => import("./routes/Compare").then((m) => ({ default: m.Compare })));
const Methodology = lazy(() => import("./routes/Methodology").then((m) => ({ default: m.Methodology })));

function LanguageSelect() {
  const { lang, setLang } = useLang();
  const t = useT();
  return (
    <label className="lang-select">
      <span className="visually-hidden">{t("lang.label")}</span>
      <select value={lang} onChange={(event) => setLang(event.target.value === "en" ? "en" : "es")}>
        {LANGS.map((code) => (
          <option key={code} value={code} lang={code}>
            {t(`lang.${code}`)}
          </option>
        ))}
      </select>
    </label>
  );
}

export function App() {
  const t = useT();
  return (
    <>
      <header className="app-header">
        <nav>
          <NavLink to="/">{t("app.brand")}</NavLink> <NavLink to="/descubrimientos">{t("app.discoveries")}</NavLink>{" "}
          <NavLink to="/metodologia">{t("app.methodology")}</NavLink>
        </nav>
        <LanguageSelect />
      </header>
      <main>
        <ErrorBoundary>
          <Suspense fallback={<p>{t("app.loading")}</p>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/comparar/:siteId/:candidateId" element={<Compare />} />
              <Route path="/descubrimientos" element={<Discoveries />} />
              <Route path="/metodologia" element={<Methodology />} />
              <Route path="*" element={<p>{t("app.notFound")}</p>} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
    </>
  );
}
