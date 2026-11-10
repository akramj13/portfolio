#!/usr/bin/env node
// Capture a 16:10 screenshot of a live site for a project card.
//
// usage: node capture-screenshot.mjs <url> <out.png> [settle-ms]
//
// Starts headless Chrome, loads the page at 1600x1000 CSS px with a 1.25x
// device scale (a 2000x1250 PNG, the size the cards expect), waits for the
// load event and then `settle-ms` of real time (default 4000) so fade-ins
// and client-side rendering finish, and saves the first screen.
//
// Chrome's own --screenshot flag uses a virtual clock that can stop before
// CSS/JS animations end, which leaves animated heroes blank or half-faded;
// driving Chrome over the DevTools protocol with a real wait avoids that.
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

const [, , url, out, settleArg] = process.argv;
if (!url || !out) {
  console.error("usage: node capture-screenshot.mjs <url> <out.png> [settle-ms]");
  process.exit(64);
}
const settleMs = Number(settleArg ?? 4000);

const chromePath = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].find((p) => existsSync(p));
if (!chromePath) {
  console.error("error: no Chrome or Chromium found; ask the user for a screenshot instead");
  process.exit(2);
}

const profile = mkdtempSync(join(tmpdir(), "capture-"));
const chrome = spawn(
  chromePath,
  ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "about:blank"],
  { stdio: ["ignore", "ignore", "pipe"] },
);
const cleanup = () => {
  chrome.kill("SIGKILL");
  rmSync(profile, { recursive: true, force: true });
};
const fail = (message, code = 1) => {
  console.error(`error: ${message}; ask the user for a screenshot instead`);
  cleanup();
  process.exit(code);
};
const timeout = setTimeout(() => fail(`timed out capturing ${url}`), 45_000 + settleMs);

try {
  // Chrome prints "DevTools listening on ws://127.0.0.1:<port>/..." once it's ready.
  const port = await new Promise((resolve, reject) => {
    let log = "";
    chrome.stderr.on("data", (chunk) => {
      log += chunk;
      const match = log.match(/DevTools listening on ws:\/\/[^:]+:(\d+)\//);
      if (match) resolve(match[1]);
    });
    chrome.on("exit", () => reject(new Error("Chrome exited before it was ready")));
  });

  const target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" })).json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = () => reject(new Error("could not connect to Chrome"));
  });

  let nextId = 0;
  const pending = new Map();
  const listeners = new Map();
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    } else if (msg.method && listeners.has(msg.method)) {
      listeners.get(msg.method)(msg.params);
    }
  };
  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const id = ++nextId;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  const once = (method, ms) =>
    new Promise((resolve) => {
      const t = setTimeout(resolve, ms); // don't hang on pages that never fire load
      listeners.set(method, () => {
        clearTimeout(t);
        resolve();
      });
    });

  await send("Emulation.setDeviceMetricsOverride", { width: 1600, height: 1000, deviceScaleFactor: 1.25, mobile: false });
  await send("Page.enable");
  const loaded = once("Page.loadEventFired", 30_000);
  const nav = await send("Page.navigate", { url });
  if (nav.result?.errorText) fail(`could not load ${url} (${nav.result.errorText})`);
  await loaded;
  await new Promise((r) => setTimeout(r, settleMs));

  const shot = await send("Page.captureScreenshot", { format: "png" });
  if (!shot.result?.data) fail(`Chrome returned no image for ${url}`);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, Buffer.from(shot.result.data, "base64"));
  ws.close();
  clearTimeout(timeout);
  cleanup();
  console.log(`saved ${out} (2000x1250)`);
} catch (error) {
  fail(error.message);
}
