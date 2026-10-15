import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { buildSeedTickets } from '../data/seedData.js';
import { loadJSON, saveJSON } from '../utils/storage.js';
import { generateTicketId, userName } from '../utils/ticketUtils.js';

const TicketContext = createContext(null);
export const useTickets = () => useContext(TicketContext);
const KEY = 'qf_tickets';
const valid = (d) => Array.isArray(d) && d.length > 0 && d.every((t) => t && typeof t.id === 'string' && typeof t.createdAt === 'number');
const uid = () => Math.random().toString(36).slice(2, 9);
const ev = (t, type, by, text) => ({ ...t, events: [...(t.events || []), { id: uid(), type, by, at: Date.now(), text }] });

export function TicketProvider({ children }) {
  const [tickets, setTickets] = useState(() => { const s = loadJSON(KEY, null); return valid(s) ? s : buildSeedTickets(); });
  useEffect(() => { saveJSON(KEY, tickets); }, [tickets]);
  const act = (id, fn) => setTickets((ts) => ts.map((t) => (t.id === id ? { ...fn(t), updatedAt: Date.now() } : t)));
  const resetDemoData = useCallback(() => setTickets(buildSeedTickets()), []);

  const actions = {
    createTicket(data, user) {
      const now = Date.now(); const id = generateTicketId(tickets);
      const t = { ...data, id, status: 'New', requesterId: user.id, assigneeId: null, createdAt: now, updatedAt: now, resolvedAt: null, events: [{ id: uid(), type: 'created', by: user.name, at: now, text: 'Ticket created' }] };
      setTickets((ts) => [t, ...ts]); return id;
    },
    accept: (id, user) => act(id, (t) => ev({ ...t, assigneeId: user.id, status: 'In Progress' }, 'assign', user.name, `Accepted by ${user.name}`)),
    assign: (id, agentId, by) => act(id, (t) => ev({ ...t, assigneeId: agentId || null, status: agentId && t.status === 'New' ? 'Assigned' : t.status }, 'assign', by, agentId ? `Assigned to ${userName(agentId)}` : 'Unassigned')),
    setStatus: (id, status, by) => act(id, (t) => ev({ ...t, status }, 'status', by, `Status changed to ${status}`)),
    resolve: (id, summary, by) => act(id, (t) => ev({ ...t, status: 'Resolved', resolvedAt: Date.now(), resolution: summary }, 'status', by, `Resolved: ${summary}`)),
    reopen: (id, by) => act(id, (t) => ev({ ...t, status: 'In Progress', resolvedAt: null }, 'status', by, 'Ticket reopened')),
    escalate: (id, reason, by) => act(id, (t) => ev({ ...t, status: 'Escalated' }, 'escalate', by, `Escalated: ${reason}`)),
    addComment: (id, text, internal, by) => act(id, (t) => ev(t, internal ? 'note' : 'comment', by, text)),
  };
  return <TicketContext.Provider value={{ tickets, setTickets, resetDemoData, ...actions }}>{children}</TicketContext.Provider>;
}
