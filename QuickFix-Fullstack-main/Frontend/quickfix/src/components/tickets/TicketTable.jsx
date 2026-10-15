import { loadJSON } from '../../utils/storage.js';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Download, Search, RotateCcw, ArrowUp, ArrowDown, Inbox } from 'lucide-react';
import toast from 'react-hot-toast';
import { StatusBadge, PriorityBadge, SLABadge } from '../common/Badges.jsx';
import Pagination from '../common/Pagination.jsx';
import { filterTickets, sortTickets, paginate, downloadCSV, userName, agents, fmtDate } from '../../utils/ticketUtils.js';
import { getSlaState, getSlaDeadline } from '../../utils/slaUtils.js';
import { CATEGORIES } from '../../utils/validation.js';
import { STATUSES, PRIORITIES } from '../../data/seedData.js';

const COLS = [['id', 'ID'], ['title', 'Title'], ['category', 'Category'], ['priority', 'Priority'], ['status', 'Status'], ['createdAt', 'Created'], ['assignee', 'Assignee'], ['sla', 'SLA']];
const EMPTY = { q: '', status: '', priority: '', category: '', assignee: '' };

export default function TicketTable({ tickets, showAssignee = false, pageSize = loadJSON('qf_prefs', {}).pageSize || 8, exportName = 'quickfix-tickets' }) {
  const [params] = useSearchParams();
  const urlQ = params.get('q') || '';
  const [f, setF] = useState({ ...EMPTY, q: urlQ });
  const [sort, setSort] = useState({ key: 'createdAt', dir: 'desc' });
  const [page, setPage] = useState(1);
  useEffect(() => { setF((o) => ({ ...o, q: urlQ })); setPage(1); }, [urlQ]);
  const now = Date.now();
  const rows = useMemo(() => sortTickets(filterTickets(tickets, f), sort.key, sort.dir), [tickets, f, sort]);
  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  const cur = Math.min(page, pages);
  const set = (k) => (e) => { setF((o) => ({ ...o, [k]: e.target.value })); setPage(1); };
  const toggle = (key) => setSort((s) => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }));
  const exportCsv = () => (rows.length && downloadCSV(exportName, rows) ? toast.success(`Exported ${rows.length} rows`) : toast.error(rows.length ? 'Export failed' : 'Nothing to export'));
  const Sel = ({ k, label, opts }) => (
    <select className="select-sm" aria-label={label} value={f[k]} onChange={set(k)}><option value="">{label}</option>{opts.map((o) => <option key={o.v ?? o} value={o.v ?? o}>{o.l ?? o}</option>)}</select>
  );
  return (
    <section className="card" style={{ padding: 0 }}>
      <div className="toolbar">
        <div className="search"><Search size={16} aria-hidden="true" /><label className="sr-only" htmlFor="tt-q">Search tickets</label>
          <input id="tt-q" className="input" placeholder="Search ID, title or requester" value={f.q} onChange={set('q')} style={{ paddingLeft: 36 }} /></div>
        <Sel k="status" label="All statuses" opts={STATUSES} />
        <Sel k="priority" label="All priorities" opts={PRIORITIES} />
        <Sel k="category" label="All categories" opts={CATEGORIES} />
        {showAssignee && <Sel k="assignee" label="Any assignee" opts={[{ v: 'none', l: 'Unassigned' }, ...agents().map((a) => ({ v: a.id, l: a.name }))]} />}
        <button className="btn btn-secondary" onClick={() => { setF(EMPTY); setPage(1); }}><RotateCcw size={15} />Reset</button>
        <button className="btn btn-secondary" onClick={exportCsv}><Download size={15} />Export CSV</button>
      </div>
      {rows.length === 0 ? (
        <div className="empty"><Inbox size={30} aria-hidden="true" /><p>No tickets match these filters.</p></div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr>
              {COLS.map(([k, l]) => (
                <th key={k} aria-sort={sort.key === k ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
                  <button className="th-btn" onClick={() => toggle(k)}>{l}{sort.key === k && (sort.dir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}</button>
                </th>))}
              <th><span className="sr-only">Actions</span></th>
            </tr></thead>
            <tbody>
              {paginate(rows, cur, pageSize).map((t) => (
                <tr key={t.id}>
                  <td className="mono">{t.id}</td>
                  <td><Link to={`/tickets/${t.id}`} className="row-link">{t.title}</Link></td>
                  <td>{t.category}</td>
                  <td><PriorityBadge value={t.priority} /></td>
                  <td><StatusBadge value={t.status} /></td>
                  <td>{fmtDate(t.createdAt)}</td>
                  <td>{userName(t.assigneeId)}</td>
                  <td><SLABadge value={getSlaState(t, now)} /><div className="sub">{fmtDate(getSlaDeadline(t))}</div></td>
                  <td><Link to={`/tickets/${t.id}`} className="btn btn-secondary" style={{ height: 32 }}>View</Link></td>
                </tr>))}
            </tbody>
          </table>
        </div>)}
      <Pagination page={cur} pages={pages} total={rows.length} onPage={setPage} />
    </section>
  );
}
