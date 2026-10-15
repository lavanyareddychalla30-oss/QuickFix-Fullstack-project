import { useEffect, useState } from 'react';
import { Plus, Pencil, Power } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '../components/common/PageHeader.jsx';
import Modal from '../components/common/Modal.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { listUsers, createUser, updateUser } from '../services/userService.js';
import { ROLES } from '../data/seedData.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BLANK = { name: '', email: '', department: '', role: ROLES.EMPLOYEE };

export default function UserManagement() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState(''); const [role, setRole] = useState('');
  const [form, setForm] = useState(null); const [errors, setErrors] = useState({});
  const refresh = () => listUsers().then(setUsers);
  useEffect(() => { refresh(); }, []);
  const s = q.trim().toLowerCase();
  const shown = users.filter((u) => (!role || u.role === role) && (!s || `${u.name} ${u.email} ${u.department}`.toLowerCase().includes(s)));

  const save = async () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = 'Enter a name.';
    if (!EMAIL_RE.test(form.email)) e.email = 'Enter a valid email.';
    else if (users.some((u) => u.email.toLowerCase() === form.email.toLowerCase() && u.id !== form.id)) e.email = 'That email is already used.';
    if (!form.department.trim()) e.department = 'Enter a department.';
    setErrors(e); if (Object.keys(e).length) return;
    const data = { name: form.name.trim(), email: form.email.trim().toLowerCase(), department: form.department.trim(), role: form.role };
    if (form.id) { await updateUser(form.id, data); toast.success('User updated'); } else { await createUser(data); toast.success('User added (demo only)'); }
    setForm(null); refresh();
  };
  const toggle = async (u) => { await updateUser(u.id, { active: !u.active }); toast.success(u.active ? `${u.name} deactivated` : `${u.name} activated`); refresh(); };
  const F = ({ k, label, children }) => (<div className="field"><label htmlFor={`f-${k}`}>{label}</label>{children}{errors[k] && <span className="field-error" role="alert">{label}: {errors[k]}</span>}</div>);
  const inp = (k) => ({ id: `f-${k}`, className: 'input', value: form?.[k] ?? '', 'aria-invalid': !!errors[k], onChange: (e) => setForm({ ...form, [k]: e.target.value }) });

  return (<>
    <PageHeader title="User management" subtitle="Demo users stored in this browser only. No real accounts are created.">
      <button className="btn btn-primary" onClick={() => { setErrors({}); setForm(BLANK); }}><Plus size={18} />Add user</button></PageHeader>
    <section className="card" style={{ padding: 0 }}>
      <div className="toolbar"><div className="search"><label className="sr-only" htmlFor="u-q">Search users</label><input id="u-q" className="input" placeholder="Search name, email or department" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <select className="select-sm" aria-label="Role" value={role} onChange={(e) => setRole(e.target.value)}><option value="">All roles</option>{Object.values(ROLES).map((r) => <option key={r}>{r}</option>)}</select></div>
      <div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Department</th><th>Role</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>
        {shown.map((u) => (<tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.department}</td><td><span className="badge b-info">{u.role}</span></td>
          <td><span className={`badge ${u.active ? 'b-success' : 'b-neutral'}`}>{u.active ? 'Active' : 'Inactive'}</span></td>
          <td><div className="row-actions"><button className="btn btn-secondary" style={{ height: 32 }} onClick={() => { setErrors({}); setForm(u); }}><Pencil size={14} />Edit</button>
            <button className="btn btn-secondary" style={{ height: 32 }} disabled={u.id === me.id} onClick={() => toggle(u)}><Power size={14} />{u.active ? 'Deactivate' : 'Activate'}</button></div></td></tr>))}
      </tbody></table></div>
      {!shown.length && <div className="empty">No users match.</div>}
    </section>
    <Modal open={!!form} title={form?.id ? 'Edit user' : 'Add user'} onClose={() => setForm(null)}
      footer={<><button className="btn btn-secondary" onClick={() => setForm(null)}>Cancel</button><button className="btn btn-primary" onClick={save}>Save user</button></>}>
      {form && <><F k="name" label="Name"><input {...inp('name')} /></F><F k="email" label="Email"><input {...inp('email')} type="email" /></F><F k="department" label="Department"><input {...inp('department')} /></F>
        <F k="role" label="Role"><select {...inp('role')}>{Object.values(ROLES).map((r) => <option key={r}>{r}</option>)}</select></F></>}
    </Modal>
  </>);
}
