import { useState } from 'react';
import toast from 'react-hot-toast';
import PageHeader from '../components/common/PageHeader.jsx';
import Modal from '../components/common/Modal.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useTickets } from '../context/TicketContext.jsx';
import { loadJSON, saveJSON } from '../utils/storage.js';
import { resetUsers } from '../utils/userStore.js';
import { SLA_TARGETS } from '../utils/slaUtils.js';

const DEFAULTS = { emailNotify: true, slaAlerts: true, pageSize: 8 };
export default function Settings() {
  const { user } = useAuth(); const { resetDemoData } = useTickets();
  const [prefs, setPrefs] = useState(() => ({ ...DEFAULTS, ...loadJSON('qf_prefs', {}) }));
  const [confirm, setConfirm] = useState(false);
  const update = (patch) => { const n = { ...prefs, ...patch }; setPrefs(n); saveJSON('qf_prefs', n); toast.success('Preference saved'); };
  const reset = () => {
    resetDemoData(); resetUsers(); ['qf_kb_votes', 'qf_prefs'].forEach((k) => { try { localStorage.removeItem(k); } catch { /* ignore */ } });
    toast.success('Demo data restored'); setTimeout(() => window.location.reload(), 600);
  };
  const Toggle = ({ k, label }) => <label className="check" style={{ marginBottom: 10 }}><input type="checkbox" checked={prefs[k]} onChange={(e) => update({ [k]: e.target.checked })} /> {label}</label>;
  return (<>
    <PageHeader title="Settings" subtitle="Preferences are stored in this browser. QuickFix is dark-only." />
    <div className="grid-2">
      <section className="card"><h2>Profile</h2><dl className="kv"><dt>Name</dt><dd>{user.name}</dd><dt>Email</dt><dd>{user.email}</dd><dt>Department</dt><dd>{user.department}</dd><dt>Role</dt><dd>{user.role}</dd></dl></section>
      <section className="card"><h2>Notifications</h2><Toggle k="emailNotify" label="Email me about ticket updates" /><Toggle k="slaAlerts" label="Alert me about SLA risk" />
        <p className="sub">Demo preferences only: no emails or alerts are sent.</p></section>
      <section className="card"><h2>Ticket display</h2><div className="field"><label htmlFor="ps">Rows per page</label>
        <select id="ps" className="input" value={prefs.pageSize} onChange={(e) => update({ pageSize: Number(e.target.value) })}>{[5, 8, 10, 15].map((n) => <option key={n}>{n}</option>)}</select></div>
        <p className="sub">Applies the next time a ticket list opens.</p></section>
      <section className="card"><h2>SLA policy (sample)</h2><div className="table-wrap"><table><thead><tr><th>Priority</th><th>Response</th><th>Resolution</th></tr></thead><tbody>
        {Object.entries(SLA_TARGETS).map(([p, t]) => <tr key={p}><td>{p}</td><td>{t.response}h</td><td>{t.resolution}h</td></tr>)}</tbody></table></div></section>
      <section className="card"><h2>Application</h2><dl className="kv"><dt>Product</dt><dd>QuickFix 0.3.0</dd><dt>Mode</dt><dd>{import.meta.env.VITE_DATA_MODE === 'api' ? 'Backend API' : 'Demo (localStorage)'}</dd></dl>
        <button className="btn btn-secondary" onClick={() => setConfirm(true)}>Reset demo data…</button></section>
    </div>
    <Modal open={confirm} title="Reset demo data" onClose={() => setConfirm(false)} footer={<><button className="btn btn-secondary" onClick={() => setConfirm(false)}>Cancel</button><button className="btn btn-primary" onClick={reset}>Reset everything</button></>}>
      <p>This restores the original tickets, users and preferences stored in this browser.</p></Modal>
  </>);
}
