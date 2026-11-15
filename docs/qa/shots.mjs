// Captura una lista de URLs. Uso: node --experimental-websocket docs/qa/shots.mjs <carpeta> <ancho> <alto> "<url>=><archivo.jpg>" ...
import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [outDir, width, height, ...pairs] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const PORT = 9335;
const chrome = spawn(process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", [
  "--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), "ea-shots-"))}`,
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
ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise((ok) => { const id = ++n; pending.set(id, ok); ws.send(JSON.stringify({ id, method, params })); });
try {
  await send("Emulation.setDeviceMetricsOverride", { width: +width, height: +height, deviceScaleFactor: 1, mobile: false });
  for (const pair of pairs) {
    const [url, file] = pair.split("=>");
    await send("Page.navigate", { url });
    await sleep(5000);
    const { data } = await send("Page.captureScreenshot", { format: "jpeg", quality: 82 });
    writeFileSync(join(outDir, file), Buffer.from(data, "base64"));
    console.log("ok", file);
  }
} finally { ws.close(); chrome.kill(); }
