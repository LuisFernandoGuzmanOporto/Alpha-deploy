import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Layout } from "./components/ui";
import { Loading } from "./components/ui/extra";
import { useT } from "./i18n";
import { Discoveries } from "./routes/Discoveries";
import { Home } from "./routes/Home";

// Estas pantallas traen librerías pesadas (recharts, react-markdown): se cargan aparte.
const Compare = lazy(() => import("./routes/Compare").then((m) => ({ default: m.Compare })));
const Methodology = lazy(() => import("./routes/Methodology").then((m) => ({ default: m.Methodology })));

export function App() {
  const t = useT();
  const location = useLocation();
  return (
    <Layout>
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          {/* La clave por ruta reinicia la animación de entrada en cada pantalla. */}
          <div key={location.pathname}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/comparar/:siteId/:candidateId" element={<Compare />} />
              <Route path="/descubrimientos" element={<Discoveries />} />
              <Route path="/metodologia" element={<Methodology />} />
              <Route path="*" element={<p className="ea-empty">{t("app.notFound")}</p>} />
            </Routes>
          </div>
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
}
