'use strict';

const TAG_RE = /^[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z][A-Za-z0-9_]*)*$/;

function validateTag(tag) {
  return typeof tag === 'string' && tag.length > 0 && TAG_RE.test(tag);
}

function uniqueName(tag, used) {
  const base = tag.replace(/\./g, '_');
  let name = base;
  let i = 2;
  while (used.has(name)) name = `${base}_${i++}`;
  used.add(name);
  return name;
}

function escapeIni(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function renderIni(tags) {
  const lines = ['[/Script/GameplayTags.GameplayTagsSettings]'];
  for (const t of tags) {
    lines.push(`+GameplayTagList=(Tag="${t.path}",DevComment="${escapeIni(t.comment || '')}")`);
  }
  return lines.join('\n') + '\n';
}

function renderCsv(tags) {
  const used = new Set();
  const rows = [['Name', 'Tag', 'DevComment']];
  for (const t of tags) {
    rows.push([uniqueName(t.path, used), t.path, t.comment || '']);
  }
  return rows
    .map((r) => r.map(csvCell).join(','))
    .join('\n') + '\n';
}

function csvCell(value) {
  const s = String(value);
  return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

function renderJson(tags) {
  const used = new Set();
  const rows = tags.map((t) => ({
    Name: uniqueName(t.path, used),
    Tag: t.path,
    DevComment: t.comment || '',
  }));
  return JSON.stringify(rows, null, 2) + '\n';
}

function cppName(tag) {
  return tag.replace(/\./g, '_');
}

function renderCpp(tags) {
  const header = ['#pragma once', '', '#include "NativeGameplayTags.h"', ''];
  const source = ['#include "GameplayTags.h"', ''];
  for (const t of tags) {
    const name = cppName(t.path);
    header.push(`UE_DECLARE_GAMEPLAY_TAG_EXTERN(${name});`);
    if (t.comment) {
      source.push(`UE_DEFINE_GAMEPLAY_TAG_COMMENT(${name}, "${t.path}", "${escapeCpp(t.comment)}");`);
    } else {
      source.push(`UE_DEFINE_GAMEPLAY_TAG(${name}, "${t.path}");`);
    }
  }
  return {
    h: header.join('\n') + '\n',
    cpp: source.join('\n') + '\n',
  };
}

function escapeCpp(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function exportTags(tags, format) {
  const list = (tags || []).filter((t) => validateTag(t.path));
  const invalid = (tags || []).filter((t) => !validateTag(t.path));
  if (format === 'ini') return { type: 'text/plain', filename: 'DefaultGameplayTags.ini', body: renderIni(list), invalid: invalid.length };
  if (format === 'csv') return { type: 'text/csv', filename: 'GameplayTags.csv', body: renderCsv(list), invalid: invalid.length };
  if (format === 'json') return { type: 'application/json', filename: 'GameplayTags.json', body: renderJson(list), invalid: invalid.length };
  const cpp = renderCpp(list);
  return { type: 'text/plain', filename: 'GameplayTags.cpp', body: cpp.h + '\n' + cpp.cpp, invalid: invalid.length };
}

module.exports = { validateTag, exportTags, IMPL: require('./guidance').IMPL };
