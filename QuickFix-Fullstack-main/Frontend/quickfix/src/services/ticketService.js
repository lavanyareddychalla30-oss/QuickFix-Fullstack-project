import { api, isDemo, unwrap, demoOnly } from './api.js';
import { loadJSON } from '../utils/storage.js';
// Contract for Spring Boot. In demo mode the pages use TicketContext (localStorage) instead.
const real = (fn, name) => (...a) => (isDemo ? demoOnly(name) : fn(...a));
export const listTickets = (params) => (isDemo ? Promise.resolve(loadJSON('qf_tickets', [])) : unwrap(api.get('/tickets', { params })));
export const createTicket = real((d) => unwrap(api.post('/tickets', d)), 'createTicket');
export const getTicket = real((id) => unwrap(api.get(`/tickets/${id}`)), 'getTicket');
export const updateTicket = real((id, p) => unwrap(api.patch(`/tickets/${id}`, p)), 'updateTicket');
export const addComment = real((id, c) => unwrap(api.post(`/tickets/${id}/comments`, c)), 'addComment');
export const assignTicket = real((id, agentId) => unwrap(api.post(`/tickets/${id}/assign`, { agentId })), 'assignTicket');
export const resolveTicket = real((id, summary) => unwrap(api.post(`/tickets/${id}/resolve`, { summary })), 'resolveTicket');
export const escalateTicket = real((id, reason) => unwrap(api.post(`/tickets/${id}/escalate`, { reason })), 'escalateTicket');
