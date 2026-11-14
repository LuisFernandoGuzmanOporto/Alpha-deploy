import { lazy, Suspense } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Compare } from "./routes/Compare";
import { Discoveries } from "./routes/Discoveries";
import { Home } from "./routes/Home";

// react-markdown solo hace falta en esta pantalla: se carga aparte.
const Methodology = lazy(() => import("./routes/Methodology").then((m) => ({ default: m.Methodology })));

export function App() {
  return (
    <>
      <header>
        <NavLink to="/">Earth Analogs</NavLink> <NavLink to="/descubrimientos">Descubrimientos</NavLink>{" "}
        <NavLink to="/metodologia">Metodología</NavLink>
      </header>
      <main>
        <ErrorBoundary>
          <Suspense fallback={<p>Cargando…</p>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/comparar/:siteId/:candidateId" element={<Compare />} />
              <Route path="/descubrimientos" element={<Discoveries />} />
              <Route path="/metodologia" element={<Methodology />} />
              <Route path="*" element={<p>Página no encontrada.</p>} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
    </>
  );
}
