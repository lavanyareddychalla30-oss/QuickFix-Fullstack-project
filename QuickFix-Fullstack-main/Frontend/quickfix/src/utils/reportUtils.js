const DAY = 864e5;
export const countBy = (list, key) => Object.entries(list.reduce((a, t) => { const v = typeof key === 'function' ? key(t) : t[key]; a[v] = (a[v] || 0) + 1; return a; }, {})).map(([name, value]) => ({ name, value }));
export const inRange = (tickets, days, now = Date.now()) => (days ? tickets.filter((t) => t.createdAt >= now - days * DAY) : tickets);
export function volumeByDay(tickets, days, now = Date.now()) {
  const out = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now - i * DAY); d.setHours(0, 0, 0, 0);
    const s = d.getTime(), e = s + DAY;
    out.push({ day: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      Created: tickets.filter((t) => t.createdAt >= s && t.createdAt < e).length,
      Resolved: tickets.filter((t) => t.resolvedAt && t.resolvedAt >= s && t.resolvedAt < e).length });
  }
  return out;
}
export function avgResolutionHours(list) {
  const r = list.filter((t) => t.resolvedAt);
  return r.length ? r.reduce((s, t) => s + (t.resolvedAt - t.createdAt), 0) / r.length / 36e5 : 0;
}
