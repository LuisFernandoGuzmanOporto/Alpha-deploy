// Revisión automática de accesibilidad por CDP (sin dependencias). Uso: node --experimental-websocket docs/qa/a11y.mjs http://localhost:4173  (CHROME=<ruta> si Chrome no está en la ruta de siempre)
// Comprueba por ruta e idioma: lang, título, un solo h1, saltos de encabezados, landmarks, nombres accesibles, alt, ids repetidos,
// foco visible al recorrer con Tab, tamaño de los objetivos táctiles, contraste de texto y reflujo a 320 px. No sustituye a un lector de pantalla.
import { spawn } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const base = process.argv[2] ?? "http://localhost:4173";
const PORT = 9338;
const chrome = spawn(process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", [
  "--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), "ea-a11y-"))}`,
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
ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result ?? m.error); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise((ok) => { const id = ++n; pending.set(id, ok); ws.send(JSON.stringify({ id, method, params })); });
const ev = async (expression) => {
  const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text + " " + (r.exceptionDetails.exception?.description ?? ""));
  return r.result?.value;
};
const KEYS = { Tab: 9 };
async function tab() {
  const k = { key: "Tab", code: "Tab", windowsVirtualKeyCode: KEYS.Tab };
  await send("Input.dispatchKeyEvent", { type: "keyDown", ...k });
  await send("Input.dispatchKeyEvent", { type: "keyUp", ...k });
  await sleep(60);
}

const ROUTES = [
  ["/?lang=es", "Inicio (es)"],
  ["/?lang=en&sitio=mars-jezero&analogo=earth-atacama-nucleo-hiperarido", "Inicio con análogo (en)"],
  ["/comparar/mars-jezero/earth-atacama-nucleo-hiperarido?lang=es", "Comparación (es)"],
  ["/comparar/moon-malapert-massif/earth-valles-secos-mcmurdo?lang=en", "Comparación (en)"],
  ["/descubrimientos?lang=es", "Descubrimientos (es)"],
  ["/metodologia?lang=en", "Metodología (en)"],
];

const PAGE_CHECKS = `(() => {
  const out = [];
  const add = (rule, detail) => out.push({ rule, detail });
  const lang = document.documentElement.lang;
  if (!lang) add("lang", "falta <html lang>");
  if (!document.title || document.title.trim().length < 3) add("title", "sin título");
  const h1 = [...document.querySelectorAll("h1")].filter((e) => e.offsetParent !== null);
  if (h1.length !== 1) add("h1", "h1 visibles: " + h1.length);
  let prev = 0;
  for (const h of document.querySelectorAll("h1,h2,h3,h4,h5,h6")) {
    if (h.offsetParent === null) continue;
    const level = +h.tagName[1];
    if (prev && level > prev + 1) add("heading-skip", "h" + prev + " → h" + level + ": " + h.textContent.trim().slice(0, 50));
    prev = level;
  }
  for (const [sel, name] of [["main, [role=main]", "main"], ["nav, [role=navigation]", "nav"], ["footer, [role=contentinfo]", "footer"], ["header, [role=banner]", "header"]]) {
    if (!document.querySelector(sel)) add("landmark", "falta " + name);
  }
  const nameOf = (el) => (el.getAttribute("aria-label") || el.getAttribute("title") || (el.getAttribute("aria-labelledby") ? el.getAttribute("aria-labelledby").split(" ").map((id) => document.getElementById(id)?.textContent ?? "").join(" ") : "") || el.textContent || (el.labels ? [...el.labels].map((l) => l.textContent).join(" ") : "") || el.querySelector("img[alt]")?.alt || "").trim();
  for (const el of document.querySelectorAll("button, a[href], input, select, textarea, [role=button], [role=tab], [role=switch], [role=slider], [role=combobox], [role=checkbox]")) {
    if (el.offsetParent === null && getComputedStyle(el).position !== "fixed") continue;
    if (el.type === "hidden") continue;
    if (!nameOf(el)) add("name", "sin nombre accesible: " + el.outerHTML.slice(0, 110));
  }
  for (const img of document.querySelectorAll("img")) if (!img.hasAttribute("alt")) add("img-alt", "img sin alt: " + (img.src || "").slice(-50));
  for (const svg of document.querySelectorAll("svg[role=img]")) if (!nameOf(svg)) add("svg-name", "svg role=img sin nombre");
  const ids = new Map();
  for (const el of document.querySelectorAll("[id]")) ids.set(el.id, (ids.get(el.id) ?? 0) + 1);
  for (const [id, count] of ids) if (count > 1) add("dup-id", id + " ×" + count);
  for (const el of document.querySelectorAll("[aria-hidden=true]")) {
    if (el.matches("a,button,input,select,textarea,[tabindex]:not([tabindex='-1'])") || el.querySelector("a[href],button,input,select,textarea,[tabindex]:not([tabindex='-1'])")) add("aria-hidden-focusable", el.outerHTML.slice(0, 100));
  }
  for (const el of document.querySelectorAll("[aria-labelledby],[aria-describedby]")) {
    for (const attr of ["aria-labelledby", "aria-describedby"]) {
      for (const id of (el.getAttribute(attr) ?? "").split(" ").filter(Boolean)) if (!document.getElementById(id)) add("aria-ref", attr + " apunta a #" + id + " inexistente");
    }
  }
  return out;
})()`;

const TARGETS = `(() => {
  const out = [];
  for (const el of document.querySelectorAll("button, a[href], input:not([type=hidden]), select, [role=button], [role=tab], [role=switch], [role=slider]")) {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    if (r.width === 0 || r.height === 0 || cs.visibility === "hidden") continue;
    // WCAG 2.2 (2.5.8): 24 × 24 px; los enlaces dentro de un párrafo están exentos.
    const inline = el.tagName === "A" && cs.display === "inline";
    if (!inline && (r.width < 24 || r.height < 24)) out.push(Math.round(r.width) + "×" + Math.round(r.height) + " " + (el.getAttribute("aria-label") || el.textContent || el.tagName).trim().slice(0, 40));
  }
  return out;
})()`;

const CONTRAST = `(() => {
  const parse = (c) => { const m = c.match(/rgba?\\(([^)]+)\\)/); if (!m) return null; const p = m[1].split(",").map((x) => parseFloat(x)); return { r: p[0], g: p[1], b: p[2], a: p[3] ?? 1 }; };
  const lum = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const blend = (top, bottom) => ({ r: top.r * top.a + bottom.r * (1 - top.a), g: top.g * top.a + bottom.g * (1 - top.a), b: top.b * top.a + bottom.b * (1 - top.a), a: 1 });
  const bgOf = (el) => {
    const layers = [];
    for (let e = el; e; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.backgroundImage !== "none") return null; // degradados e imágenes: no se mide
      const c = parse(cs.backgroundColor);
      if (c && c.a > 0) { layers.push(c); if (c.a >= 0.99) break; }
    }
    let acc = { r: 255, g: 255, b: 255, a: 1 };
    if (!layers.length || layers[layers.length - 1].a < 0.99) acc = { r: 255, g: 255, b: 255, a: 1 };
    for (let i = layers.length - 1; i >= 0; i--) acc = blend(layers[i], acc);
    return acc;
  };
  const out = []; let measured = 0; let skipped = 0;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const el = node.parentElement;
    if (!el || seen.has(el) || !node.textContent.trim()) continue;
    seen.add(el);
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0 || cs.visibility === "hidden" || cs.opacity === "0" || el.closest("canvas,.maplibregl-map,svg")) { skipped++; continue; }
    const fg = parse(cs.color); const bg = bgOf(el);
    if (!fg || !bg) { skipped++; continue; }
    const text = blend(fg, bg);
    const l1 = lum(text); const l2 = lum(bg);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    const size = parseFloat(cs.fontSize); const bold = parseInt(cs.fontWeight, 10) >= 700;
    const large = size >= 24 || (bold && size >= 18.66);
    measured++;
    if (ratio < (large ? 3 : 4.5)) out.push(ratio.toFixed(2) + " " + (large ? "(grande) " : "") + JSON.stringify(node.textContent.trim().slice(0, 40)) + " " + cs.color + " sobre " + "rgb(" + [bg.r, bg.g, bg.b].map(Math.round).join(",") + ")");
  }
  return { out, measured, skipped };
})()`;

const FOCUS = `(() => {
  const el = document.activeElement;
  if (!el || el === document.body) return null;
  const cs = getComputedStyle(el);
  const outline = cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0;
  const shadow = cs.boxShadow !== "none";
  const r = el.getBoundingClientRect();
  return { visible: outline || shadow, desc: el.tagName + " " + (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 40), onScreen: r.width > 0 && r.height > 0 };
})()`;

let total = 0;
const findings = [];
const report = (route, rule, detail) => { total++; findings.push(`${route} · ${rule}: ${detail}`); };
try {
  for (const [path, label] of ROUTES) {
    await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
    await send("Page.navigate", { url: base + path });
    await sleep(3500);
    for (const f of await ev(PAGE_CHECKS)) report(label, f.rule, f.detail);
    for (const t of await ev(TARGETS)) report(label, "objetivo-pequeño", t);
    const contrast = await ev(CONTRAST);
    for (const c of contrast.out) report(label, "contraste", c);
    // foco visible: recorre hasta 40 elementos con Tab
    let hidden = 0; let steps = 0; const seen = new Set();
    await ev("document.activeElement.blur(); window.scrollTo(0,0)");
    for (let i = 0; i < 40; i++) {
      await tab();
      const f = await ev(FOCUS);
      if (!f) break;
      if (seen.has(f.desc + i % 40 && f.desc)) { /* repetido: ciclo completo */ }
      steps++;
      if (f.onScreen && !f.visible) { hidden++; report(label, "foco-invisible", f.desc); }
    }
    console.log(`${label}: ${steps} elementos con Tab, ${contrast.measured} textos medidos (${contrast.skipped} omitidos)`);
    // reflujo a 320 px (WCAG 1.4.10) y 200 % de zoom equivalente (640 px)
    for (const w of [320, 640]) {
      await send("Emulation.setDeviceMetricsOverride", { width: w, height: 800, deviceScaleFactor: 1, mobile: true });
      await send("Page.navigate", { url: base + path });
      await sleep(2500);
      const over = await ev("document.documentElement.scrollWidth - window.innerWidth");
      if (over > 1) report(label, "reflujo-" + w, "desborde horizontal de " + over + " px");
    }
  }
} finally { ws.close(); chrome.kill(); }
console.log("\n" + (total === 0 ? "Sin hallazgos." : total + " hallazgos:\n" + findings.join("\n")));
process.exit(total === 0 ? 0 : 1);
