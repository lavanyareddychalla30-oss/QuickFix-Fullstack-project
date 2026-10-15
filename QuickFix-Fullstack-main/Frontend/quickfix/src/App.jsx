import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppLayout from './components/layout/AppLayout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import MyTickets from './pages/MyTickets.jsx';
import AllIncidents from './pages/AllIncidents.jsx';
import CreateTicket from './pages/CreateTicket.jsx';
import TicketDetails from './pages/TicketDetails.jsx';
import AgentWorkspace from './pages/AgentWorkspace.jsx';
import SLAMonitoring from './pages/SLAMonitoring.jsx';
import Reports from './pages/Reports.jsx';
import KnowledgeBase from './pages/KnowledgeBase.jsx';
import UserManagement from './pages/UserManagement.jsx';
import Settings from './pages/Settings.jsx';
import NotFound from './pages/NotFound.jsx';
import { useAuth } from './context/AuthContext.jsx';
import { can } from './utils/permissions.js';

function RequireAuth() { const { user } = useAuth(); return user ? <AppLayout /> : <Navigate to="/login" replace />; }
function RequirePerm({ perm }) { const { role } = useAuth(); return can(role, perm) ? <Outlet /> : <NotFound />; }

const PAGES = [
  ['/tickets', <MyTickets />, 'tickets:own'], ['/tickets/mine', <MyTickets />, 'tickets:own'],
  ['/tickets/new', <CreateTicket />, 'tickets:create'], ['/tickets/:id', <TicketDetails />, 'tickets:own'],
  ['/incidents', <AllIncidents />, 'tickets:all'], ['/agent-workspace', <AgentWorkspace />, 'workspace:view'],
  ['/sla', <SLAMonitoring />, 'sla:view'], ['/reports', <Reports />, 'reports:view'],
  ['/knowledge-base', <KnowledgeBase />, 'kb:read'], ['/knowledge-base/:id', <KnowledgeBase />, 'kb:read'],
  ['/users', <UserManagement />, 'users:manage'], ['/settings', <Settings />, 'settings:manage'],
];

export default function App() {
  return (<>
    <Toaster position="top-right" toastOptions={{ style: { background: '#33203F', color: '#F3EDF8', border: '1px solid #493B52' } }} />
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<RequireAuth />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {PAGES.map(([path, el, perm]) => <Route key={path} element={<RequirePerm perm={perm} />}><Route path={path} element={el} /></Route>)}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </>);
}
