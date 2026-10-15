import { getUsers } from './userStore.js';
import { getSlaDeadline, getSlaState } from './slaUtils.js';

export const userName = (id) => getUsers().find((u) => u.id === id)?.name ?? 'Unassigned';
export const agents = () => getUsers().filter((u) => u.role === 'Agent' && u.active);

export function generateTicketId(tickets) {
  const max = tickets.reduce((m, t) => Math.max(m, parseInt(String(t.id).replace(/\D/g, ''), 10) || 0), 1000);
  return `QF-${max + 1}`;
}

export function filterTickets(list, { q = '', status = '', priority = '', category = '', assignee = '' } = {}) {
  const s = q.trim().toLowerCase();
  return list.filter((t) =>
    (!s || t.id.toLowerCase().includes(s) || t.title.toLowerCase().includes(s) || userName(t.requesterId).toLowerCase().includes(s)) &&
    (!status || t.status === status) && (!priority || t.priority === priority) && (!category || t.category === category) &&
    (!assignee || (assignee === 'none' ? !t.assigneeId : t.assigneeId === assignee)));
}

const RANK = { Low: 0, Medium: 1, High: 2, Critical: 3 };
const ACCESS = {
  priority: (t) => RANK[t.priority], assignee: (t) => userName(t.assigneeId), sla: (t) => getSlaDeadline(t),
};
export function sortTickets(list, key, dir = 'asc') {
  const get = ACCESS[key] || ((t) => t[key]);
  const m = dir === 'asc' ? 1 : -1;
  return [...list].sort((a, b) => (get(a) > get(b) ? m : get(a) < get(b) ? -m : 0));
}
export const paginate = (list, page, size) => list.slice((page - 1) * size, page * size);

const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
export function toCSV(tickets, now = Date.now()) {
  const head = ['ID', 'Title', 'Category', 'Priority', 'Status', 'Created', 'Assignee', 'SLA state', 'SLA deadline'];
  const rows = tickets.map((t) => [t.id, t.title, t.category, t.priority, t.status, new Date(t.createdAt).toISOString(), userName(t.assigneeId), getSlaState(t, now), new Date(getSlaDeadline(t)).toISOString()]);
  return [head, ...rows].map((r) => r.map(esc).join(',')).join('\n');
}
export function downloadCSV(name, tickets) {
  try {
    const url = URL.createObjectURL(new Blob([toCSV(tickets)], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = `${name}.csv`; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  } catch { return false; }
}
export const fmtDate = (ts) => new Date(ts).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
