// Sample project configuration — not universal ITIL requirements.
export const SLA_TARGETS = {
  Critical: { response: 1, resolution: 4 },
  High: { response: 2, resolution: 8 },
  Medium: { response: 4, resolution: 24 },
  Low: { response: 8, resolution: 72 },
};
const HOUR = 3600000;

export function getSlaDeadline(ticket, targets = SLA_TARGETS) {
  const t = targets[ticket.priority] || targets.Medium;
  return ticket.createdAt + t.resolution * HOUR;
}

/** Returns 'Healthy' | 'At risk' | 'Breached' (and 'Met' for resolved-in-time tickets). */
export function getSlaState(ticket, now = Date.now(), targets = SLA_TARGETS) {
  const deadline = getSlaDeadline(ticket, targets);
  if (ticket.resolvedAt) return ticket.resolvedAt <= deadline ? 'Met' : 'Breached';
  if (now > deadline) return 'Breached';
  const total = deadline - ticket.createdAt;
  return (now - ticket.createdAt) / total >= 0.75 ? 'At risk' : 'Healthy';
}

export function formatRemaining(ms) {
  const abs = Math.abs(ms), h = Math.floor(abs / HOUR), m = Math.floor((abs % HOUR) / 60000);
  const text = h > 0 ? `${h}h ${m}m` : `${m}m`;
  return ms < 0 ? `${text} overdue` : `${text} left`;
}

export function slaCompliance(tickets, now = Date.now()) {
  if (!tickets.length) return 100;
  const ok = tickets.filter((t) => getSlaState(t, now) !== 'Breached').length;
  return Math.round((ok / tickets.length) * 100);
}
