// Capturas del rediseño para el pitch, sin dependencias: Microsoft Edge en modo headless controlado por CDP.
// Uso: con `npm run dev` (o `npm run preview`) activo, `node docs/design/capturar.cjs`.
// Variables opcionales: EA_URL (por defecto http://localhost:5173) y EA_EDGE (ruta de msedge.exe).
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const BASE = process.env.EA_URL || "http://localhost:5173";
const EDGE = process.env.EA_EDGE || "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const OUT = path.join(__dirname, "capturas");
const PORT = 9333;

/** Capturas pedidas en docs/pendientes/noe.md (N-5). `full`: página completa; si no, solo la pantalla. */
const SHOTS = [
  { name: "principal-1440", url: "/", width: 1440, height: 900 },
  { name: "principal-detalle-1440", url: "/?analogo=earth-atacama-nucleo-hiperarido", width: 1440, height: 900 },
  { name: "principal-375", url: "/", width: 375, height: 812, full: true },
  { name: "solo-bolivia-1440", url: "/?sitio=mars-jezero&bolivia=1", width: 1440, height: 900 },
  { name: "comparador-1440", url: "/comparar/moon-faustini-rim-a/earth-atacama-nucleo-hiperarido", width: 1440, height: 900, full: true },
  { name: "descubrimientos-1440", url: "/descubrimientos", width: 1440, height: 900, full: true },
  {
    name: "globo-1440",
    url: "/?sitio=mars-jezero",
    width: 1440,
    height: 900,
    script: `(async () => {
      const fold = document.querySelector(".ea-fold");
      fold.open = true;
      await new Promise((r) => setTimeout(r, 2500));
      document.querySelector("#globe-tab-earth").click();
      document.querySelector(".ea-fold").scrollIntoView({ block: "start" });
      window.scrollBy(0, -80);
    })()`,
  },
  { name: "metodologia-1440", url: "/metodologia", width: 1440, height: 900, full: true },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForTarget() {
  for (let i = 0; i < 50; i += 1) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const page = list.find((t) => t.type === "page");
      if (page) return page.webSocketDebuggerUrl;
    } catch {
      // Edge aún arranca.
    }
    await sleep(200);
  }
  throw new Error("Edge no abrió el puerto de depuración");
}

function connect(url) {
  const ws = new WebSocket(url);
  let id = 0;
  const pending = new Map();
  const listeners = new Set();
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(msg.error.message));
      else resolve(msg.result);
    } else if (msg.method) {
      for (const fn of listeners) fn(msg);
    }
  };
  const ready = new Promise((resolve) => (ws.onopen = resolve));
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      id += 1;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  const once = (method) => new Promise((resolve) => {
    const fn = (msg) => {
      if (msg.method === method) {
        listeners.delete(fn);
        resolve(msg.params);
      }
    };
    listeners.add(fn);
  });
  return { ready, send, once, close: () => ws.close() };
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "ea-capturas-"));
  const edge = spawn(EDGE, [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--hide-scrollbars",
    "--no-first-run",
    "about:blank",
  ]);
  try {
    const cdp = connect(await waitForTarget());
    await cdp.ready;
    await cdp.send("Page.enable");
    // Sin animaciones: las barras y el anillo salen completos en la captura.
    await cdp.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
    for (const shot of SHOTS) {
      await cdp.send("Emulation.setDeviceMetricsOverride", {
        width: shot.width,
        height: shot.height,
        deviceScaleFactor: 1,
        mobile: shot.width < 500,
      });
      const loaded = cdp.once("Page.loadEventFired");
      await cdp.send("Page.navigate", { url: BASE + shot.url });
      await loaded;
      await sleep(4000); // datos, teselas del mapa y fuentes
      if (shot.script) {
        await cdp.send("Runtime.evaluate", { expression: shot.script, awaitPromise: true });
        await sleep(2500);
      }
      const params = { format: "png" };
      if (shot.full) {
        const { result } = await cdp.send("Runtime.evaluate", { expression: "document.documentElement.scrollHeight", returnByValue: true });
        params.captureBeyondViewport = true;
        params.clip = { x: 0, y: 0, width: shot.width, height: result.value, scale: 1 };
      }
      const { data } = await cdp.send("Page.captureScreenshot", params);
      const file = path.join(OUT, `${shot.name}.png`);
      fs.writeFileSync(file, Buffer.from(data, "base64"));
      console.log(`✓ ${path.relative(process.cwd(), file)}`);
    }
    cdp.close();
  } finally {
    edge.kill();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
