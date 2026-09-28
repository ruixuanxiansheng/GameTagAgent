'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { GENRES, ROLES } = require('./guidance');

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');

function uid(prefix) {
  return `${prefix}_${crypto.randomBytes(6).toString('hex')}`;
}

function now() {
  return new Date().toISOString();
}

function makeProject(data = {}) {
  const genreKey = GENRES[data.genre] ? data.genre : 'survival';
  const roleKey = ROLES[data.role] ? data.role : 'designer';
  return {
    id: data.id || uid('p'),
    name: data.name || '未命名标签包',
    genre: genreKey,
    role: roleKey,
    genreName: GENRES[genreKey].name,
    roleName: ROLES[roleKey].name,
    description: data.description || '',
    author: data.author || '我',
    price: Number(data.price) > 0 ? Number(data.price) : 0,
    visibility: data.visibility || 'private',
    tags: Array.isArray(data.tags) ? data.tags : [],
    createdAt: data.createdAt || now(),
    updatedAt: data.updatedAt || now(),
  };
}

function seedTags(genreKey, roleKey, limit) {
  const genre = GENRES[genreKey] || GENRES.survival;
  const role = ROLES[roleKey] || ROLES.designer;
  const tags = [];
  const seen = new Set();
  const push = (t) => {
    if (!t || seen.has(t.tag)) return;
    seen.add(t.tag);
    tags.push({ id: uid('t'), path: t.tag, comment: t.comment || '', impl: t.impl || 'tag', notes: '' });
  };
  for (const d of genre.domains.slice(0, limit)) for (const t of d.tags) push(t);
  for (const t of genre.states.slice(0, 4)) push(t);
  for (const t of genre.events.slice(0, 3)) push(t);
  for (const t of (role.extraTags || []).slice(0, 4)) push(t);
  return tags;
}

function seedDb() {
  return {
    settings: {},
    projects: [
      makeProject({ name: '我的标签包', genre: 'survival', role: 'designer', visibility: 'private', tags: [] }),
    ],
  };
}

function saveDb(db) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmp = DB_PATH + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2), 'utf8');
  fs.renameSync(tmp, DB_PATH);
}

function loadDb() {
  if (!fs.existsSync(DB_PATH)) {
    const db = seedDb();
    saveDb(db);
    return db;
  }
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch {
    return { settings: {}, projects: [] };
  }
}

const db = loadDb();

function findProject(id) {
  return db.projects.find((p) => p.id === id);
}

function findTag(project, tagId) {
  return project.tags.find((t) => t.id === tagId);
}

function sortTags(project) {
  project.tags.sort((a, b) => a.path.localeCompare(b.path, undefined, { numeric: true }));
}

function publicProject(p) {
  return {
    id: p.id,
    name: p.name,
    genre: p.genre,
    role: p.role,
    genreName: p.genreName,
    roleName: p.roleName,
    description: p.description,
    author: p.author,
    price: p.price,
    visibility: p.visibility,
    tagCount: p.tags.length,
    updatedAt: p.updatedAt,
  };
}

module.exports = { uid, now, makeProject, seedDb, seedTags, loadDb, saveDb, db, findProject, findTag, sortTags, publicProject, DATA_DIR, DB_PATH };
