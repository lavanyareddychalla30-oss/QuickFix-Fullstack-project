import { api, isDemo, unwrap } from './api.js';
import { getUsers, saveUsers } from '../utils/userStore.js';
export const listUsers = () => (isDemo ? Promise.resolve(getUsers()) : unwrap(api.get('/users')));
export const createUser = (u) => {
  if (!isDemo) return unwrap(api.post('/users', u));
  const users = getUsers(); const n = users.reduce((m, x) => Math.max(m, parseInt(x.id.replace(/\D/g, ''), 10) || 0), 0) + 1;
  const next = { ...u, id: `u${n}`, active: true }; saveUsers([...users, next]); return Promise.resolve(next);
};
export const updateUser = (id, patch) => {
  if (!isDemo) return unwrap(api.patch(`/users/${id}`, patch));
  saveUsers(getUsers().map((u) => (u.id === id ? { ...u, ...patch } : u))); return Promise.resolve(true);
};
