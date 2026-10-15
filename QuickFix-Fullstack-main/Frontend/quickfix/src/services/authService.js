import { api, isDemo, unwrap } from './api.js';
import { getUsers } from '../utils/userStore.js';
// Demo login only matches a seeded email. It is NOT authentication.
export const login = (email, password) => (isDemo
  ? Promise.resolve(getUsers().find((u) => u.email === email && u.active) || null)
  : unwrap(api.post('/auth/login', { email, password })));
