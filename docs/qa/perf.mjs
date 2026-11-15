// Mide la carga con red y CPU limitadas. Uso: node --experimental-websocket docs/qa/perf.mjs <url> [mobile]
import { spawn } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const url = process.argv[2];
const mobile = process.argv[3] === "mobile";
const PORT = 9338;
const chrome = spawn(process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", [
  "--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), "ea-perf-"))}`, "--no-first-run", "about:blank",
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
let transferred = 0;
const requests = new Map();
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); }
  if (m.method === "Network.responseReceived") requests.set(m.params.requestId, m.params.response.url);
  if (m.method === "Network.loadingFinished") transferred += m.params.encodedDataLength;
});
const send = (method, params = {}) => new Promise((ok) => { const id = ++n; pending.set(id, ok); ws.send(JSON.stringify({ id, method, params })); });
try {
  await send("Network.enable");
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", mobile ? { width: 375, height: 812, deviceScaleFactor: 2, mobile: true } : { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  if (mobile) {
    // aprox. "Slow 4G" de Lighthouse: 1,6 Mbit/s, 150 ms, CPU 4x más lenta
    await send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
    await send("Emulation.setCPUThrottlingRate", { rate: 4 });
  }
  await send("Network.setCacheDisabled", { cacheDisabled: true });
  await send("Page.addScriptToEvaluateOnNewDocument", {
    source: `window.__m = { lcp: 0, fcp: 0, long: 0 };
      new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__m.lcp = e.startTime; }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.name === "first-contentful-paint") window.__m.fcp = e.startTime; }).observe({ type: "paint", buffered: true });
      new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__m.long += Math.max(0, e.duration - 50); }).observe({ type: "longtask", buffered: true });`,
  });
  await send("Page.navigate", { url });
  await sleep(mobile ? 22000 : 9000);
  const r = await send("Runtime.evaluate", { returnByValue: true, expression: `({ ...window.__m, load: performance.timing.loadEventEnd - performance.timing.navigationStart, nodes: document.querySelectorAll("*").length })` });
  const v = r.result.value;
  const kb = (b) => Math.round(b / 1024);
  const big = [...requests.values()].filter((u) => /\.(js|css|jpg|png|json)/.test(u)).map((u) => u.split("/").pop().slice(0, 34));
  console.log(JSON.stringify({ modo: mobile ? "móvil (4G lenta, CPU 4x)" : "escritorio", fcp_ms: Math.round(v.fcp), lcp_ms: Math.round(v.lcp), tbt_aprox_ms: Math.round(v.long), load_ms: v.load, transferido_KB: kb(transferred), elementos_DOM: v.nodes, peticiones: requests.size }, null, 1));
  console.log("archivos:", big.join(", "));
} finally { ws.close(); chrome.kill(); }
