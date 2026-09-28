'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const { GENRES, ROLES, IMPL, getStep, chat } = require('./lib/guidance');
const { exportTags, validateTag } = require('./lib/export');
const { renderHtml, renderMarkdown } = require('./lib/usage-doc');
const llm = require('./lib/llm');
const { buildSystemPrompt, buildUserMessage, parseLlmResponse } = require('./lib/llm-guide');
const store = require('./lib/store');

if (store.db.settings && store.db.settings.llm) {
  llm.setConfig(store.db.settings.llm);
}

const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, 'public');
const PORT = Number(process.env.PORT || 8787);

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (c) => {
      raw += c;
      if (raw.length > 2e6) req.destroy();
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error('请求体不是合法的 JSON'));
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

function sendText(res, status, text, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type, 'Content-Length': Buffer.byteLength(text) });
  res.end(text);
}

function persist() {
  try {
    store.saveDb(store.db);
  } catch (e) {
    if (e.code === 'EPERM' || e.code === 'EACCES') {
      throw new Error(`保存失败：程序没有权限写入 ${store.DB_PATH}。请用「启动App」方式运行本应用。`);
    }
    if (e.code === 'ENOSPC') {
      throw new Error('保存失败：磁盘空间不足。');
    }
    throw e;
  }
}

function metaPayload() {
  return {
    genres: Object.entries(GENRES).map(([k, v]) => ({ key: k, name: v.name, intro: v.intro })),
    roles: Object.entries(ROLES).map(([k, v]) => ({ key: k, name: v.name, lens: v.lens })),
    impl: Object.values(IMPL).map((v) => ({ key: v.key, name: v.name, short: v.short })),
    llmAvailable: llm.available(),
  };
}

async function llmGuide(genre, role, message, existingTags) {
  try {
    const text = await llm.complete(
      buildSystemPrompt(genre, role, existingTags),
      buildUserMessage(genre, role, message)
    );
    if (!text) return null;
    return parseLlmResponse(text, genre, role);
  } catch {
    return null;
  }
}

function serveStatic(req, res, pathname) {
  const file = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const target = path.normalize(path.join(PUBLIC_DIR, file));
  if (target !== PUBLIC_DIR && !target.startsWith(PUBLIC_DIR + path.sep)) {
    return sendText(res, 403, 'forbidden');
  }
  fs.readFile(target, (err, data) => {
    if (err) return sendText(res, 404, 'not found');
    const types = {
      '.html': 'text/html; charset=utf-8',
      '.js': 'text/javascript; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.svg': 'image/svg+xml',
      '.png': 'image/png',
      '.ico': 'image/x-icon',
    };
    res.writeHead(200, {
      'Content-Type': types[path.extname(target).toLowerCase()] || 'application/octet-stream',
      'Content-Length': data.length,
    });
    res.end(data);
  });
}

async function handleApi(req, res, pathname) {
  const parts = pathname.split('/').filter(Boolean);
  const method = req.method;

  try {
    if (method === 'GET' && pathname === '/api/settings') {
      const current = llm.getConfig();
      return sendJson(res, 200, {
        baseUrl: current.baseUrl,
        model: current.model,
        hasApiKey: llm.available(),
      });
    }

    if (method === 'POST' && pathname === '/api/settings') {
      const body = await readJsonBody(req);
      const current = llm.getConfig();
      const next = { apiKey: current.apiKey, baseUrl: current.baseUrl, model: current.model };
      if (typeof body.baseUrl === 'string' && body.baseUrl.trim()) next.baseUrl = body.baseUrl.trim();
      if (typeof body.model === 'string' && body.model.trim()) next.model = body.model.trim();
      if (body.clearApiKey === true) {
        next.apiKey = '';
      } else if (typeof body.apiKey === 'string' && body.apiKey.trim()) {
        next.apiKey = body.apiKey.trim();
      }
      store.db.settings = store.db.settings || {};
      store.db.settings.llm = next;
      llm.setConfig(next);
      persist();
      return sendJson(res, 200, {
        baseUrl: next.baseUrl,
        model: next.model,
        hasApiKey: Boolean(next.apiKey),
      });
    }

    if (method === 'GET' && pathname === '/api/bootstrap') {
      return sendJson(res, 200, {
        meta: metaPayload(),
        projects: store.db.projects.map((p) => ({ ...p })),
        marketplace: store.db.projects.filter((p) => p.visibility === 'published').map(store.publicProject),
      });
    }

    if (method === 'POST' && pathname === '/api/projects') {
      const body = await readJsonBody(req);
      const project = store.makeProject(body);
      store.db.projects.push(project);
      persist();
      return sendJson(res, 201, project);
    }

    if (method === 'GET' && pathname === '/api/marketplace') {
      return sendJson(res, 200, store.db.projects.filter((p) => p.visibility === 'published').map(store.publicProject));
    }

    if (parts[1] === 'projects' && parts[2]) {
      const project = store.findProject(parts[2]);
      if (!project) return sendJson(res, 404, { error: '找不到这个标签包' });

      if (method === 'GET' && parts.length === 3) return sendJson(res, 200, project);

      if (method === 'PATCH' && parts.length === 3) {
        const body = await readJsonBody(req);
        const allowed = ['name', 'genre', 'role', 'description', 'author', 'price', 'visibility'];
        for (const k of allowed) if (k in body) project[k] = body[k];
        if (GENRES[project.genre]) project.genreName = GENRES[project.genre].name;
        if (ROLES[project.role]) project.roleName = ROLES[project.role].name;
        project.updatedAt = store.now();
        persist();
        return sendJson(res, 200, project);
      }

      if (method === 'DELETE' && parts.length === 3) {
        store.db.projects = store.db.projects.filter((p) => p.id !== project.id);
        persist();
        return sendJson(res, 200, { ok: true });
      }

      if (parts[3] === 'tags') {
        if (method === 'POST' && parts.length === 4) {
          const body = await readJsonBody(req);
          const incoming = Array.isArray(body.tags) ? body.tags : [body];
          const existing = new Set(project.tags.map((t) => t.path));
          const added = [];
          for (const item of incoming) {
            const pathValue = item && item.path;
            if (!validateTag(pathValue) || existing.has(pathValue)) continue;
            existing.add(pathValue);
            const tag = {
              id: store.uid('t'),
              path: pathValue,
              comment: item.comment || '',
              impl: IMPL[item.impl] ? item.impl : 'tag',
              notes: item.notes || '',
            };
            project.tags.push(tag);
            added.push(tag);
          }
          store.sortTags(project);
          project.updatedAt = store.now();
          persist();
          return sendJson(res, 200, { added, count: project.tags.length });
        }

        if (method === 'DELETE' && parts.length === 4) {
          const removed = project.tags.length;
          project.tags = [];
          project.updatedAt = store.now();
          persist();
          return sendJson(res, 200, { removed });
        }

        if (parts[4]) {
          const tag = store.findTag(project, parts[4]);
          if (!tag) return sendJson(res, 404, { error: '找不到这个标签' });

          if (method === 'PATCH') {
            const body = await readJsonBody(req);
            if ('path' in body && !validateTag(body.path)) {
              return sendJson(res, 400, { error: '标签路径不合法' });
            }
            if ('path' in body && body.path !== tag.path && project.tags.some((t) => t.id !== tag.id && t.path === body.path)) {
              return sendJson(res, 409, { error: '已存在同名标签' });
            }
            if ('path' in body) tag.path = body.path;
            if ('comment' in body) tag.comment = body.comment;
            if ('impl' in body) tag.impl = IMPL[body.impl] ? body.impl : 'tag';
            if ('notes' in body) tag.notes = body.notes;
            store.sortTags(project);
            project.updatedAt = store.now();
            persist();
            return sendJson(res, 200, tag);
          }

          if (method === 'DELETE') {
            const prefix = tag.path + '.';
            const before = project.tags.length;
            project.tags = project.tags.filter((t) => t.id !== tag.id && !t.path.startsWith(prefix));
            project.updatedAt = store.now();
            persist();
            return sendJson(res, 200, { removed: before - project.tags.length });
          }
        }
      }

      if (parts[3] === 'publish' && method === 'POST') {
        const body = await readJsonBody(req);
        if (!project.name || !project.tags.length) {
          return sendJson(res, 400, { error: '发布前需要名称和至少一个标签' });
        }
        project.visibility = 'published';
        if ('price' in body) project.price = Math.max(0, Number(body.price || 0));
        project.updatedAt = store.now();
        persist();
        return sendJson(res, 200, store.publicProject(project));
      }

      if (parts[3] === 'generate-ai' && method === 'POST') {
        const prompt = `请为“${project.name}”生成一套完整的 ${project.genreName} 标签体系，覆盖数值属性、状态、事件、能力、表现和数据标签，至少包含 6 个一级领域。`;
        const g = await llmGuide(project.genre, project.role, prompt, project.tags);
        if (!g || !g.items.length) {
          return sendJson(res, 502, { error: 'AI 生成失败，请确认网络与 API 配置后重试' });
        }
        return sendJson(res, 200, g);
      }

      if (parts[3] === 'generate' && method === 'POST') {
        const all = store.seedTags(project.genre, project.role, Infinity);
        const existing = new Set(project.tags.map((t) => t.path));
        const added = [];
        for (const item of all) {
          if (existing.has(item.path)) continue;
          existing.add(item.path);
          project.tags.push(item);
          added.push(item);
        }
        store.sortTags(project);
        project.updatedAt = store.now();
        persist();
        return sendJson(res, 200, { added, count: project.tags.length });
      }

      if (parts[3] === 'export' && method === 'GET') {
        const format = (req.url.split('format=')[1] || 'ini').split('&')[0];
        const result = exportTags(project.tags, ['ini', 'csv', 'json', 'cpp'].includes(format) ? format : 'ini');
        return sendText(res, 200, result.body, result.type);
      }

      if (parts[3] === 'usage-doc' && method === 'GET') {
        const fmt = (req.url.split('format=')[1] || 'html').split('&')[0];
        if (fmt === 'md') return sendText(res, 200, renderMarkdown(project), 'text/markdown; charset=utf-8');
        return sendText(res, 200, renderHtml(project), 'text/html; charset=utf-8');
      }
    }

    if (parts[1] === 'import' && parts[2] && method === 'POST') {
      const source = store.findProject(parts[2]);
      if (!source) return sendJson(res, 404, { error: '找不到来源标签包' });
      const clone = store.makeProject({
        name: source.name + '（导入）',
        genre: source.genre,
        role: source.role,
        description: source.description,
        author: '我',
        price: 0,
        visibility: 'private',
        tags: source.tags.map((t) => ({ id: store.uid('t'), path: t.path, comment: t.comment, impl: t.impl, notes: t.notes })),
      });
      store.db.projects.push(clone);
      persist();
      return sendJson(res, 201, clone);
    }

    if (parts[1] === 'guide' && parts[2] === 'step' && method === 'POST') {
      const body = await readJsonBody(req);
      return sendJson(res, 200, getStep(body.genre, body.role, Number(body.step || 1), { domainKey: body.domainKey }));
    }

    if (parts[1] === 'guide' && parts[2] === 'chat' && method === 'POST') {
      const body = await readJsonBody(req);
      const curated = chat(body.genre, body.role, body.message);
      let reply = curated.reply;
      let items = curated.items;
      if (llm.available) {
        const g = await llmGuide(body.genre, body.role, body.message, body.existingTags);
        if (g) {
          if (g.reply) reply = g.reply;
          if (g.items.length) items = g.items;
        }
      }
      return sendJson(res, 200, { reply, items });
    }

    return sendJson(res, 404, { error: '未知接口' });
  } catch (err) {
    console.error(err);
    return sendJson(res, 500, { error: err.message || '服务器内部错误' });
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(url.pathname);
  if (pathname.startsWith('/api/')) {
    await handleApi(req, res, pathname);
  } else {
    serveStatic(req, res, pathname);
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`端口 ${PORT} 已被占用：可能已经有一个实例在运行。`);
    process.exit(1);
  }
  throw err;
});

server.listen(PORT, () => {
  console.log(`Tag Agent running at http://localhost:${PORT}`);
});
