'use strict';

const ICONS = {
  compass: '<path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265Z"/><circle cx="12" cy="12" r="10"/>',
  tag: '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42Z"/><circle cx="7.5" cy="7.5" r=".5"/>',
  'file-text': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
  store: '<path d="M3 9l1-4h16l1 4M4 9v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9M8 22v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  trash: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h16zM10 11v6M14 11v6"/>',
  edit: '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  'chevron-right': '<path d="m9 18 6-6-6-6"/>',
  'chevron-left': '<path d="m15 18-6-6 6-6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  'zoom-in': '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3M11 8v6M8 11h6"/>',
  'zoom-out': '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3M8 11h6"/>',
  maximize: '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>',
  minimize: '<path d="M3 8V5a2 2 0 0 1 2-2h3m10 0h3a2 2 0 0 1 2 2v3m0 8v3a2 2 0 0 1-2 2h-3m-10 0H5a2 2 0 0 1-2-2v-3"/>',
  sparkles: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>',
  child: '<path d="M4 4v7a4 4 0 0 0 4 4h12"/><polyline points="15 10 20 15 15 20"/>',
  sibling: '<path d="M12 4v16M6 14l6 6 6-6"/>',
  settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  refresh: '<path d="M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6"/>',
  cloud: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
};

function svg(name) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ''}</svg>`;
}

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function parentPath(p) {
  const i = String(p || '').lastIndexOf('.');
  return i < 0 ? '' : String(p).slice(0, i);
}

const TAG_RE = /^[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z][A-Za-z0-9_]*)*$/;

const state = {
  meta: { genres: [], roles: [], impl: [], llmAvailable: false },
  projects: [],
  marketplace: [],
  activeProjectId: null,
  view: 'builder',
  guide: { step: 1, domainKey: null, title: '', message: '', items: [], hint: '' },
  chat: [],
  chatCollapsed: false,
  mindZoom: 1,
  mindFullscreen: false,
  structureHeight: 560,
  collapsed: new Set(),
  search: '',
  chatBusy: false,
};

const $ = (sel) => document.querySelector(sel);

async function api(method, url, body) {
  const res = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    let msg = res.statusText;
    try {
      const j = await res.json();
      msg = j.error || msg;
    } catch {}
    throw new Error(msg);
  }
  const ct = res.headers.get('Content-Type') || '';
  return ct.includes('json') ? res.json() : res.text();
}

async function loadBootstrap() {
  const data = await api('GET', '/api/bootstrap');
  state.meta = data.meta;
  state.projects = data.projects;
  state.marketplace = data.marketplace;
  if (!state.projects.find((p) => p.id === state.activeProjectId)) {
    state.activeProjectId = state.projects[0] ? state.projects[0].id : null;
  }
}

function activeProject() {
  return state.projects.find((p) => p.id === state.activeProjectId) || null;
}

function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => (el.hidden = true), 2600);
}

function implBadge(key) {
  const cls = { tag: 'tag', attribute: 'attribute', ge: 'ge', ga: 'ga', gc: 'gc', component: 'component' }[key] || 'tag';
  const short = (state.meta.impl.find((i) => i.key === key) || {}).short || 'Tag';
  return `<span class="badge badge-${cls}">${esc(short)}</span>`;
}

function implShort(key) {
  return (state.meta.impl.find((i) => i.key === key) || {}).short || '标签';
}

function renderShell() {
  const nav = [
    { key: 'builder', name: '搭建', icon: 'compass' },
    { key: 'tags', name: '标签', icon: 'tag' },
    { key: 'doc', name: '使用文档', icon: 'file-text' },
    { key: 'market', name: '市场', icon: 'store' },
  ];
  $('#nav').innerHTML = nav
    .map((n) => `<button class="nav-item ${state.view === n.key ? 'active' : ''}" data-nav="${n.key}">${svg(n.icon)}<span>${n.name}</span></button>`)
    .join('');

  const project = activeProject();
  $('#projectSelect').innerHTML = state.projects
    .map((p) => `<option value="${p.id}">${esc(p.name)}</option>`)
    .join('');
  if (project) $('#projectSelect').value = project.id;
  $('#newProjectBtn').innerHTML = svg('plus');

  $('#genreSelect').innerHTML = state.meta.genres.map((g) => `<option value="${g.key}">${esc(g.name)}</option>`).join('');
  $('#roleSelect').innerHTML = state.meta.roles.map((r) => `<option value="${r.key}">${esc(r.name)}</option>`).join('');
  if (project) {
    $('#genreSelect').value = project.genre;
    $('#roleSelect').value = project.role;
  }

  $('#exportBtn').innerHTML = `${svg('download')}<span>导出</span>`;
  $('#publishBtn').innerHTML = `${svg('cloud')}<span>发布</span>`;
  $('#settingsBtn').innerHTML = svg('settings');
  $('#sidebarFoot').innerHTML = project
    ? `${project.tags.length} 个标签 · LLM ${state.meta.llmAvailable ? '已连接' : '离线引导'}`
    : '暂无标签包';

  renderContent();
}

function renderContent() {
  const c = $('#content');
  if (state.view === 'builder') return renderBuilder(c);
  if (state.view === 'tags') return renderTags(c);
  if (state.view === 'doc') return renderDoc(c);
  if (state.view === 'market') return renderMarket(c);
}

const MIND_COL_W = 150;
const MIND_ROW_H = 34;
const MIND_NODE_H = 26;
const MIND_PALETTE = ['#1f7a8c', '#b8742d', '#5a7d3a', '#7a4f9e', '#b3486b', '#3a6ea5', '#8a6d3b'];
const IMPL_COLORS = { tag: '#9aa4b2', attribute: '#4a7fd4', ge: '#3f9d5c', ga: '#8a5cc6', gc: '#d2913c', component: '#d15a5a' };

function buildTagTree(project) {
  const root = { path: '', seg: '', depth: -1, parent: null, children: new Map(), tag: null };
  for (const t of project.tags) {
    const parts = t.path.split('.');
    let node = root;
    let cur = '';
    for (const seg of parts) {
      cur = cur ? cur + '.' + seg : seg;
      if (!node.children.has(cur)) {
        node.children.set(cur, { path: cur, seg, depth: node.depth + 1, parent: node, children: new Map(), tag: null });
      }
      node = node.children.get(cur);
    }
    node.tag = t;
  }
  return root;
}

function renderTagMindmap(project) {
  if (!project || !project.tags.length) {
    return '<div class="empty">还没有标签，从上面的引导或 AI 助手添加后会在这里生成思维导图。</div>';
  }

  const root = buildTagTree(project);
  const nodes = [];
  const leaves = [];
  (function collect(node) {
    if (node !== root) nodes.push(node);
    const kids = [...node.children.values()];
    if (!kids.length && node !== root) leaves.push(node);
    for (const k of kids) collect(k);
  })(root);

  leaves.forEach((leaf, i) => { leaf.row = i; leaf.y = i * MIND_ROW_H + MIND_ROW_H / 2; });

  function assignY(node) {
    const kids = [...node.children.values()];
    if (!kids.length) return node.y;
    let sum = 0;
    for (const k of kids) sum += assignY(k);
    node.y = sum / kids.length;
    return node.y;
  }
  for (const k of root.children.values()) assignY(k);

  const maxDepth = nodes.reduce((m, n) => Math.max(m, n.depth), 0);
  const leafCount = Math.max(leaves.length, 1);
  const rootColors = {};
  [...root.children.keys()].forEach((rp, i) => { rootColors[rp] = MIND_PALETTE[i % MIND_PALETTE.length]; });

  const nodeLabel = (n) => (n.tag && n.tag.comment ? n.tag.comment : n.seg);
  const cjk = (s) => /[\u4e00-\u9fff]/.test(s);
  const measure = (label, hasImpl) => Math.min(232, Math.max(64, label.length * (cjk(label) ? 14 : 8) + 24 + (hasImpl ? 48 : 0)));
  const width = (maxDepth + 1) * MIND_COL_W + 200;
  const height = leafCount * MIND_ROW_H + 40;
  const nw = {};
  for (const n of nodes) nw[n.path] = measure(nodeLabel(n), Boolean(n.tag && n.depth > 0));

  const connectors = [];
  for (const n of nodes) {
    if (!n.parent || n.parent === root) continue;
    const p = n.parent;
    const x1 = p.depth * MIND_COL_W + 20 + nw[p.path];
    const y1 = p.y;
    const x2 = n.depth * MIND_COL_W + 20;
    const y2 = n.y;
    const mx = (x1 + x2) / 2;
    const color = rootColors[n.path.split('.')[0]] || MIND_PALETTE[0];
    connectors.push(`<path d="M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.5"/>`);
  }

  const nodeSvg = nodes.map((n) => {
    const color = rootColors[n.path.split('.')[0]] || MIND_PALETTE[0];
    const w = nw[n.path];
    const x = n.depth * MIND_COL_W + 20;
    const y = n.y - MIND_NODE_H / 2;
    const rootLevel = n.depth === 0;
    const label = nodeLabel(n);
    const limit = cjk(label) ? 8 : 16;
    const text = label.length > limit ? label.slice(0, limit) + '…' : label;
    const fill = rootLevel ? color : '#ffffff';
    const textColor = rootLevel ? '#ffffff' : '#26303c';
    const labelSvg = `<text x="${x + (rootLevel ? w / 2 : 10)}" y="${y + 17}" font-size="12" font-weight="${rootLevel ? 600 : 400}" fill="${textColor}" text-anchor="${rootLevel ? 'middle' : 'start'}">${esc(text)}</text>`;
    const hasImpl = Boolean(n.tag && !rootLevel);
    const implSvg = hasImpl
      ? `<rect x="${x + w - 42}" y="${y + 5}" width="38" height="16" rx="4" fill="#f1f4f8"/><text x="${x + w - 23}" y="${y + 17}" font-size="10" fill="#586274" text-anchor="middle">${esc(implShort(n.tag.impl))}</text>`
      : '';
    const editAttrs = n.tag
      ? `class="mind-node has-tag" data-mind-edit="${esc(n.tag.id)}" data-mind-path="${esc(n.path)}"`
      : `class="mind-node" data-mind-path="${esc(n.path)}"`;
    const main = `<g ${editAttrs}><title>${esc(n.path)}</title><rect x="${x}" y="${y}" width="${w}" height="${MIND_NODE_H}" rx="8" fill="${fill}" stroke="${color}" stroke-width="${rootLevel ? 0 : 1.5}"/>${labelSvg}${implSvg}</g>`;
    if (!n.tag) return main;

    const childX = x + w + 9;
    const childY = y - 3;
    const siblingX = x - 9;
    const siblingY = y + MIND_NODE_H + 8;
    const childAction = `<g class="mind-node-action mind-add-child" data-mind-add-child="${esc(n.path)}" transform="translate(${childX} ${childY})"><title>添加子标签</title><circle r="8" fill="#ffffff" stroke="${color}" stroke-width="1.2"/><path d="M -3.2 0 H 3.2 M 0 -3.2 V 3.2" stroke="${color}" stroke-width="1.6" stroke-linecap="round"/></g>`;
    const siblingAction = `<g class="mind-node-action mind-add-sibling" data-mind-add-sibling="${esc(n.path)}" transform="translate(${siblingX} ${siblingY})"><title>在下方插入同级标签</title><circle r="8" fill="#ffffff" stroke="${color}" stroke-width="1.2"/><path d="M 0 -3 L 0 3 M -2.4 0.6 L 0 3 L 2.4 0.6" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></g>`;
    return main + childAction + siblingAction;
  }).join('');

  const zw = Math.round(width * state.mindZoom);
  const zh = Math.round(height * state.mindZoom);
  return `<div class="mindmap-wrap"><svg id="mindmapSvg" class="mindmap" viewBox="0 0 ${width} ${height}" style="width:${zw}px;height:${zh}px" data-w="${width}" data-h="${height}" preserveAspectRatio="xMinYMin meet">${connectors.join('')}${nodeSvg}</svg></div>`;
}

function setMindZoom(z) {
  state.mindZoom = z;
  const svg = document.getElementById('mindmapSvg');
  const pct = document.getElementById('mindZoomPct');
  if (svg) {
    const w = Number(svg.dataset.w) || 1;
    const h = Number(svg.dataset.h) || 1;
    svg.style.width = Math.round(w * z) + 'px';
    svg.style.height = Math.round(h * z) + 'px';
  }
  if (pct) pct.textContent = Math.round(z * 100) + '%';
}

function renderBuilder(c) {
  const g = state.guide;
  const project = activeProject();
  const steps = ['顶层分类', '展开领域', '状态与事件', '实现位置', '完成'];
  const stepper = steps
    .map((s, i) => `<button class="step ${g.step === i + 1 ? 'active' : ''}" data-step="${i + 1}"><span class="step-num">${i + 1}</span>${s}</button>`)
    .join('');

  const items = g.items
    .map((it, idx) => {
      const isDomain = it.kind === 'domain';
      return `<div class="suggest-row">
        <span class="tag-path" title="${esc(it.tag)}">${esc(it.tag)}</span>
        <span class="tag-comment">${esc(it.comment || '')}</span>
        ${implBadge(it.impl)}
        ${isDomain ? `<button class="btn btn-sm" data-expand-domain="${esc(it.domain)}">展开</button>` : ''}
        <button class="btn btn-sm btn-primary" data-add-suggest="${idx}">${svg('plus')}添加</button>
      </div>`;
    })
    .join('');

  const chatHtml = state.chat
    .map((m) => {
      const items = m.items || [];
      const rows = items
        .map((it, idx) => `<div class="chat-suggest">
          <code>${esc(it.tag)}</code>
          ${implBadge(it.impl)}
          <button class="btn btn-sm btn-primary" data-add-chat="${m.i}:${idx}">${svg('plus')}</button>
        </div>`)
        .join('');
      const applyAll = m.role === 'assistant' && items.length
        ? `<div class="chat-apply"><button class="btn btn-sm btn-primary" data-apply-chat="${m.i}">${svg('check')}应用这套体系（${items.length}）</button></div>`
        : '';
      const preview = items.length
        ? `<details class="chat-preview"><summary>预览 ${items.length} 个标签</summary><div class="chat-suggests">${rows}</div></details>`
        : '';
      return `<div class="chat-msg ${m.role === 'user' ? 'user' : 'assistant'}${m.loading ? ' loading' : ''}">${esc(m.text)}${applyAll}${preview}</div>`;
    })
    .join('');

  const sidebarHtml = state.chatCollapsed
    ? `<aside class="chat-collapsed"><button class="btn btn-ghost" id="expandChatBtn" title="展开 AI 助手">${svg('chevron-left')}${svg('sparkles')}</button></aside>`
    : `<aside class="chat-sidebar">
        <div class="chat-header">
          <span>${svg('sparkles')}AI 助手</span>
          <div class="chat-header-actions">
            <button class="btn btn-ghost btn-sm" id="clearChatBtn" title="清空对话">${svg('trash')}</button>
            <button class="btn btn-ghost btn-sm" id="collapseChatBtn" title="折叠">${svg('chevron-right')}</button>
          </div>
        </div>
        <div class="chat-log" id="chatLog">
          ${chatHtml || '<div class="note">输入你的想法，比如“天气系统”“连招反馈”，助手会给出候选标签。</div>'}
        </div>
          <div class="chat-bar">
            <input id="chatInput" class="input" placeholder="例如：生成一套修仙标签体系…">
          <button class="btn btn-primary" id="chatSendBtn" title="发送" ${state.chatBusy ? 'disabled' : ''}>${svg('send')}</button>
        </div>
      </aside>`;

  c.innerHTML = `
    <div class="view view-builder">
      <div class="view-head">
        <div>
          <div class="view-title">引导搭建</div>
          <div class="view-sub">按题材与角色逐步搭出你的 GameplayTag 体系，随时可加入自己的想法。</div>
        </div>
        <div style="display:flex;gap:10px">
          <button class="btn btn-accent" id="generateAllBtn">${svg('sparkles')}一键生成完整体系</button>
          <button class="btn" id="resetGuideBtn">${svg('refresh')}重新开始</button>
        </div>
      </div>
      <div class="stepper">${stepper}</div>
      <div class="builder-layout${state.chatCollapsed ? ' collapsed' : ''}">
        <div class="builder-main">
          <div class="panel panel-pad">
            <div class="message"><strong>${esc(g.title)}</strong>\n\n${esc(g.message)}</div>
            ${items ? `<div class="suggest-list" style="margin-top:12px">${items}</div>` : ''}
            ${g.items.length ? `<div class="guide-actions"><button class="btn btn-sm" data-add-all-suggest>${svg('check')}全部添加</button><span class="note">${esc(g.hint || '')}</span></div>` : ''}
          </div>
          <div class="panel structure-panel${state.mindFullscreen ? ' fullscreen' : ''}">
            <div class="structure-head">
              <span class="structure-title">${svg('tag')}当前标签结构</span>
              <div class="structure-head-right">
                <button class="btn btn-sm btn-primary" id="addStructureTagBtn" title="手动添加标签">${svg('plus')}添加标签</button>
                <span class="note">${project ? project.tags.length : 0} 个标签</span>
                ${project && project.tags.length ? `<div class="mind-zoom">
                  <button class="btn btn-sm" id="mindZoomOut" title="缩小">${svg('zoom-out')}</button>
                  <span class="note zoom-pct" id="mindZoomPct" title="点击重置为 100%">${Math.round(state.mindZoom * 100)}%</span>
                  <button class="btn btn-sm" id="mindZoomIn" title="放大">${svg('zoom-in')}</button>
                </div>` : ''}
                <button class="btn btn-sm" id="mindFullscreen" title="${state.mindFullscreen ? '退出全屏' : '全屏'}">${svg(state.mindFullscreen ? 'minimize' : 'maximize')}</button>
              </div>
            </div>
            <div class="structure-body"${state.mindFullscreen ? '' : ` style="height:${state.structureHeight}px"`}>${renderTagMindmap(project)}</div>
            ${state.mindFullscreen ? '' : '<div class="structure-resize" id="structureResize" title="拖动调整高度"></div>'}
          </div>
        </div>
        ${sidebarHtml}
      </div>
    </div>`;
}

function buildTreeRows(project) {
  const q = state.search.trim().toLowerCase();
  const filtered = project.tags.filter((t) => !q || t.path.toLowerCase().includes(q) || (t.comment || '').toLowerCase().includes(q));
  const collapsed = [...state.collapsed];
  const visible = filtered.filter((t) => !collapsed.some((p) => t.path.startsWith(p + '.')));
  return visible.map((t) => {
    const depth = t.path.split('.').length - 1;
    const seg = t.path.split('.').pop();
    const hasChildren = project.tags.some((o) => o.id !== t.id && o.path.startsWith(t.path + '.'));
    const isCollapsed = state.collapsed.has(t.path);
    const implOptions = state.meta.impl.map((i) => `<option value="${i.key}" ${i.key === t.impl ? 'selected' : ''}>${esc(i.short)}</option>`).join('');
    return `<div class="tree-row">
      <button class="tree-toggle" data-toggle="${esc(t.path)}" ${hasChildren ? '' : 'style="visibility:hidden"'}>${svg(isCollapsed ? 'chevron-right' : 'chevron-down')}</button>
      <span class="tree-label" style="padding-left:${depth * 16}px" title="${esc(t.path)}">${esc(t.comment || seg)}</span>
      <span class="tree-comment">${esc(t.path)}</span>
      <select class="impl-select" data-impl="${esc(t.id)}">${implOptions}</select>
      <span class="tree-actions">
        <button class="btn btn-sm btn-ghost" data-edit-tag="${esc(t.id)}" title="编辑">${svg('edit')}</button>
        <button class="btn btn-sm btn-ghost" data-del-tag="${esc(t.id)}" title="删除">${svg('trash')}</button>
      </span>
    </div>`;
  }).join('');
}

function renderTags(c) {
  const project = activeProject();
  if (!project) return (c.innerHTML = '<div class="view"><div class="empty">先新建一个标签包</div></div>');
  c.innerHTML = `
    <div class="view">
      <div class="view-head">
        <div>
          <div class="view-title">标签管理</div>
          <div class="view-sub">模块化增删改、折叠层级、标记每个标签的实现位置。</div>
        </div>
        <div style="display:flex;gap:10px">
          <button class="btn" id="addRootTagBtn">${svg('plus')}添加大类</button>
          <button class="btn btn-primary" id="addTagBtn">${svg('plus')}添加标签</button>
        </div>
      </div>
      <div class="toolbar">
        <div style="position:relative;flex:1;max-width:360px">${svg('search').replace('<svg', '<svg style="position:absolute;left:9px;top:9px;width:16px;height:16px;color:#8d97a5"')}<input id="tagSearch" class="input" style="padding-left:32px;width:100%" placeholder="搜索标签路径或注释" value="${esc(state.search)}"></div>
        <span class="note">${project.tags.length} 个标签</span>
      </div>
      <div class="panel tree">${buildTreeRows(project) || '<div class="empty">还没有标签，去“搭建”页或点击“添加标签”。</div>'}</div>
    </div>`;
}

async function renderDoc(c) {
  const project = activeProject();
  if (!project) return (c.innerHTML = '<div class="view"><div class="empty">先新建一个标签包</div></div>');
  c.innerHTML = `<div class="view"><div class="view-head">
    <div><div class="view-title">使用文档</div><div class="view-sub">按实现位置说明每个标签应落到 GE / GA / GC / AttributeSet / Component。</div></div>
    <div style="display:flex;gap:10px">
      <button class="btn" id="dlMdBtn">${svg('download')}Markdown</button>
      <button class="btn" id="dlHtmlBtn">${svg('download')}HTML</button>
    </div>
  </div><div class="panel" style="overflow:hidden"><iframe id="docFrame" style="width:100%;height:calc(100vh - 220px);border:0"></iframe></div></div>`;
  const html = await api('GET', `/api/projects/${project.id}/usage-doc?format=html`);
  $('#docFrame').srcdoc = html;
}

function renderMarket(c) {
  const items = state.marketplace
    .map((p) => {
      const owned = state.projects.some((x) => x.id === p.id);
      const price = p.price > 0 ? `<span class="badge badge-paid">¥${Number(p.price).toFixed(2)}</span>` : '<span class="badge badge-free">免费参考</span>';
      return `<div class="market-item">
        <div class="market-main">
          <div class="market-name">${esc(p.name)}</div>
          <div class="market-desc">${esc(p.description || '')}</div>
          <div class="market-meta">
            <span class="badge badge-tag">${esc(p.genreName || p.genre)}</span>
            <span class="badge badge-tag">${esc(p.roleName || p.role)}</span>
            <span class="note">${p.tagCount} 个标签 · ${esc(p.author || '匿名')}</span>
            ${price}
          </div>
        </div>
        <button class="btn btn-primary" data-import="${esc(p.id)}" ${owned ? 'disabled' : ''}>${svg('download')}导入</button>
      </div>`;
    })
    .join('');

  c.innerHTML = `
    <div class="view">
      <div class="view-head">
        <div>
          <div class="view-title">市场</div>
          <div class="view-sub">参考他人标签包，或把当前标签包发布出去。</div>
        </div>
        <button class="btn btn-accent" id="publishFromMarketBtn">${svg('upload')}发布当前标签包</button>
      </div>
      <div class="market-list">${items || '<div class="empty">市场还没有内容</div>'}</div>
      <div class="note" style="margin-top:18px">付费下载当前为演示占位：价格会保存，但真实支付需要接入支付服务商与账号鉴权。</div>
    </div>`;
}

function showModal(html) {
  const backdrop = $('#modalBackdrop');
  backdrop.innerHTML = `<div class="modal">${html}</div>`;
  backdrop.hidden = false;
  return backdrop;
}

function closeModal() {
  $('#modalBackdrop').hidden = true;
  $('#modalBackdrop').innerHTML = '';
}

function showAddTagModal(prefill = {}) {
  const implOptions = state.meta.impl.map((i) => `<option value="${i.key}" ${i.key === (prefill.impl || 'tag') ? 'selected' : ''}>${esc(i.name)}</option>`).join('');
  showModal(`
    <h3>${prefill.id ? '编辑标签' : '添加标签'}</h3>
    <div class="field"><span class="label">标签路径（层级用 . 分隔，例如 Inventory.Weapon.Sword）</span><input id="fPath" class="input" value="${esc(prefill.path || '')}" placeholder="Domain.Sub.Tag"></div>
    <div class="field"><span class="label">注释</span><input id="fComment" class="input" value="${esc(prefill.comment || '')}" placeholder="可选说明"></div>
    <div class="field"><span class="label">实现位置</span><select id="fImpl" class="select">${implOptions}</select></div>
    <div class="field"><span class="label">补充说明</span><input id="fNotes" class="input" value="${esc(prefill.notes || '')}" placeholder="可选"></div>
    <div class="modal-actions">
      <button class="btn" id="cancelModalBtn">取消</button>
      <button class="btn btn-primary" id="saveTagBtn">${svg('check')}保存</button>
    </div>`);
  $('#cancelModalBtn').onclick = closeModal;
  $('#saveTagBtn').onclick = async () => {
    const pathValue = $('#fPath').value.trim();
    if (!TAG_RE.test(pathValue)) return toast('标签路径不合法：需以字母开头，仅含字母/数字/下划线/点，且不能有空段');
    const payload = {
      path: pathValue,
      comment: $('#fComment').value.trim(),
      impl: $('#fImpl').value,
      notes: $('#fNotes').value.trim(),
    };
    try {
      if (prefill.id) {
        await api('PATCH', `/api/projects/${state.activeProjectId}/tags/${prefill.id}`, payload);
      } else {
        await api('POST', `/api/projects/${state.activeProjectId}/tags`, { tags: [payload] });
      }
      closeModal();
      await loadBootstrap();
      renderShell();
      toast('已保存');
    } catch (e) {
      toast(e.message);
    }
  };
}

async function showSettingsModal() {
  let current = { baseUrl: '', model: '', hasApiKey: false };
  try {
    current = await api('GET', '/api/settings');
  } catch {}

  showModal(`
    <h3>API 设置</h3>
    <div class="field"><span class="label">API 地址（OpenAI 兼容）</span><input id="apiBaseUrl" class="input" value="${esc(current.baseUrl)}" placeholder="https://api.deepseek.com/v1"></div>
    <div class="field"><span class="label">模型名称</span><input id="apiModel" class="input" value="${esc(current.model)}" placeholder="deepseek-chat"></div>
    <div class="field"><span class="label">API Key</span><input id="apiKey" class="input" type="password" value="" placeholder="${current.hasApiKey ? '已保存，留空则不修改' : 'sk-...'}"></div>
    ${current.hasApiKey ? '<div class="field"><label class="checkbox"><input id="apiClearKey" type="checkbox"> 清除已保存的 API Key</label></div>' : ''}
    <div class="note">Key 只保存在本项目的 data/db.json，不会上传到云端。支持 DeepSeek、OpenAI 及其他 OpenAI 兼容接口。</div>
    <div class="modal-actions">
      <button class="btn" id="cancelSettingsBtn">取消</button>
      <button class="btn btn-primary" id="saveSettingsBtn">${svg('check')}保存</button>
    </div>`);

  $('#cancelSettingsBtn').onclick = closeModal;
  $('#saveSettingsBtn').onclick = async () => {
    const payload = {
      baseUrl: $('#apiBaseUrl').value.trim(),
      model: $('#apiModel').value.trim(),
    };
    const key = $('#apiKey').value.trim();
    if (key) payload.apiKey = key;
    const clear = $('#apiClearKey');
    if (clear && clear.checked) payload.clearApiKey = true;
    try {
      await api('POST', '/api/settings', payload);
      closeModal();
      await loadBootstrap();
      renderShell();
      toast('API 设置已保存');
    } catch (e) {
      toast(e.message);
    }
  };
}

function showPublishModal() {
  const project = activeProject();
  if (!project) return toast('先新建一个标签包');
  showModal(`
    <h3>发布标签包</h3>
    <div class="field"><span class="label">名称</span><input id="pName" class="input" value="${esc(project.name)}"></div>
    <div class="field"><span class="label">简介</span><textarea id="pDesc" class="textarea">${esc(project.description || '')}</textarea></div>
    <div class="field"><span class="label">价格（0 = 免费参考）</span><input id="pPrice" class="input" type="number" min="0" step="0.01" value="${project.price || 0}"></div>
    <div class="modal-actions">
      <button class="btn" id="cancelPubBtn">取消</button>
      <button class="btn btn-accent" id="doPubBtn">${svg('cloud')}发布</button>
    </div>`);
  $('#cancelPubBtn').onclick = closeModal;
  $('#doPubBtn').onclick = async () => {
    const name = $('#pName').value.trim();
    const desc = $('#pDesc').value.trim();
    const price = Math.max(0, Number($('#pPrice').value || 0));
    try {
      await api('PATCH', `/api/projects/${project.id}`, { name, description: desc, price });
      await api('POST', `/api/projects/${project.id}/publish`, { price });
      closeModal();
      await loadBootstrap();
      renderShell();
      toast('已发布到市场');
    } catch (e) {
      toast(e.message);
    }
  };
}

function showNewProjectModal() {
  const genreOptions = state.meta.genres.map((g) => `<option value="${g.key}">${esc(g.name)}</option>`).join('');
  const roleOptions = state.meta.roles.map((r) => `<option value="${r.key}">${esc(r.name)}</option>`).join('');
  showModal(`
    <h3>新建标签包</h3>
    <div class="field"><span class="label">名称</span><input id="npName" class="input" placeholder="例如：武侠战斗标签"></div>
    <div class="field"><span class="label">题材</span><select id="npGenre" class="select">${genreOptions}</select></div>
    <div class="field"><span class="label">角色视角</span><select id="npRole" class="select">${roleOptions}</select></div>
    <div class="modal-actions">
      <button class="btn" id="cancelNpBtn">取消</button>
      <button class="btn btn-primary" id="doNpBtn">${svg('plus')}创建</button>
    </div>`);
  $('#cancelNpBtn').onclick = closeModal;
  $('#doNpBtn').onclick = async () => {
    const name = $('#npName').value.trim() || '未命名标签包';
    try {
      const p = await api('POST', '/api/projects', { name, genre: $('#npGenre').value, role: $('#npRole').value });
      closeModal();
      state.activeProjectId = p.id;
      state.guide = { step: 1, domainKey: null, title: '', message: '', items: [], hint: '' };
      state.chat = [];
      state.view = 'builder';
      await loadBootstrap();
      await loadGuideStep(1, null);
      renderShell();
    } catch (e) {
      toast(e.message);
    }
  };
}

async function loadGuideStep(step, domainKey) {
  const project = activeProject();
  const g = await api('POST', '/api/guide/step', { genre: project ? project.genre : 'survival', role: project ? project.role : 'designer', step, domainKey });
  state.guide = { step, domainKey, title: g.title, message: g.message, items: g.items, hint: g.hint };
  renderShell();
}

async function addSuggestItems(items) {
  const project = activeProject();
  if (!project || !items.length) return;
  try {
    const res = await api('POST', `/api/projects/${project.id}/tags`, { tags: items.map((it) => ({ path: it.tag, comment: it.comment, impl: it.impl })) });
    await loadBootstrap();
    renderShell();
    toast(`已添加 ${res.added.length} 个标签`);
  } catch (e) {
    toast(e.message);
  }
}

function bindEvents() {
  let mindDragMoved = false;

  document.addEventListener('click', async (e) => {
    if (!mindDragMoved) {
      const addMindChild = e.target.closest('[data-mind-add-child]');
      if (addMindChild) {
        showAddTagModal({ path: addMindChild.dataset.mindAddChild + '.' });
        return;
      }
      const addMindSibling = e.target.closest('[data-mind-add-sibling]');
      if (addMindSibling) {
        const p = addMindSibling.dataset.mindAddSibling;
        showAddTagModal({ path: parentPath(p) ? parentPath(p) + '.' : '' });
        return;
      }
    }

    const mindEdit = e.target.closest('[data-mind-edit]');
    if (mindEdit && !mindDragMoved) {
      const project = activeProject();
      const t = project && project.tags.find((x) => x.id === mindEdit.dataset.mindEdit);
      if (t) showAddTagModal({ id: t.id, path: t.path, comment: t.comment, impl: t.impl, notes: t.notes });
      return;
    }

    const nav = e.target.closest('[data-nav]');
    if (nav) {
      state.view = nav.dataset.nav;
      if (state.view === 'doc') { renderShell(); }
      else if (state.view === 'builder' && !state.guide.title) { await loadGuideStep(1, null); }
      else renderShell();
      return;
    }

    const stepBtn = e.target.closest('[data-step]');
    if (stepBtn) { await loadGuideStep(Number(stepBtn.dataset.step), state.guide.domainKey); return; }

    const expand = e.target.closest('[data-expand-domain]');
    if (expand) { await loadGuideStep(2, expand.dataset.expandDomain); return; }

    const addSuggest = e.target.closest('[data-add-suggest]');
    if (addSuggest) {
      const it = state.guide.items[Number(addSuggest.dataset.addSuggest)];
      await addSuggestItems(it ? [it] : []);
      return;
    }

    const addAll = e.target.closest('[data-add-all-suggest]');
    if (addAll) { await addSuggestItems(state.guide.items); return; }

    const addChat = e.target.closest('[data-add-chat]');
    if (addChat) {
      const [mi, ii] = addChat.dataset.addChat.split(':').map(Number);
      const msg = state.chat.find((m) => m.i === mi);
      const it = msg && msg.items[Number(ii)];
      await addSuggestItems(it ? [it] : []);
      return;
    }

    const applyChat = e.target.closest('[data-apply-chat]');
    if (applyChat) {
      const msg = state.chat.find((m) => m.i === Number(applyChat.dataset.applyChat));
      if (msg) await addSuggestItems(msg.items);
      return;
    }

    if (e.target.closest('#resetGuideBtn')) {
      const project = activeProject();
      if (!project) return;
      if (!project.tags.length) {
        state.chat = [];
        state.collapsed = new Set();
        state.mindZoom = 1;
        await loadGuideStep(1, null);
        return;
      }
      if (!confirm('重新开始会清空当前标签包的所有标签，确定吗？')) return;
      try {
        await api('DELETE', `/api/projects/${project.id}/tags`);
        state.chat = [];
        state.collapsed = new Set();
        state.mindZoom = 1;
        await loadBootstrap();
        await loadGuideStep(1, null);
        toast('已清空，重新开始');
      } catch (e) {
        toast(e.message);
      }
      return;
    }

    if (e.target.closest('#clearChatBtn')) {
      state.chat = [];
      renderShell();
      return;
    }

    if (e.target.closest('#collapseChatBtn')) {
      state.chatCollapsed = true;
      renderShell();
      return;
    }

    if (e.target.closest('#expandChatBtn')) {
      state.chatCollapsed = false;
      renderShell();
      return;
    }

    if (e.target.closest('#mindZoomIn')) {
      setMindZoom(Math.min(3, +(state.mindZoom + 0.25).toFixed(2)));
      return;
    }

    if (e.target.closest('#mindZoomOut')) {
      setMindZoom(Math.max(0.25, +(state.mindZoom - 0.25).toFixed(2)));
      return;
    }

    if (e.target.closest('#mindZoomPct')) {
      setMindZoom(1);
      return;
    }

    if (e.target.closest('#mindFullscreen')) {
      state.mindFullscreen = !state.mindFullscreen;
      renderShell();
      return;
    }

    if (e.target.closest('#generateAllBtn')) {
      const project = activeProject();
      if (!project) return;
      if (state.meta.llmAvailable) {
        try {
          const g = await api('POST', `/api/projects/${project.id}/generate-ai`);
          if (g && g.items && g.items.length) {
            state.chatCollapsed = false;
            state.chat.push({
              i: state.chat.length,
              role: 'assistant',
              text: g.reply || 'AI 已生成候选标签体系，请确认后应用。',
              items: g.items,
            });
            renderShell();
            toast('AI 已生成候选体系，请在右侧确认应用');
            return;
          }
        } catch (err) {
          toast(`AI 生成失败，已回退到本地模板：${err.message}`);
        }
      }
      try {
        const res = await api('POST', `/api/projects/${project.id}/generate`);
        await loadBootstrap();
        renderShell();
        toast(`已生成完整体系，新增 ${res.added.length} 个标签`);
      } catch (e) {
        toast(e.message);
      }
      return;
    }

    if (e.target.closest('#addTagBtn') || e.target.closest('#addStructureTagBtn') || e.target.closest('#addRootTagBtn')) { showAddTagModal(); return; }

    const editTag = e.target.closest('[data-edit-tag]');
    if (editTag) {
      const project = activeProject();
      const t = project.tags.find((x) => x.id === editTag.dataset.editTag);
      if (t) showAddTagModal({ id: t.id, path: t.path, comment: t.comment, impl: t.impl, notes: t.notes });
      return;
    }

    const delTag = e.target.closest('[data-del-tag]');
    if (delTag) {
      const project = activeProject();
      const t = project.tags.find((x) => x.id === delTag.dataset.delTag);
      if (t && confirm(`删除「${t.path}」及其子标签？`)) {
        await api('DELETE', `/api/projects/${project.id}/tags/${t.id}`);
        await loadBootstrap();
        renderShell();
        toast('已删除');
      }
      return;
    }

    const toggle = e.target.closest('[data-toggle]');
    if (toggle) {
      const p = toggle.dataset.toggle;
      if (state.collapsed.has(p)) state.collapsed.delete(p);
      else state.collapsed.add(p);
      renderShell();
      return;
    }

    if (e.target.closest('#dlMdBtn') || e.target.closest('#dlHtmlBtn')) {
      const project = activeProject();
      const md = e.target.closest('#dlMdBtn');
      const text = await api('GET', `/api/projects/${project.id}/usage-doc?format=${md ? 'md' : 'html'}`);
      download(`usage-doc.${md ? 'md' : 'html'}`, text, md ? 'text/markdown' : 'text/html');
      return;
    }

    const imp = e.target.closest('[data-import]');
    if (imp) {
      const p = await api('POST', `/api/import/${imp.dataset.import}`);
      state.activeProjectId = p.id;
      await loadBootstrap();
      renderShell();
      toast('已导入到你的标签包');
      return;
    }

    if (e.target.closest('#publishBtn') || e.target.closest('#publishFromMarketBtn')) { showPublishModal(); return; }
    if (e.target.closest('#newProjectBtn')) { showNewProjectModal(); return; }
    if (e.target.closest('#settingsBtn')) { showSettingsModal(); return; }

    const exportItem = e.target.closest('[data-export]');
    if (exportItem) {
      const project = activeProject();
      const text = await api('GET', `/api/projects/${project.id}/export?format=${exportItem.dataset.export}`);
      const names = { ini: 'DefaultGameplayTags.ini', csv: 'GameplayTags.csv', json: 'GameplayTags.json', cpp: 'GameplayTags.cpp' };
      download(names[exportItem.dataset.export], text, 'text/plain');
      return;
    }
  });

  document.addEventListener('change', async (e) => {
    const project = activeProject();
    if (!project) return;
    if (e.target.id === 'projectSelect') {
      state.activeProjectId = e.target.value;
      state.collapsed = new Set();
      state.search = '';
      state.chat = [];
      await loadGuideStep(1, null);
      return;
    }
    if (e.target.id === 'genreSelect' || e.target.id === 'roleSelect') {
      const patch = e.target.id === 'genreSelect' ? { genre: e.target.value } : { role: e.target.value };
      await api('PATCH', `/api/projects/${project.id}`, patch);
      await loadBootstrap();
      await loadGuideStep(1, null);
      return;
    }
    const impl = e.target.closest('[data-impl]');
    if (impl) {
      await api('PATCH', `/api/projects/${project.id}/tags/${impl.dataset.impl}`, { impl: impl.value });
      await loadBootstrap();
      renderShell();
      return;
    }
  });

  document.addEventListener('input', (e) => {
    if (e.target.id === 'tagSearch') {
      state.search = e.target.value;
      clearTimeout(state._s);
      state._s = setTimeout(renderShell, 180);
    }
  });

  document.addEventListener('keydown', async (e) => {
    if (e.target.id === 'chatInput' && e.key === 'Enter') {
      e.preventDefault();
      await sendChat();
    }
    if (e.key === 'Escape') closeModal();
  });

  document.addEventListener('click', (e) => {
    if (e.target.closest('#chatSendBtn')) sendChat();
    const menu = $('#exportMenu');
    if (!e.target.closest('#exportDropdown')) menu.innerHTML = '';
  });

  let pan = null;
  document.addEventListener('mousedown', (e) => {
    const body = e.target.closest('.structure-body');
    if (!body) return;
    mindDragMoved = false;
    pan = { x: e.clientX, y: e.clientY, left: body.scrollLeft, top: body.scrollTop, moved: false };
    body.classList.add('dragging');
  });
  document.addEventListener('mousedown', (e) => {
    const handle = e.target.closest('#structureResize');
    if (!handle) return;
    e.preventDefault();
    const body = handle.previousElementSibling;
    if (!body) return;
    const startY = e.clientY;
    const startH = body.offsetHeight;
    const onMove = (ev) => {
      state.structureHeight = Math.max(200, startH + (ev.clientY - startY));
      body.style.height = state.structureHeight + 'px';
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });

  document.addEventListener('mousemove', (e) => {
    if (!pan) return;
    const body = document.querySelector('.structure-body');
    if (!body) return;
    if (!pan.moved && (Math.abs(e.clientX - pan.x) > 4 || Math.abs(e.clientY - pan.y) > 4)) {
      pan.moved = true;
      mindDragMoved = true;
    }
    body.scrollLeft = pan.left - (e.clientX - pan.x);
    body.scrollTop = pan.top - (e.clientY - pan.y);
  });
  const endPan = () => {
    if (!pan) return;
    pan = null;
    const body = document.querySelector('.structure-body');
    if (body) body.classList.remove('dragging');
  };
  document.addEventListener('mouseup', endPan);
  window.addEventListener('blur', endPan);
  document.addEventListener('wheel', (e) => {
    const body = e.target.closest('.structure-body');
    if (!body || !e.ctrlKey) return;
    e.preventDefault();
    const rect = body.getBoundingClientRect();
    const mx = e.clientX - rect.left + body.scrollLeft;
    const my = e.clientY - rect.top + body.scrollTop;
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    const next = Math.min(3, Math.max(0.25, +(state.mindZoom + delta).toFixed(2)));
    if (next === state.mindZoom) return;
    const ratio = next / state.mindZoom;
    setMindZoom(next);
    body.scrollLeft = mx * ratio - (e.clientX - rect.left);
    body.scrollTop = my * ratio - (e.clientY - rect.top);
  }, { passive: false });

  $('#exportBtn').onclick = (e) => {
    e.stopPropagation();
    const menu = $('#exportMenu');
    const open = menu.innerHTML !== '';
    if (open) { menu.innerHTML = ''; return; }
    menu.innerHTML = ['ini', 'csv', 'json', 'cpp']
      .map((f) => `<button data-export="${f}">${svg('download')}${f.toUpperCase()}</button>`)
      .join('');
  };
}

async function sendChat() {
  if (state.chatBusy) return;
  const input = $('#chatInput');
  const message = input.value.trim();
  if (!message) return;
  const project = activeProject();
  if (!project) { toast('请先新建或选择一个标签包'); return; }
  input.value = '';
  state.chatBusy = true;
  const userMsg = { i: state.chat.length, role: 'user', text: message, items: [] };
  state.chat.push(userMsg);
  const loadingId = state.chat.length;
  state.chat.push({ i: loadingId, role: 'assistant', text: '正在结合当前标签结构思考…', items: [], loading: true });
  renderShell();
  try {
    const r = await api('POST', '/api/guide/chat', {
      genre: project.genre,
      role: project.role,
      message,
      existingTags: project.tags.map((t) => ({ path: t.path, comment: t.comment, impl: t.impl })),
    });
    const idx = state.chat.findIndex((m) => m.i === loadingId);
    state.chat[idx] = { i: loadingId, role: 'assistant', text: r.reply, items: r.items };
  } catch {
    const idx = state.chat.findIndex((m) => m.i === loadingId);
    state.chat[idx] = { i: loadingId, role: 'assistant', text: '暂时无法回应，请稍后再试。', items: [] };
  } finally {
    state.chatBusy = false;
  }
  renderShell();
  const log = $('#chatLog');
  if (log) log.scrollTop = log.scrollHeight;
}

function download(filename, text, type) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

async function init() {
  await loadBootstrap();
  await loadGuideStep(1, null);
  renderShell();
  bindEvents();
}

init().catch((e) => {
  document.body.innerHTML = `<div style="padding:40px;font-family:system-ui">加载失败：${esc(e.message)}</div>`;
});
