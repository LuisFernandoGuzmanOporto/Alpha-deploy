import { useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Button, Card, KnownBadge, Layout, LimitationsPanel, ScoreBadge, Tabs, Tag, TagList, VariableBar } from "./index";
import { es } from "../../content/es";
import { TAGS } from "../../types";
import "../../styles/preview.css";

function Preview() {
  const [tab, setTab] = useState("explorar");
  const [filter, setFilter] = useState(false);
  return <Layout><p className="ea-eyebrow">Sistema visual · Noe · Vista de diseño</p><h1>{es.title}</h1><p>{es.intro}</p><p className="ea-preview-note">Vista previa de componentes. Los ejemplos no representan resultados científicos ni una captura de producción.</p><Tabs label="Pantallas de diseño" value={tab} onChange={setTab} items={[
    { id: "explorar", label: "Explorador", content: <><div className="ea-preview-controls"><label>Destino<select><option>Luna</option><option>Marte</option></select></label><label><input type="checkbox" checked={filter} onChange={event => setFilter(event.target.checked)}/> Solo Bolivia</label><Button variant="secondary" onClick={() => setFilter(false)}>Limpiar filtros</Button></div><div className="ea-preview-grid"><Card><span className="ea-eyebrow">01 / Explorar</span><h2>Un laboratorio en nuestro planeta</h2><p>El mapa de Fernando mostrará los candidatos con datos disponibles. La lista ofrecerá una alternativa accesible al mapa.</p><div className="ea-preview-orbit" aria-hidden="true"><span>TIERRA</span></div></Card><Card><span className="ea-eyebrow">Ranking</span><h2>{filter ? "Candidatos de Bolivia" : "Análogos terrestres"}</h2><p>{es.states.empty}</p><ScoreBadge score={null}/><p><KnownBadge known/><span> </span><KnownBadge known={false}/></p><Tag>Bolivia</Tag></Card></div></> },
    { id: "comparar", label: "Comparador", content: <Card><span className="ea-eyebrow">02 / Comparar</span><h2>Una comparación con contexto</h2><div className="ea-preview-grid">{["Destino de exploración", "Candidato terrestre"].map(title => <section key={title}><h3>{title}</h3><VariableBar variable="slope_deg" value={null} min={0} max={30}/><VariableBar variable="temp_mean_c" value={null} min={-200} max={100}/><VariableBar variable="albedo" value={null} min={0} max={1}/></section>)}</div><p>Las escalas de esta vista son ilustrativas. Los valores se muestran ausentes hasta recibir datos.</p></Card> },
    { id: "ficha", label: "Ficha", content: <Card><span className="ea-eyebrow">03 / Caracterizar</span><h2>La ficha de cada lugar</h2><p>Resumen, procesos, usos para exploración y fuentes verificables de Lian.</p><h3>Dónde falla la analogía</h3><p>Este bloque debe mostrar las limitaciones específicas documentadas del candidato.</p><h3>Vocabulario de características</h3><TagList tags={TAGS}/></Card> },
    { id: "metodo", label: "Metodología", content: <article className="methodology"><span className="ea-eyebrow">04 / Entender</span><h2>{es.methodology.title}</h2><p>{es.methodology.intro}</p><h3>El índice</h3><p>{es.methodology.formula}</p><h3>Datos ausentes</h3><p>{es.methodology.missing}</p><h3>Coincidencias cualitativas</h3><p>{es.methodology.tags}</p><blockquote>{es.methodology.caution}</blockquote></article> },
  ]}/><LimitationsPanel/></Layout>;
}

const root = document.getElementById("root");
if (root) createRoot(root).render(<BrowserRouter><Preview/></BrowserRouter>);
