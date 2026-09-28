'use strict';

// Optional LLM enrichment. Active only when OPENAI_API_KEY is set; every
// failure falls back to the curated engine in guidance.js.
const fs = require('fs');
const path = require('path');

let config = {};
try {
  config = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'config.json'), 'utf8'));
} catch {}
const openai = config.openai || {};

let apiKey = process.env.OPENAI_API_KEY || openai.apiKey || '';
let baseUrl = process.env.OPENAI_BASE_URL || openai.baseUrl || 'https://api.openai.com/v1';
let model = process.env.OPENAI_MODEL || openai.model || 'gpt-4o-mini';

function getConfig() {
  return { apiKey, baseUrl, model };
}

function setConfig(next) {
  if (!next || typeof next !== 'object') return;
  if (typeof next.apiKey === 'string') apiKey = next.apiKey.trim();
  if (typeof next.baseUrl === 'string' && next.baseUrl.trim()) baseUrl = next.baseUrl.trim();
  if (typeof next.model === 'string' && next.model.trim()) model = next.model.trim();
}

function available() {
  return Boolean(apiKey);
}

async function complete(system, user) {
  if (!apiKey) return null;
  try {
    const res = await fetch(`${baseUrl.replace(/\/+$/, '')}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        temperature: 0.35,
        max_tokens: 6000,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content
      : null;
  } catch {
    return null;
  }
}

module.exports = { complete, available, getConfig, setConfig };
