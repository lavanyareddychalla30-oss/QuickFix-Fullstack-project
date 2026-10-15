import { NavLink } from 'react-router-dom';
import { PanelLeftClose, PanelLeftOpen, LogOut, X } from 'lucide-react';
import Logo from './Logo.jsx';
import { NAV } from './navConfig.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { can } from '../../utils/permissions.js';

export default function Sidebar({ collapsed, onToggle, open, onClose }) {
  const { role, logout } = useAuth();
  const items = NAV.filter((n) => !n.perm || can(role, n.perm));
  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}${open ? ' open' : ''}`} aria-label="Primary">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo showName={!collapsed} />
        <button className="icon-btn menu-btn" onClick={onClose} aria-label="Close navigation" style={{ background: 'transparent', border: 0, color: 'var(--color-text)' }}><X size={20} /></button>
      </div>
      <nav className="nav">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end title={collapsed ? label : undefined} onClick={onClose}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            <Icon size={19} aria-hidden="true" /><span className="label">{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-foot">
        <button className="nav-item" onClick={onToggle} title="Collapse sidebar" aria-label="Toggle sidebar width">
          {collapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}<span className="label">Collapse</span>
        </button>
        <button className="nav-item" onClick={logout}><LogOut size={19} /><span className="label">Sign out</span></button>
      </div>
    </aside>
  );
}
