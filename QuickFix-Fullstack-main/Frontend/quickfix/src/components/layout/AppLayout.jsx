import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <div className="app">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} open={open} onClose={() => setOpen(false)} />
      {open && <div className="scrim" onClick={() => setOpen(false)} aria-hidden="true" />}
      <div className="main">
        <Topbar onMenu={() => setOpen(true)} />
        <main className="content"><Outlet /></main>
      </div>
    </div>
  );
}
