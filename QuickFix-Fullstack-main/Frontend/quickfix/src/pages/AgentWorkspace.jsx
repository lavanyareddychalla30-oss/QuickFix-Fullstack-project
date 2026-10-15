import { Link } from 'react-router-dom';
import { UserCheck, Inbox, ShieldAlert, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '../components/common/PageHeader.jsx';
import { PriorityBadge, SLABadge } from '../components/common/Badges.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useTickets } from '../context/TicketContext.jsx';
import { can } from '../utils/permissions.js';
import { getSlaState, getSlaDeadline, formatRemaining } from '../utils/slaUtils.js';
import { agents, userName } from '../utils/ticketUtils.js';
import { STATUSES } from '../data/seedData.js';

export default function AgentWorkspace() {
  const { user, role } = useAuth(); const T = useTickets();
  const now = Date.now();
  const open = T.tickets.filter((t) => t.status !== 'Resolved');
  const mine = open.filter((t) => t.assigneeId === user.id);
  const queue = open.filter((t) => !t.assigneeId);
  const risk = open.filter((t) => ['At risk', 'Breached'].includes(getSlaState(t, now)));

  const Row = ({ t, children }) => (
    <li className="wrow"><div style={{ minWidth: 0 }}><Link to={`/tickets/${t.id}`} className="row-link"><span className="mono">{t.id}</span> {t.title}</Link>
      <div className="pill-row"><PriorityBadge value={t.priority} /><SLABadge value={getSlaState(t, now)} /><span className="sub">{formatRemaining(getSlaDeadline(t) - now)}</span></div></div>
    <div className="row-actions">{children}</div></li>);
  const Panel = ({ title, Icon, items, empty, render }) => (
    <section className="card"><h2><Icon size={16} aria-hidden="true" /> {title} <span className="count">{items.length}</span></h2>
      {items.length ? <ul className="wlist">{items.slice(0, 6).map((t) => <Row key={t.id} t={t}>{render?.(t)}</Row>)}</ul> : <p className="sub">{empty}</p>}</section>);

  return (<>
    <PageHeader title="Agent workspace" subtitle="Work your queue. Every change updates the rest of QuickFix." />
    <div className="grid-2">
      <Panel title="Assigned to me" Icon={UserCheck} items={mine} empty="Nothing assigned to you." render={(t) => (
        <select className="select-sm" aria-label={`Status for ${t.id}`} value={t.status} onChange={(e) => { T.setStatus(t.id, e.target.value, user.name); toast.success('Status updated'); }}>
          {STATUSES.filter((s) => s !== 'Resolved').map((s) => <option key={s}>{s}</option>)}</select>)} />
      <Panel title="Unassigned queue" Icon={Inbox} items={queue} empty="Queue is clear." render={(t) => (<>
        {can(role, 'tickets:accept') && <button className="btn btn-primary" style={{ height: 32 }} onClick={() => { T.accept(t.id, user); toast.success(`Accepted ${t.id}`); }}>Accept</button>}
        {can(role, 'tickets:assign') && <select className="select-sm" aria-label={`Assign ${t.id}`} value="" onChange={(e) => { T.assign(t.id, e.target.value, user.name); toast.success('Assigned'); }}><option value="">Assign…</option>{agents().map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select>}</>)} />
      <Panel title="SLA at risk or breached" Icon={ShieldAlert} items={risk} empty="No tickets at risk." />
      <section className="card"><h2><Users size={16} aria-hidden="true" /> Agent workload</h2>
        <ul className="wlist">{agents().map((a) => { const n = open.filter((t) => t.assigneeId === a.id).length; return (
          <li key={a.id} className="wrow"><span>{userName(a.id)}</span><div className="bar" role="img" aria-label={`${n} open tickets`}><span style={{ width: `${Math.min(100, n * 12)}%` }} /></div><strong>{n}</strong></li>); })}</ul></section>
    </div>
  </>);
}
