'use strict';

const { IMPL } = require('./guidance');

const IMPL_MEANING = {
  ge: 'GameplayEffect（GE）：数值变化、增益/减益、持续状态。用数据驱动，避免硬编码。',
  ga: 'GameplayAbility（GA）：主动行为与技能，如攻击、施法、交互。由 AbilitySystemComponent 授予与触发。',
  gc: 'GameplayCue（GC）：表现层反馈，如 VFX、SFX、镜头震动。只负责表现，不承载逻辑。',
  attribute: 'AttributeSet：核心属性，如生命、法力、体力。由 ASC 管理并参与复制的数值。',
  component: 'ActorComponent：需要持续 tick、复杂状态机或独立行为时，单独做成组件。',
  tag: '数据标签：仅用于匹配、分类与规则查询，不单独实现。',
};

function groupByImpl(tags) {
  const groups = {};
  for (const t of tags || []) {
    const key = IMPL[t.impl] ? t.impl : 'tag';
    (groups[key] = groups[key] || []).push(t);
  }
  return groups;
}

function renderHtml(project) {
  const groups = groupByImpl(project.tags);
  const order = ['attribute', 'ge', 'ga', 'gc', 'component', 'tag'];
  const sections = order
    .filter((k) => groups[k] && groups[k].length)
    .map((k) => {
      const rows = groups[k]
        .map((t) => `<li><code>${escapeHtml(t.path)}</code>${t.comment ? ' — ' + escapeHtml(t.comment) : ''}</li>`)
        .join('');
      return `<section><h2>${IMPL[k].name}</h2><p>${IMPL_MEANING[k]}</p><ul>${rows}</ul></section>`;
    })
    .join('');

  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>${escapeHtml(project.name)} 使用文档</title>
<style>body{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;max-width:820px;margin:32px auto;padding:0 20px;color:#1f2430;line-height:1.6}h1{font-size:24px}h2{font-size:18px;margin-top:28px}code{background:#eef1f6;padding:1px 6px;border-radius:4px;font-size:13px}ul{padding-left:22px}li{margin:4px 0}.muted{color:#6b7280}</style></head><body>
<h1>${escapeHtml(project.name)} · 使用文档</h1>
<p class="muted">题材：${escapeHtml(project.genreName || project.genre)} · 角色视角：${escapeHtml(project.roleName || project.role)}</p>
<p>${escapeHtml(project.description || '')}</p>
${sections}
</body></html>`;
}

function renderMarkdown(project) {
  const groups = groupByImpl(project.tags);
  const order = ['attribute', 'ge', 'ga', 'gc', 'component', 'tag'];
  const lines = [
    `# ${project.name} 使用文档`,
    '',
    `> 题材：${project.genreName || project.genre} · 角色视角：${project.roleName || project.role}`,
    '',
    project.description || '',
    '',
  ];
  for (const k of order) {
    if (!groups[k] || !groups[k].length) continue;
    lines.push(`## ${IMPL[k].name}`, '', IMPL_MEANING[k], '');
    for (const t of groups[k]) {
      lines.push(`- \`${t.path}\`${t.comment ? ' — ' + t.comment : ''}`);
    }
    lines.push('');
  }
  return lines.join('\n');
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

module.exports = { renderHtml, renderMarkdown };
