import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, MessageSquare, Lock, RefreshCw, UserCheck, ArrowUpRight, Paperclip, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import NotFound from './NotFound.jsx';
import Modal from '../components/common/Modal.jsx';
import { StatusBadge, PriorityBadge, SLABadge } from '../components/common/Badges.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useTickets } from '../context/TicketContext.jsx';
import { can } from '../utils/permissions.js';
import { STATUSES, ROLES } from '../data/seedData.js';
import { userName, agents, fmtDate } from '../utils/ticketUtils.js';
import { getSlaState, getSlaDeadline, formatRemaining } from '../utils/slaUtils.js';

const ICON = { created: Plus, comment: MessageSquare, note: Lock, status: RefreshCw, assign: UserCheck, escalate: ArrowUpRight };

export default function TicketDetails() {
  const { id } = useParams();
  const { user, role } = useAuth();
  const T = useTickets();
  const t = T.tickets.find((x) => x.id === id);
  const [dialog, setDialog] = useState(null);
  const [text, setText] = useState('');
  const [comment, setComment] = useState('');
  const [internal, setInternal] = useState(false);
  if (!t || (role === ROLES.EMPLOYEE && t.requesterId !== user.id)) return <NotFound />;

  const canNote = can(role, 'comment:internal');
  const canStatus = can(role, 'tickets:status');
  const resolved = t.status === 'Resolved';
  const now = Date.now();
  const deadline = getSlaDeadline(t);
  const events = [{ id: 'c0', type: 'created', by: userName(t.requesterId), at: t.createdAt, text: 'Ticket created' }, ...(t.events || []).filter((e) => e.type !== 'created')]
    .filter((e) => e.type !== 'note' || canNote).sort((a, b) => b.at - a.at);

  const closeDialog = () => { setDialog(null); setText(''); };
  const confirm = () => {
    if (dialog !== 'reopen' && text.trim().length < 3) return toast.error('Please enter a short explanation.');
    if (dialog === 'resolve') { T.resolve(t.id, text.trim(), user.name); toast.success('Ticket resolved'); }
    if (dialog === 'escalate') { T.escalate(t.id, text.trim(), user.name); toast.success('Ticket escalated'); }
    if (dialog === 'reopen') { T.reopen(t.id, user.name); toast.success('Ticket reopened'); }
    closeDialog();
  };
  const post = (e) => {
    e.preventDefault();
    if (!comment.trim()) return toast.error('Write something first.');
    T.addComment(t.id, comment.trim(), internal && canNote, user.name);
    setComment(''); toast.success(internal && canNote ? 'Internal note added' : 'Comment posted');
  };
  const titles = { resolve: 'Resolve ticket', escalate: 'Escalate ticket', reopen: 'Reopen ticket' };

  return (<>
    <Link to={-1} onClick={(e) => { e.preventDefault(); window.history.back(); }} className="back"><ArrowLeft size={15} />Back</Link>
    <div className="page-head">
      <div><span className="mono">{t.id}</span><h1>{t.title}</h1>
        <div className="pill-row"><StatusBadge value={t.status} /><PriorityBadge value={t.priority} /><SLABadge value={getSlaState(t, now)} /></div></div>
    </div>
    <div className="detail-grid">
      <div style={{ display: 'grid', gap: 16, alignContent: 'start' }}>
        <section className="card"><h2>Description</h2><p style={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{t.description}</p>
          {t.resolution && <p className="resolution"><strong>Resolution:</strong> {t.resolution}</p>}
          {(t.attachments || []).map((a, i) => <div key={i} className="file-row"><Paperclip size={14} />{a.name}<span className="sub">local demo file</span></div>)}</section>
        <section className="card"><h2>Activity</h2>
          <ol className="timeline">{events.map((e) => { const I = ICON[e.type] || RefreshCw; return (
            <li key={e.id} className={e.type === 'note' ? 'note-item' : ''}><span className="dot"><I size={13} aria-hidden="true" /></span>
              <div><div className="who">{e.by}{e.type === 'note' && <span className="badge b-warning" style={{ marginLeft: 8 }}>Internal note</span>}</div><p>{e.text}</p><span className="sub">{fmtDate(e.at)}</span></div></li>); })}</ol>
          <form onSubmit={post} style={{ marginTop: 16 }}>
            <label htmlFor="cm" className="sr-only">Add a comment</label>
            <textarea id="cm" className="input" rows={3} placeholder={internal ? 'Internal note (agents only)…' : 'Write a public comment…'} value={comment} onChange={(e) => setComment(e.target.value)} />
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 8 }}>
              <button className="btn btn-primary">{internal && canNote ? 'Add internal note' : 'Post comment'}</button>
              {canNote && <label className="check"><input type="checkbox" checked={internal} onChange={(e) => setInternal(e.target.checked)} /> Internal note</label>}
            </div>
          </form></section>
      </div>
      <aside style={{ display: 'grid', gap: 16, alignContent: 'start' }}>
        <section className="card"><h2>Details</h2>
          <dl className="kv"><dt>Requester</dt><dd>{userName(t.requesterId)}</dd><dt>Assignee</dt><dd>{userName(t.assigneeId)}</dd><dt>Category</dt><dd>{t.category}</dd>
            <dt>Created</dt><dd>{fmtDate(t.createdAt)}</dd><dt>Updated</dt><dd>{fmtDate(t.updatedAt)}</dd><dt>SLA deadline</dt><dd>{fmtDate(deadline)}</dd>
            {!resolved && <><dt>Remaining</dt><dd>{formatRemaining(deadline - now)}</dd></>}</dl>
          <p className="sub">Simulated SLA, calculated in the browser.</p></section>
        {canStatus && (<section className="card"><h2>Actions</h2>
          <div className="field"><label htmlFor="st">Status</label>
            <select id="st" className="input" value={resolved ? '' : t.status} disabled={resolved} onChange={(e) => { T.setStatus(t.id, e.target.value, user.name); toast.success('Status updated'); }}>
              {resolved && <option value="">Resolved</option>}{STATUSES.filter((s) => s !== 'Resolved').map((s) => <option key={s}>{s}</option>)}</select></div>
          {can(role, 'tickets:assign') && <div className="field"><label htmlFor="as">Assignee</label>
            <select id="as" className="input" value={t.assigneeId || ''} onChange={(e) => { T.assign(t.id, e.target.value, user.name); toast.success('Assignment updated'); }}>
              <option value="">Unassigned</option>{agents().map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select></div>}
          <div style={{ display: 'grid', gap: 8 }}>
            {can(role, 'tickets:accept') && t.assigneeId !== user.id && !resolved && <button className="btn btn-secondary" onClick={() => { T.accept(t.id, user); toast.success('Ticket accepted'); }}>Accept ticket</button>}
            {!resolved && <button className="btn btn-primary" onClick={() => setDialog('resolve')}>Resolve…</button>}
            {resolved && <button className="btn btn-secondary" onClick={() => setDialog('reopen')}>Reopen</button>}
            {!resolved && t.status !== 'Escalated' && can(role, 'tickets:escalate') && <button className="btn btn-secondary" onClick={() => setDialog('escalate')}>Escalate…</button>}
          </div></section>)}
      </aside>
    </div>
    <Modal open={!!dialog} title={titles[dialog] || ''} onClose={closeDialog}
      footer={<><button className="btn btn-secondary" onClick={closeDialog}>Cancel</button><button className="btn btn-primary" onClick={confirm}>Confirm</button></>}>
      {dialog === 'reopen' ? <p>Reopen {t.id} and set it back to In Progress?</p> : (<div className="field"><label htmlFor="dl">{dialog === 'resolve' ? 'Resolution summary (required)' : 'Reason for escalation (required)'}</label>
        <textarea id="dl" className="input" rows={4} value={text} onChange={(e) => setText(e.target.value)} /></div>)}
    </Modal>
  </>);
}
