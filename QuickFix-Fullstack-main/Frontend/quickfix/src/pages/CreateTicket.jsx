import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Paperclip, X, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '../components/common/PageHeader.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useTickets } from '../context/TicketContext.jsx';
import { PRIORITIES } from '../data/seedData.js';
import { CATEGORIES, validateTicket, validateFile } from '../utils/validation.js';

const MAX_DESC = 1000;
const kb = (n) => (n > 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

export default function CreateTicket() {
  const { user } = useAuth(); const { createTicket } = useTickets(); const navigate = useNavigate();
  const [f, setF] = useState({ title: '', description: '', category: '', priority: 'Medium', contact: user.email });
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);
  const set = (k) => (e) => setF((o) => ({ ...o, [k]: e.target.value }));

  const pick = (e) => {
    const ok = [];
    [...e.target.files].forEach((file) => { const err = validateFile(file); err ? toast.error(err) : ok.push({ name: file.name, size: file.size }); });
    setFiles((o) => [...o, ...ok]); e.target.value = '';
  };
  const submit = (e) => {
    e.preventDefault();
    const errs = validateTicket(f); setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    setTimeout(() => {
      const id = createTicket({ ...f, title: f.title.trim(), description: f.description.trim(), attachments: files }, user);
      toast.success(`Ticket ${id} created`); setBusy(false); setDone(id);
    }, 600);
  };

  if (done) return (
    <div className="card soon" style={{ maxWidth: 520, margin: '40px auto' }}>
      <CheckCircle2 size={40} color="var(--color-success)" aria-hidden="true" />
      <h1 style={{ fontSize: 24, margin: '12px 0 6px' }}>Ticket {done} submitted</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 20 }}>An agent will pick it up shortly. Attachments stay in your browser in this demo; nothing is uploaded.</p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        <Link to={`/tickets/${done}`} className="btn btn-primary">View ticket</Link>
        <button className="btn btn-secondary" onClick={() => { setDone(null); setF({ ...f, title: '', description: '', category: '' }); setFiles([]); }}>Create another</button>
      </div>
    </div>);

  const Err = ({ k, label }) => errors[k] ? <span className="field-error" role="alert">{label}: {errors[k]}</span> : null;
  return (<>
    <PageHeader title="Create ticket" subtitle="Tell us what's broken. The more detail, the faster the fix." />
    <form className="card" onSubmit={submit} noValidate style={{ maxWidth: 820 }}>
      <div className="field"><label htmlFor="title">Title</label><input id="title" className="input" value={f.title} onChange={set('title')} aria-invalid={!!errors.title} /><Err k="title" label="Title" /></div>
      <div className="field"><label htmlFor="desc">Description</label>
        <textarea id="desc" className="input" rows={5} maxLength={MAX_DESC} value={f.description} onChange={set('description')} aria-invalid={!!errors.description} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><Err k="description" label="Description" /><span className="sub" style={{ marginLeft: 'auto' }}>{f.description.length}/{MAX_DESC}</span></div></div>
      <div className="grid-2">
        <div className="field"><label htmlFor="cat">Category</label><select id="cat" className="input" value={f.category} onChange={set('category')} aria-invalid={!!errors.category}><option value="">Select…</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select><Err k="category" label="Category" /></div>
        <div className="field"><label htmlFor="pri">Priority</label><select id="pri" className="input" value={f.priority} onChange={set('priority')}>{PRIORITIES.map((p) => <option key={p}>{p}</option>)}</select></div>
      </div>
      <div className="field"><label htmlFor="contact">Contact (email or phone)</label><input id="contact" className="input" value={f.contact} onChange={set('contact')} aria-invalid={!!errors.contact} /><Err k="contact" label="Contact" /></div>
      <div className="field"><label htmlFor="files">Attachments (png, jpg, pdf, txt, log, doc — max 5 MB)</label>
        <input id="files" className="input" type="file" multiple onChange={pick} style={{ paddingTop: 8 }} />
        {files.map((a, i) => (<div key={`${a.name}-${i}`} className="file-row"><Paperclip size={14} /><span>{a.name}</span><span className="sub">{kb(a.size)}</span>
          <button type="button" className="icon-btn" aria-label={`Remove ${a.name}`} onClick={() => setFiles((o) => o.filter((_, j) => j !== i))}><X size={14} /></button></div>))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-primary" disabled={busy}>{busy ? 'Submitting…' : 'Submit ticket'}</button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
      </div>
    </form>
  </>);
}
