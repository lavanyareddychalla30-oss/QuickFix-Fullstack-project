import { SEED_USERS } from '../data/seedData.js';
import { loadJSON, saveJSON } from './storage.js';
const KEY = 'qf_users';
const ok = (d) => Array.isArray(d) && d.length > 0 && d.every((u) => u && typeof u.id === 'string' && typeof u.email === 'string' && typeof u.role === 'string');
export const getUsers = () => { const s = loadJSON(KEY, null); return ok(s) ? s : SEED_USERS; };
export const saveUsers = (users) => saveJSON(KEY, users);
export const resetUsers = () => { try { localStorage.removeItem(KEY); } catch { /* ignore */ } };
