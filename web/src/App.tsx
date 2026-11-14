import { NavLink, Route, Routes } from "react-router-dom";
import { Compare } from "./routes/Compare";
import { Discoveries } from "./routes/Discoveries";
import { Home } from "./routes/Home";
import { Methodology } from "./routes/Methodology";

export function App() {
  return (
    <>
      <header>
        <NavLink to="/">Earth Analogs</NavLink> <NavLink to="/descubrimientos">Descubrimientos</NavLink>{" "}
        <NavLink to="/metodologia">Metodología</NavLink>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/comparar/:siteId/:candidateId" element={<Compare />} />
          <Route path="/descubrimientos" element={<Discoveries />} />
          <Route path="/metodologia" element={<Methodology />} />
          <Route path="*" element={<p>Página no encontrada.</p>} />
        </Routes>
      </main>
    </>
  );
}
