import { NavLink, Route, Routes } from "react-router-dom";
import { Compare } from "./routes/Compare";
import { Home } from "./routes/Home";
import { Methodology } from "./routes/Methodology";

export function App() {
  return (
    <>
      <header>
        <NavLink to="/">Earth Analogs</NavLink> <NavLink to="/metodologia">Metodología</NavLink>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/comparar/:siteId/:candidateId" element={<Compare />} />
          <Route path="/metodologia" element={<Methodology />} />
          <Route path="*" element={<p>Página no encontrada.</p>} />
        </Routes>
      </main>
    </>
  );
}
