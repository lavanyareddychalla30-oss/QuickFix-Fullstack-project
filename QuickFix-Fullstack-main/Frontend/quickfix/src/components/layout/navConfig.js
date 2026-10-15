import { LayoutDashboard, Ticket, PlusCircle, Siren, BookOpen, Timer, BarChart3, Headset, Users, Settings } from 'lucide-react';
export const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tickets/mine', label: 'My Tickets', icon: Ticket, perm: 'tickets:own' },
  { to: '/tickets/new', label: 'New Ticket', icon: PlusCircle, perm: 'tickets:create' },
  { to: '/agent-workspace', label: 'Agent Workspace', icon: Headset, perm: 'workspace:view' },
  { to: '/incidents', label: 'All Incidents', icon: Siren, perm: 'tickets:all' },
  { to: '/sla', label: 'SLA Monitoring', icon: Timer, perm: 'sla:view' },
  { to: '/reports', label: 'Reports', icon: BarChart3, perm: 'reports:view' },
  { to: '/knowledge-base', label: 'Knowledge Base', icon: BookOpen, perm: 'kb:read' },
  { to: '/users', label: 'Users', icon: Users, perm: 'users:manage' },
  { to: '/settings', label: 'Settings', icon: Settings, perm: 'settings:manage' },
];
