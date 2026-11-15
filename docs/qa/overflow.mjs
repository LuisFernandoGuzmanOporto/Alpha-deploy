// Busca que elementos se salen del ancho a 375 px. Uso: node --experimental-websocket docs/qa/overflow.mjs <url>
import { spawn } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const url = process.argv[2];
const PORT = 9337;
const chrome = spawn(process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", [
  "--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), "ea-ov-"))}`, "--no-first-run", "about:blank",
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
ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise((ok) => { const id = ++n; pending.set(id, ok); ws.send(JSON.stringify({ id, method, params })); });
try {
  await send("Emulation.setDeviceMetricsOverride", { width: 375, height: 812, deviceScaleFactor: 1, mobile: true });
  await send("Page.navigate", { url });
  await sleep(3500);
  const r = await send("Runtime.evaluate", {
    returnByValue: true,
    expression: `(() => {
      const out = [];
      for (const el of document.querySelectorAll("body *")) {
        const r = el.getBoundingClientRect();
        if (r.right > 376 && r.width > 0 && !el.closest("table")) out.push({ tag: el.tagName, cls: String(el.className).slice(0, 40), right: Math.round(r.right), w: Math.round(r.width), txt: el.textContent.slice(0, 50) });
      }
      return { scrollWidth: document.documentElement.scrollWidth, innerWidth, n: out.length, first: out.slice(0, 8) };
    })()`,
  });
  console.log(JSON.stringify(r.result.value, null, 1));
} finally { ws.close(); chrome.kill(); }
