import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader.jsx';
import { SLABadge, PriorityBadge } from '../components/common/Badges.jsx';
import { ChartCard, BarsChart, PRIORITY_COLORS } from '../components/charts/ChartKit.jsx';
import { useTickets } from '../context/TicketContext.jsx';
import { SLA_TARGETS, getSlaState, getSlaDeadline, formatRemaining, slaCompliance } from '../utils/slaUtils.js';
import { filterTickets, agents, userName } from '../utils/ticketUtils.js';
import { avgResolutionHours } from '../utils/reportUtils.js';
import { PRIORITIES, STATUSES } from '../data/seedData.js';

export default function SLAMonitoring() {
  const { tickets } = useTickets();
  const [f, setF] = useState({ priority: '', status: '', assignee: '' });
  const now = Date.now();
  const list = filterTickets(tickets, f);
  const open = list.filter((t) => t.status !== 'Resolved');
  const state = (t) => getSlaState(t, now);
  const breached = open.filter((t) => state(t) === 'Breached'); const risk = open.filter((t) => state(t) === 'At risk');
  const healthy = list.filter((t) => ['Healthy', 'Met'].includes(state(t)));
  const chart = PRIORITIES.map((name) => ({ name, value: +avgResolutionHours(list.filter((t) => t.priority === name)).toFixed(1) }));
  const sel = (k, label, opts) => <select className="select-sm" aria-label={label} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })}><option value="">{label}</option>{opts}</select>;
  const List = ({ title, items }) => (<section className="card"><h2>{title} <span className="count">{items.length}</span></h2>
    {items.length ? <ul className="wlist">{items.slice(0, 8).map((t) => (<li key={t.id} className="wrow"><div><Link to={`/tickets/${t.id}`} className="row-link"><span className="mono">{t.id}</span> {t.title}</Link>
      <div className="pill-row"><PriorityBadge value={t.priority} /><SLABadge value={state(t)} /><span className="sub">{formatRemaining(getSlaDeadline(t) - now)} · {userName(t.assigneeId)}</span></div></div></li>))}</ul> : <p className="sub">None right now.</p>}</section>);
  return (<>
    <PageHeader title="SLA monitoring" subtitle="Simulated in the browser from ticket timestamps. Real SLA enforcement belongs on the backend." />
    <div className="toolbar" style={{ padding: '0 0 16px', border: 0 }}>
      {sel('priority', 'All priorities', PRIORITIES.map((p) => <option key={p}>{p}</option>))}
      {sel('status', 'All statuses', STATUSES.map((p) => <option key={p}>{p}</option>))}
      {sel('assignee', 'Any assignee', [<option key="n" value="none">Unassigned</option>, ...agents().map((a) => <option key={a.id} value={a.id}>{a.name}</option>)])}
    </div>
    <div className="grid-stats">
      <div className="card stat ok"><span className="l">SLA compliance</span><span className="v">{slaCompliance(list, now)}%</span></div>
      <div className="card stat ok"><span className="l">Healthy / met</span><span className="v">{healthy.length}</span></div>
      <div className="card stat warn"><span className="l">At risk</span><span className="v">{risk.length}</span></div>
      <div className="card stat danger"><span className="l">Breached</span><span className="v">{breached.length}</span></div>
    </div>
    <div className="grid-2">
      <List title="Breached" items={breached} /><List title="At risk" items={risk} />
      <ChartCard title="Avg resolution time by priority (hours)" empty={!chart.some((c) => c.value > 0)}><BarsChart data={chart} colors={PRIORITY_COLORS} /></ChartCard>
      <section className="card"><h2>SLA policy</h2><p className="sub" style={{ marginBottom: 8 }}>Sample project configuration, not a universal ITIL standard.</p>
        <div className="table-wrap"><table><thead><tr><th>Priority</th><th>Response</th><th>Resolution</th></tr></thead><tbody>
          {PRIORITIES.slice().reverse().map((p) => <tr key={p}><td><PriorityBadge value={p} /></td><td>{SLA_TARGETS[p].response}h</td><td>{SLA_TARGETS[p].resolution}h</td></tr>)}</tbody></table></div></section>
    </div>
  </>);
}
