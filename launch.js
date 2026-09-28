'use strict';

const { spawn, exec } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 8787);
const URL = `http://localhost:${PORT}/`;
const PROFILE = process.env.TAG_AGENT_PROFILE || path.join(process.env.LOCALAPPDATA || ROOT, 'TagAgent');

function findBrowsers() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ].filter(Boolean);
  const found = [];
  for (const p of candidates) {
    if (fs.existsSync(p) && !found.includes(p)) found.push(p);
  }
  return found;
}

async function waitReady(timeoutMs = 15000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(URL + 'api/bootstrap', (res) => {
          res.resume();
          res.statusCode < 500 ? resolve() : reject(new Error('bad status'));
        });
        req.on('error', reject);
        req.setTimeout(500, () => req.destroy(new Error('timeout')));
      });
      return true;
    } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  return false;
}

function keepAlive() {
  setInterval(() => {}, 1000);
}

async function main() {
  let server = null;
  let log = '';
  const alreadyReady = await waitReady(700);
  if (!alreadyReady) {
    server = spawn(process.execPath, [path.join(ROOT, 'server.js')], {
      cwd: ROOT,
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, PORT: String(PORT) },
    });
    server.stdout.on('data', (d) => (log += d));
    server.stderr.on('data', (d) => (log += d));

    const ready = await waitReady();
    if (!ready) {
      fs.writeFileSync(path.join(ROOT, 'launch-error.log'), '服务启动失败：\n' + log);
      try { server.kill(); } catch {}
      process.exit(1);
    }
  }

  const browsers = findBrowsers();
  if (!browsers.length) {
    exec(`start "" "${URL}"`);
    if (server) server.on('exit', () => process.exit(0));
    process.on('SIGINT', () => {
      if (server) { try { server.kill(); } catch {} }
      process.exit(0);
    });
    keepAlive();
    return;
  }

  fs.mkdirSync(PROFILE, { recursive: true });
  let browser = null;
  let opened = false;

  function openDefaultBrowser() {
    exec(`start "" "${URL}"`);
    if (server) server.on('exit', () => process.exit(0));
    process.on('SIGINT', () => {
      if (server) { try { server.kill(); } catch {} }
      process.exit(0);
    });
    keepAlive();
  }

  function tryBrowser(index) {
    if (index >= browsers.length) {
      openDefaultBrowser();
      return;
    }
    const child = spawn(browsers[index], [
      '--app=' + URL,
      '--user-data-dir=' + PROFILE,
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
      '--disable-gpu',
      '--disable-gpu-compositing',
      '--disable-software-rasterizer',
    ], { stdio: 'ignore', windowsHide: true });
    browser = child;
    let settled = false;
    const timer = setTimeout(() => { opened = true; }, 3500);
    const fail = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      tryBrowser(index + 1);
    };
    child.once('error', fail);
    child.once('exit', () => {
      if (opened) {
        try { server.kill(); } catch {}
        process.exit(0);
      } else {
        fail();
      }
    });
  }

  tryBrowser(0);
  if (server) server.on('exit', () => process.exit(0));
  process.on('SIGINT', () => {
    try { browser.kill(); } catch {}
    process.exit(0);
  });
  keepAlive();
}

main().catch((e) => {
  try {
    fs.writeFileSync(path.join(ROOT, 'launch-error.log'), String((e && e.stack) || e));
  } catch {}
  process.exit(1);
});
