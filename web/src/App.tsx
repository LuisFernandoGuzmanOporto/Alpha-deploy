import { AnimatePresence, LazyMotion, MotionConfig, m, useReducedMotion } from "motion/react";
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
// Las funciones de animación (unos 100 KB) llegan después del primer pintado; hasta entonces todo se muestra sin animar.
const loadMotionFeatures = () => import("./lib/motionFeatures").then((module) => module.default);

export function App() {
  const t = useT();
  const location = useLocation();
  // Con "reducir movimiento" la pantalla entra sin desplazamiento, ni siquiera en el primer cuadro.
  const reduceMotion = useReducedMotion();
  return (
    // reducedMotion="user": con "reducir movimiento" activado se apagan las animaciones de transformación y de layout.
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadMotionFeatures} strict>
        <Layout>
          <ErrorBoundary>
            <Suspense fallback={<Loading />}>
              <AnimatePresence mode="wait" initial={false}>
                <m.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  <Routes location={location}>
                    <Route path="/" element={<Home />} />
                    <Route path="/comparar/:siteId/:candidateId" element={<Compare />} />
                    <Route path="/descubrimientos" element={<Discoveries />} />
                    <Route path="/metodologia" element={<Methodology />} />
                    <Route path="*" element={<p className="cc-empty">{t("app.notFound")}</p>} />
                  </Routes>
                </m.div>
              </AnimatePresence>
            </Suspense>
          </ErrorBoundary>
        </Layout>
      </LazyMotion>
    </MotionConfig>
  );
}
