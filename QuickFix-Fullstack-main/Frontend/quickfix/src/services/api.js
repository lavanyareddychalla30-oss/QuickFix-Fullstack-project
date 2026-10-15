import axios from 'axios';
// VITE_DATA_MODE=demo (default) uses localStorage mocks. VITE_DATA_MODE=api calls Spring Boot.
export const isDemo = import.meta.env.VITE_DATA_MODE !== 'api';
export const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api', timeout: 10000 });
// In production prefer httpOnly session cookies (withCredentials). Never keep passwords or tokens in localStorage.
export const demoOnly = (name) => { throw new Error(`${name}: in demo mode this is handled by TicketContext`); };
export const unwrap = (p) => p.then((r) => r.data);
