import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Ticket, Siren, Loader, CheckCircle2, Timer, Flame, AlertTriangle, Clock } from 'lucide-react';
import DashboardCharts from '../components/dashboard/DashboardCharts.jsx';
import { avgResolutionHours } from '../utils/reportUtils.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useTickets } from '../context/TicketContext.jsx';
import { getUsers } from '../utils/userStore.js';
import { getSlaState, slaCompliance, getSlaDeadline } from '../utils/slaUtils.js';
import { can } from '../utils/permissions.js';

const PRIORITY_CLASS = { Low: 'b-neutral', Medium: 'b-info', High: 'b-warning', Critical: 'b-danger' };
const SLA_CLASS = { Healthy: 'b-success', Met: 'b-success', 'At risk': 'b-warning', Breached: 'b-danger' };
const fmt = (ts) => new Date(ts).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

export default function Dashboard() {
  const { user, role } = useAuth();
  const { tickets } = useTickets();
  const now = Date.now();
  const scoped = useMemo(() => (can(role, 'tickets:all') ? tickets : tickets.filter((t) => t.requesterId === user.id)), [tickets, role, user.id]);
  const open = scoped.filter((t) => t.status !== 'Resolved');
  const month = new Date().getMonth();
  const stats = [
    { l: 'Total tickets', v: scoped.length, i: Ticket },
    { l: 'Open incidents', v: open.length, i: Siren, c: 'warn' },
    { l: 'In progress', v: scoped.filter((t) => t.status === 'In Progress').length, i: Loader },
    { l: 'Resolved this month', v: scoped.filter((t) => t.resolvedAt && new Date(t.resolvedAt).getMonth() === month).length, i: CheckCircle2, c: 'ok' },
    { l: 'SLA compliance', v: `${slaCompliance(scoped, now)}%`, i: Timer, c: 'ok' },
    { l: 'Near SLA breach', v: open.filter((t) => getSlaState(t, now) === 'At risk').length, i: AlertTriangle, c: 'warn' },
    { l: 'Avg resolution', v: `${avgResolutionHours(scoped).toFixed(1)}h`, i: Clock },
    { l: 'Critical incidents', v: open.filter((t) => t.priority === 'Critical').length, i: Flame, c: 'danger' },
  ];
  const recent = [...scoped].sort((a, b) => b.createdAt - a.createdAt).slice(0, 8);
  const name = (id) => getUsers().find((u) => u.id === id)?.name ?? 'Unassigned';

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Welcome back, {user.name.split(' ')[0]}</h1>
          <p>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · Demo data</p>
        </div>
        {can(role, 'tickets:create') && <Link to="/tickets/new" className="btn btn-primary"><Plus size={18} />New ticket</Link>}
      </div>
      <div className="grid-stats">
        {stats.map(({ l, v, i: Icon, c = '' }) => (
          <div key={l} className={`card stat ${c}`}><span className="l"><Icon size={15} aria-hidden="true" />{l}</span><span className="v">{v}</span></div>
        ))}
      </div>
      <DashboardCharts tickets={scoped} />
      <section className="card" aria-labelledby="recent" style={{ marginTop: 16 }}>
        <h2 id="recent">Recent incidents</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Title</th><th>Priority</th><th>Status</th><th>Assignee</th><th>SLA</th><th>Resolution due</th></tr></thead>
            <tbody>
              {recent.map((t) => {
                const sla = getSlaState(t, now);
                return (
                  <tr key={t.id}>
                    <td className="mono">{t.id}</td><td>{t.title}</td>
                    <td><span className={`badge ${PRIORITY_CLASS[t.priority]}`}>{t.priority}</span></td>
                    <td><span className="badge b-neutral">{t.status}</span></td>
                    <td>{name(t.assigneeId)}</td>
                    <td><span className={`badge ${SLA_CLASS[sla]}`}>{sla}</span></td>
                    <td>{fmt(getSlaDeadline(t))}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
