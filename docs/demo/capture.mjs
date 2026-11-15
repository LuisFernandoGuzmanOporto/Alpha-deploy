// Capturas de la web para la demo oficial y exportación de las diapositivas a PDF.
// Uso: node --experimental-websocket docs/demo/capture.mjs <url-base> <carpeta-de-salida>
// Requiere Chrome instalado y la web servida (por ejemplo con `npm run preview` en web/).
import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const [base = "http://localhost:4173", outArg = "docs/demo/img"] = process.argv.slice(2);
const out = resolve(outArg);
mkdirSync(out, { recursive: true });

const CHROME = process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PORT = 9333;
const profile = mkdtempSync(join(tmpdir(), "ea-capture-"));
const chrome = spawn(CHROME, [
  "--headless=new",
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${profile}`,
  "--hide-scrollbars",
  "--no-first-run",
  "--disable-gpu-vsync",
  "--enable-unsafe-swiftshader", // WebGL por software: el globo y la portada 3D se ven también sin GPU
  "--ignore-gpu-blocklist",
  "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function connect() {
  for (let i = 0; i < 40; i++) {
    try {
      const pages = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
      const page = pages.find((p) => p.type === "page");
      if (page) return page.webSocketDebuggerUrl;
    } catch {
      /* Chrome aún arrancando */
    }
    await sleep(250);
  }
  throw new Error("No se pudo conectar con Chrome");
}

const ws = new WebSocket(await connect());
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let nextId = 0;
const pending = new Map();
ws.addEventListener("message", (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve: ok, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? reject(new Error(msg.error.message)) : ok(msg.result);
  }
});
const send = (method, params = {}) =>
  new Promise((ok, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve: ok, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });

const evaluate = async (expression) => {
  const { result, exceptionDetails } = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (exceptionDetails) throw new Error(exceptionDetails.text);
  return result.value;
};

async function open(path, width = 1440, height = 900) {
  await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1.5, mobile: false });
  await send("Page.navigate", { url: `${base}${path}` });
  await sleep(3500);
}

async function shot(name, clip) {
  const { data } = await send("Page.captureScreenshot", { format: "jpeg", quality: 86, ...(clip ? { clip: { ...clip, scale: 1 } } : {}) });
  writeFileSync(join(out, `${name}.jpg`), Buffer.from(data, "base64"));
  console.log("captura", name);
}

const elementClip = (selector) =>
  evaluate(`(() => { const r = document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect(); return { x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height }; })()`);

// La pantalla Explorar empieza con la portada: el mapa y el ranking están en #explore-stage.
async function toStage() {
  await evaluate(`document.getElementById('explore-stage').scrollIntoView({ block: 'start' })`);
  await sleep(3000);
}
const stageClip = () => elementClip("#explore-stage");

try {
  // Pantalla principal: sitio lunar, mapa y ranking (diapositiva 3).
  // Portada con la escena 3D (pantalla principal).
  await open("/?lang=en", 1440, 810);
  await sleep(3500);
  await shot("hero");

  await open("/?lang=en&sitio=moon-malapert-massif", 1200, 816);
  await toStage();
  await shot("home-malapert", await stageClip());

  // Solo Bolivia sobre Marte (diapositiva 7).
  await open("/?lang=en&sitio=mars-jezero&bolivia=1", 1200, 816);
  await toStage();
  await shot("bolivia-jezero", await stageClip());

  // Comparador completo (diapositiva 4).
  await open("/comparar/moon-malapert-massif/earth-licancabur-laguna-verde?lang=en", 900, 1400);
  await sleep(2500);
  await shot("compare-malapert-licancabur", { x: 0, y: 80, width: 900, height: 660 });

  // Descubrimientos (diapositiva 6).
  await open("/descubrimientos?lang=en", 1100, 800);
  await shot("discoveries");

  // Metodología: diagrama del proceso y comienzo del texto (diapositiva 4).
  await open("/metodologia?lang=en", 1100, 800);
  await shot("methodology");

  // Globo: Luna con el sitio marcado y Tierra con los análogos (diapositivas 1 y 7).
  await open("/?lang=en&sitio=moon-malapert-massif", 1440, 900);
  await evaluate(`window.scrollTo(0, document.body.scrollHeight)`); // el globo ya no está plegado: se carga al bajar
  await sleep(4000);
  await evaluate(`document.querySelector('.globe-canvas').scrollIntoView({ block: 'center' })`);
  await sleep(3500); // la cámara vuela hasta el sitio
  await shot("globe-moon", await elementClip(".globe-canvas"));
  await evaluate(`[...document.querySelectorAll('.globe-tabs [role=tab]')].find((t) => /earth/i.test(t.textContent)).click()`);
  await sleep(4000);
  await evaluate(`document.querySelector('.globe-canvas').scrollIntoView({ block: 'center' })`);
  await sleep(800);
  await shot("globe-earth", await elementClip(".globe-canvas"));

  // PDF de las diapositivas, si se pasó la ruta del HTML.
  const slides = process.env.SLIDES;
  if (slides) {
    await send("Page.navigate", { url: pathToFileURL(resolve(slides)).href });
    await sleep(2500);
    const { data } = await send("Page.printToPDF", { printBackground: true, preferCSSPageSize: true });
    const pdf = process.env.PDF ?? "docs/demo/earth-analogs-demo.pdf";
    writeFileSync(resolve(pdf), Buffer.from(data, "base64"));
    console.log("pdf", pdf);
  }
} finally {
  ws.close();
  chrome.kill();
}
