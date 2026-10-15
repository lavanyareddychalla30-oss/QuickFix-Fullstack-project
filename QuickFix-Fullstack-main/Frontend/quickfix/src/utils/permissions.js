import { ROLES } from '../data/seedData.js';
// Frontend demo checks only. Real authorization must be enforced by Spring Security on the backend.
const MAP = {
  [ROLES.EMPLOYEE]: ['tickets:own', 'tickets:create', 'comment:public', 'kb:read'],
  [ROLES.AGENT]: ['tickets:own', 'tickets:create', 'tickets:all', 'comment:public', 'comment:internal', 'tickets:accept', 'tickets:assign', 'tickets:status', 'tickets:escalate', 'workspace:view', 'kb:read'],
  [ROLES.ADMIN]: ['tickets:own', 'tickets:create', 'tickets:all', 'comment:public', 'comment:internal', 'tickets:assign', 'tickets:status', 'tickets:escalate', 'workspace:view', 'reports:view', 'sla:view', 'users:manage', 'settings:manage', 'kb:read'],
};
export const can = (role, permission) => (MAP[role] || []).includes(permission);
