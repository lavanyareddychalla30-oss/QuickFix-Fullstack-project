import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import Logo from '../components/layout/Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { ROLES } from '../data/seedData.js';
import { getUsers } from '../utils/userStore.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/dashboard" replace />;

  const enter = (u) => { login(u.id); toast.success(`Signed in as ${u.role} (demo)`); navigate('/dashboard'); };

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!EMAIL_RE.test(email)) errs.email = 'Enter a valid email address.';
    if (password.length < 4) errs.password = 'Password must be at least 4 characters.';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const match = getUsers().find((u) => u.email === email.trim().toLowerCase() && u.active);
    if (!match) { setErrors({ form: 'No active demo account uses that email. Use a quick demo button below.' }); return; }
    setBusy(true);
    setTimeout(() => enter(match), 400);
  };

  const quick = (role) => enter(getUsers().find((u) => u.role === role && u.active));

  return (
    <div className="login">
      <section className="login-art" aria-hidden="true">
        <Logo />
        <svg viewBox="0 0 400 400" fill="none"><rect x="60" y="60" width="240" height="240" rx="48" stroke="#C7A3ED" strokeWidth="1.5"/><rect x="110" y="110" width="240" height="240" rx="48" stroke="#D77AC8" strokeWidth="1.5"/><path d="M215 90 135 220h60l-10 90 90-130h-62z" fill="#8054A4" opacity=".6"/></svg>
        <div><h1>Problems happen. Solutions start here.</h1></div>
      </section>
      <section className="login-form">
        <form className="login-box" onSubmit={submit} noValidate>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Sign in to QuickFix</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 20 }}>IT Help Desk &amp; Incident Management</p>
          {errors.form && <p className="field-error" role="alert" style={{ marginBottom: 12 }}>{errors.form}</p>}
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!errors.email} aria-describedby="email-err" />
            {errors.email && <span id="email-err" className="field-error">Email: {errors.email}</span>}
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <input id="password" className="input" type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={!!errors.password} aria-describedby="pw-err" />
              <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'} style={{ position: 'absolute', right: 6, top: 4, border: 0, background: 'none', padding: 6, color: 'var(--color-text-secondary)' }}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
            {errors.password && <span id="pw-err" className="field-error">Password: {errors.password}</span>}
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
          <p style={{ margin: '20px 0 0', fontWeight: 600 }}>Quick demo login</p>
          <div className="demo-roles">
            {Object.values(ROLES).map((r) => <button type="button" key={r} className="btn btn-secondary" style={{ padding: '0 8px' }} onClick={() => quick(r)}>{r}</button>)}
          </div>
          <p className="note"><ShieldCheck size={13} style={{ verticalAlign: -2 }} /> Demo login is not real authentication. Any password of 4+ characters works with a demo email such as priya.sharma@quickfix.demo.</p>
        </form>
      </section>
    </div>
  );
}
