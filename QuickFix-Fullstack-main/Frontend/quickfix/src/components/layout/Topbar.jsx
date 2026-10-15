import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { ROLES } from '../../data/seedData.js';
import { useTickets } from '../../context/TicketContext.jsx';
import { can } from '../../utils/permissions.js';

export default function Topbar({ onMenu }) {
  const { user, role, switchRole } = useAuth();
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const { tickets } = useTickets();
  const staff = can(role, 'tickets:all');
  const count = staff ? tickets.filter((t) => !t.assigneeId && t.status !== 'Resolved').length : tickets.filter((t) => t.requesterId === user.id && t.status === 'Resolved').length;
  const initials = user.name.split(' ').map((p) => p[0]).join('');
  return (
    <header className="topbar">
      <button className="icon-btn menu-btn" onClick={onMenu} aria-label="Open navigation"><Menu size={20} /></button>
      <form role="search" onSubmit={(e) => { e.preventDefault(); navigate(`/tickets?q=${encodeURIComponent(q)}`); }}>
        <label htmlFor="global-search" className="sr-only">Search tickets</label>
        <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--color-text-muted)' }} aria-hidden="true" />
        <input id="global-search" className="input" style={{ paddingLeft: 36 }} placeholder="Search tickets by ID or title" value={q} onChange={(e) => setQ(e.target.value)} />
      </form>
      <div style={{ flex: 1 }} />
      <button className="icon-btn bell" onClick={() => navigate(staff ? '/agent-workspace' : '/tickets/mine')} aria-label={staff ? `${count} unassigned tickets` : `${count} resolved tickets`} title={staff ? 'Unassigned tickets' : 'Resolved tickets'}><Bell size={18} />{count > 0 && <span className="bell-dot">{count}</span>}</button>
      <label htmlFor="role-switch" className="sr-only">Demo role</label>
      <select id="role-switch" className="select-sm" value={role} onChange={(e) => switchRole(e.target.value)}>
        {Object.values(ROLES).map((r) => <option key={r}>{r}</option>)}
      </select>
      <div className="user-chip"><span className="avatar">{initials}</span><span className="name">{user.name}</span></div>
    </header>
  );
}
