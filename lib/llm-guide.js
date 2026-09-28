'use strict';

// Prompt engineering for the GameplayTag assistant. Keeping it in its own
// module makes the rules easy to test without starting the HTTP server.
const { GENRES, ROLES, IMPL } = require('./guidance');
const { validateTag } = require('./export');

function domainLine(d) {
  return `${d.key}（${d.name}）：${d.intro}`;
}

function tagLine(t) {
  return `${t.tag}（${t.comment || ''}）`;
}

function buildGenreContext(genreKey) {
  const g = GENRES[genreKey] || GENRES.survival;
  const lines = [];
  lines.push(`题材：${g.name}。${g.intro}`);
  lines.push('建议一级领域：');
  lines.push(g.domains.map(domainLine).join('\n'));
  lines.push('该题材常见状态标签（供参考，可扩展）：' + g.states.map(tagLine).join('，'));
  lines.push('该题材常见事件标签（供参考，可扩展）：' + g.events.map(tagLine).join('，'));
  return lines.join('\n');
}

function buildRoleContext(roleKey) {
  const r = ROLES[roleKey] || ROLES.designer;
  let text = `角色视角：${r.name}。${r.lens}`;
  if (Array.isArray(r.extraTags) && r.extraTags.length) {
    text += '\n该角色常补充标签：' + r.extraTags.map(tagLine).join('，');
  }
  return text;
}

function buildExistingTags(existingTags) {
  const list = Array.isArray(existingTags) ? existingTags : [];
  if (!list.length) return '当前标签：空（尚无标签，可生成完整体系）。';
  const max = 180;
  const rows = list.slice(0, max).map((t) => {
    const pathValue = t && typeof t.path === 'string' ? t.path : '';
    const comment = t && typeof t.comment === 'string' ? t.comment : '';
    const impl = t && typeof t.impl === 'string' ? t.impl : 'tag';
    return `${pathValue}（${comment}，impl=${impl}）`;
  });
  if (list.length > max) rows.push(`……还有 ${list.length - max} 个标签未列出。`);
  return `当前已有 ${list.length} 个标签。不要重复生成同路径；请在其层级上扩展、补漏，或给出重构建议：\n${rows.join('\n')}`;
}

function buildSystemPrompt(genreKey, roleKey, existingTags) {
  const implEnum = Object.values(IMPL).map((v) => v.key).join('|');
  return `你是资深 UE5 玩法系统设计师，也是 GameplayTag 架构师。你的目标不是堆砌名词，而是把用户的玩法概念翻译成一套可导入 UE5 的、层级稳定、可扩展、能明确落到实现位置的 GameplayTag 体系。

# GameplayTag 设计准则
1. 先判断这个标签回答哪类问题，再选择 impl：
   - 是什么（对象/类型/身份/分类）→ tag
   - 数值是多少（生命、法力、体力、攻击力等）→ attribute（落到 AttributeSet）
   - 处于什么状态（燃烧、中毒、减速等）→ ge（GameplayEffect 效果/持续状态）
   - 发生什么行为（攻击、施法、交互、移动等）→ ga（GameplayAbility）
   - 如何表现（特效、音效、镜头、UI 反馈）→ gc（GameplayCue）
   - 需要持续 tick、复杂状态机或独立逻辑 → component（ActorComponent）
2. 层级要稳定：第一层用领域名词，例如 Character、Combat、Item、Ability、Status、Event、UI；不要让孤立动作当根节点，也不要出现空泛叶子（如 Status.None）。
3. 同类成组，属性/状态/事件/能力/表现/数据标签分开；标签路径用英文 PascalCase，段与段用点分隔。
4. comment 是给中文用户看的名称，2~8 个汉字；impl 只能从 ${implEnum} 中选择。
5. 结合题材和角色视角，先搭骨架再补叶子；已有标签不要重复，可以在其层级下扩展，也可以指出缺漏。

# 当前上下文
${buildGenreContext(genreKey)}

${buildRoleContext(roleKey)}

${buildExistingTags(existingTags)}

# 输出格式
只输出一个合法 JSON 对象，不要 Markdown 代码块，不要任何前后缀：
{"reply":"用 2~4 句中文说明你的分类思路、这次新增/调整了什么、为什么这样落位","tags":[{"tag":"Combat.Attack","comment":"攻击","impl":"ga"}]}

# 数量规则
- “生成完整体系 / 整套标签 / 一键生成”类请求：输出 30~50 个标签，至少 6 个一级领域，覆盖 attribute、ge、ga、gc、component、tag。
- 局部补充或修改：输出 5~15 个最相关标签，优先复用已有层级。
- 很笼统的题材请求（如“生存 / 武侠 / 西幻 / 科幻”）：直接输出该题材的完整体系。
- 不要输出重复路径；如认为某现有标签应改名，只在 reply 中说明，不放进 tags。`;
}

function buildUserMessage(genreKey, roleKey, message) {
  const genre = GENRES[genreKey] || GENRES.survival;
  const role = ROLES[roleKey] || ROLES.designer;
  return `当前项目题材：${genre.name}；角色视角：${role.name}\n用户需求：${message || '请生成一套完整的标签体系'}`;
}

function extractJsonObject(text) {
  let s = String(text || '').trim();
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) s = fence[1].trim();
  const start = s.indexOf('{');
  const end = s.lastIndexOf('}');
  if (start < 0 || end <= start) return null;
  const body = s.slice(start, end + 1);
  try {
    return JSON.parse(body);
  } catch {}
  try {
    const cleaned = body
      .replace(/\/\/[^\n]*/g, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/,(\s*[}\]])/g, '$1');
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

function parseLlmResponse(text, genreKey, roleKey) {
  const parsed = extractJsonObject(text);
  if (!parsed) return null;
  const tags = Array.isArray(parsed.tags) ? parsed.tags : [];
  const seen = new Set();
  const items = [];
  for (const t of tags) {
    if (!t || typeof t.tag !== 'string') continue;
    const pathValue = t.tag.trim();
    if (!validateTag(pathValue) || seen.has(pathValue)) continue;
    seen.add(pathValue);
    items.push({
      tag: pathValue,
      comment: String(t.comment || '').trim().slice(0, 20),
      impl: IMPL[t.impl] ? t.impl : 'tag',
    });
  }
  if (!items.length) return null;

  const genreName = GENRES[genreKey] ? GENRES[genreKey].name : genreKey;
  const roleName = ROLES[roleKey] ? ROLES[roleKey].name : roleKey;
  const reply =
    typeof parsed.reply === 'string' && parsed.reply.trim()
      ? parsed.reply.trim()
      : `已按${genreName}题材（${roleName}视角）生成 ${items.length} 个标签，可按需要继续补充或修改。`;
  return { reply, items };
}

module.exports = { buildSystemPrompt, buildUserMessage, extractJsonObject, parseLlmResponse };
