// Pasada de QA con clics y teclas reales (CDP). Uso: node --experimental-websocket docs/qa/qa.mjs http://localhost:4173  (CHROME=<ruta> si Chrome no esta en la ruta de siempre)
import { spawn } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const base = process.argv[2] ?? "http://localhost:4173";
const PORT = 9336;
const chrome = spawn(process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", [
  "--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), "ea-qa-"))}`,
  "--hide-scrollbars", "--no-first-run", "about:blank",
], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let wsUrl;
for (let i = 0; i < 40 && !wsUrl; i++) {
  try { wsUrl = (await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()).find((p) => p.type === "page")?.webSocketDebuggerUrl; } catch { await sleep(250); }
}
const ws = new WebSocket(wsUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let n = 0;
const pending = new Map();
const consoleErrors = [];
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result ?? m.error); pending.delete(m.id); }
  if (m.method === "Runtime.exceptionThrown") consoleErrors.push(m.params.exceptionDetails.text + " " + (m.params.exceptionDetails.exception?.description ?? ""));
  if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error") consoleErrors.push(m.params.args.map((a) => a.value ?? a.description).join(" "));
});
const send = (method, params = {}) => new Promise((ok) => { const id = ++n; pending.set(id, ok); ws.send(JSON.stringify({ id, method, params })); });
const ev = async (expression) => {
  const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text + " " + (r.exceptionDetails.exception?.description ?? ""));
  return r.result?.value;
};
const results = [];
const check = (name, ok, detail = "") => { results.push({ name, ok: !!ok, detail }); console.log(ok ? "OK   " : "FALLA", name, detail); };
const go = async (path, w = 1440, h = 900) => {
  await send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile: w < 700 });
  await send("Page.navigate", { url: `${base}${path}` });
  await sleep(3200);
};
const find = (sel, re) => `[...document.querySelectorAll(${JSON.stringify(sel)})].find((e) => ${re}.test(e.textContent))`;
async function click(expr) {
  const p = await ev(`(() => { const el = ${expr}; if (!el) return null; el.scrollIntoView({ block: "center" }); const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; })()`);
  if (!p) throw new Error("no se encontró: " + expr.slice(0, 80));
  await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: p.x, y: p.y });
  await send("Input.dispatchMouseEvent", { type: "mousePressed", x: p.x, y: p.y, button: "left", clickCount: 1 });
  await send("Input.dispatchMouseEvent", { type: "mouseReleased", x: p.x, y: p.y, button: "left", clickCount: 1 });
  await sleep(700);
}
const KEYS = { Escape: 27, ArrowRight: 39, Tab: 9, Enter: 13 };
async function key(k) {
  const base = { key: k, code: k, windowsVirtualKeyCode: KEYS[k] };
  await send("Input.dispatchKeyEvent", { type: "keyDown", ...base });
  await send("Input.dispatchKeyEvent", { type: "keyUp", ...base });
  await sleep(500);
}
const url = () => ev("location.pathname + location.search");
const text = () => ev("document.body.innerText");

await send("Runtime.enable");
await send("Page.enable");
try {
  // 1. Inicio
  await go("/?lang=en");
  const t1 = await text();
  check("Inicio en inglés carga con título y ranking", /Explore Earth analogs/.test(t1) && /Best analogs/.test(t1));

  // 2. Elegir Marte con un clic real
  await click(find("[role=radio]", "/^\\s*Mars\\s*$/"));
  check("Marte: la URL guarda el sitio", /sitio=mars-/.test(await url()), await url());
  check("Marte: el ranking cambia (Atacama primero)", /Hyper-arid core of the Atacama/.test((await ev(`document.querySelector("ol li")?.textContent ?? ""`))), await ev(`(document.querySelector("ol li")?.textContent ?? "").slice(0, 40)`));

  // 3. Selector de sitio
  await click(find("button", "/^Moon or Mars site/"));
  await click(find("[role=option], [role=menuitem], li button, button", "/Crater Gale/"));
  check("Selector de sitio: Crater Gale", /sitio=mars-gale/.test(await url()), await url());

  // 4. Elegir un análogo y comparar
  await click(`document.querySelector("ol li button")`);
  check("Elegir análogo: la URL guarda analogo", /analogo=/.test(await url()), await url());
  const href = await ev(`[...document.querySelectorAll("a")].find((a) => /comparar/.test(a.getAttribute("href") ?? ""))?.getAttribute("href")`);
  check("Hay enlace a la comparación con el sitio correcto", /\/comparar\/mars-gale\//.test(href ?? ""), href);
  await click(`[...document.querySelectorAll("a")].find((a) => /comparar/.test(a.getAttribute("href") ?? ""))`);
  await sleep(2500);
  const t5 = await text();
  check("Comparación: tabla, perfil, qué falla y ficha", /Variable by variable/.test(t5) && /Similarity profile/.test(t5) && /Where the analogy breaks down/.test(t5) && /Fact sheet/.test(t5));
  check("Comparación: radar y 5 filas de variables", (await ev(`!!document.querySelector(".recharts-radar") && document.querySelectorAll("table tbody tr").length === 5`)));
  await click(find("a", "/Back to ranking/"));
  check("Volver al ranking", (await url()).startsWith("/?"), await url());

  // 5. Filtros y pesos
  await go("/?lang=en&sitio=mars-jezero");
  await click(find("button", "/^\\s*Filters/"));
  check("Filtros: abre el diálogo", await ev(`!!document.querySelector("[role=dialog]")`));
  await click(`document.querySelector("[role=dialog] [role=switch]")`);
  check("Filtro Bolivia: URL y 10 resultados", /bolivia=1/.test(await url()) && /\(10\)|10 ranked/.test(await text()), await url());
  await click(`document.querySelector("[role=dialog] [role=slider]")`);
  await key("ArrowRight");
  check("Pesos: el teclado cambia el peso y la URL lo guarda", /pesos=/.test(await url()), await url());
  await click(find("[role=dialog] button", "/reset/i"));
  check("Pesos: restablecer limpia la URL", !/pesos=/.test(await url()), await url());
  await key("Escape");
  check("Esc cierra el diálogo y devuelve el foco a Filters", (await ev(`!document.querySelector("[role=dialog]")`)) && /Filters/.test(await ev(`document.activeElement?.textContent ?? ""`)), await ev(`document.activeElement?.textContent.slice(0, 30)`));

  // 6. Globo con teclado y clic
  await go("/?lang=en&sitio=moon-malapert-massif");
  await click(`document.querySelector(".ea-fold summary")`);
  await sleep(3500);
  check("Globo: se carga al abrir con 3 pestañas", (await ev(`!!document.querySelector(".globe-canvas") && document.querySelectorAll(".globe-tabs [role=tab]").length === 3`)));

  // 7. Cambio de idioma
  await go("/?lang=en");
  await click(find("button", "/English/"));
  await click(find("[role=option]", "/Español/"));
  await sleep(800);
  check("Selector de idioma: pasa a español", /Explora/.test(await text()) && (await ev("document.documentElement.lang")) === "es", await ev("document.documentElement.lang"));

  // 8. Rutas
  await go("/descubrimientos?lang=en");
  check("Descubrimientos: 6 sitios en la matriz", (await ev(`document.querySelectorAll(".cc-matrix tbody tr, table tbody tr").length`)) === 6, String(await ev(`document.querySelectorAll("table tbody tr").length`)));
  await go("/metodologia?lang=en");
  check("Metodología en inglés", /Methodology of the similarity index/.test(await text()));
  await go("/metodologia?lang=es");
  check("Metodología en español", /Metodología del índice de similitud/.test(await text()));
  await go("/no-existe?lang=en");
  check("Ruta inexistente", /not found/i.test(await text()));
  await go("/comparar/x/y?lang=en");
  check("Comparación inexistente", /doesn't exist|not exist/i.test(await text()), (await text()).slice(0, 60).replace(/\n/g, " "));

  // 9. Español sin restos en inglés / inglés sin restos de español
  const spanish = /\b(Propuesto|catalogo|precipitaci[oó]n|Polo sur|Marte\b|análogo|Núcleo|Egipto|Estados Unidos)\b/;
  for (const route of ["/?lang=en&sitio=mars-jezero", "/comparar/mars-jezero/earth-gilf-kebir?lang=en", "/descubrimientos?lang=en", "/metodologia?lang=en"]) {
    await go(route);
    check(`Sin español en ${route}`, !spanish.test(await ev("document.querySelector('main')?.innerText ?? document.body.innerText")));
  }

  // 10. Teclado: enlace "saltar al contenido"
  await go("/?lang=en");
  await key("Tab");
  check("Tab: primer foco es el enlace para saltar al contenido", /skip/i.test(await ev(`document.activeElement?.textContent ?? ""`)), await ev(`document.activeElement?.textContent.slice(0, 30)`));
  await key("Enter");
  check("Enter en el enlace lleva el foco al contenido", /main|ea-main/.test(await ev(`document.activeElement?.id ?? document.activeElement?.tagName`)), await ev(`document.activeElement?.id || document.activeElement?.tagName`));

  // 11. Móvil: sin desborde horizontal
  for (const route of ["/?lang=en", "/?lang=en&sitio=mars-jezero&analogo=earth-gilf-kebir", "/comparar/mars-jezero/earth-gilf-kebir?lang=en", "/descubrimientos?lang=en", "/metodologia?lang=en"]) {
    await go(route, 375, 812);
    const w = await ev(`({ s: document.documentElement.scrollWidth, i: innerWidth })`);
    check(`Móvil 375 px sin desborde: ${route.slice(0, 48)}`, w.s <= 375, `${w.s} de 375`);
  }
  await go("/?lang=en", 768, 1024);
  const t = await ev(`({ s: document.documentElement.scrollWidth, i: innerWidth })`);
  check("Tableta 768 px sin desborde", t.s <= t.i, `${t.s}/${t.i}`);

  // 12. Consola
  check("Consola sin errores durante toda la pasada", consoleErrors.length === 0, consoleErrors.slice(0, 3).join(" | "));
} catch (error) {
  check("La pasada terminó sin excepciones", false, String(error));
} finally {
  console.log(`\n${results.filter((r) => r.ok).length} de ${results.length} OK`);
  ws.close();
  chrome.kill();
}
