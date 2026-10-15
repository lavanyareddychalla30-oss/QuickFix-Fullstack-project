// Deterministic demo data. Ticket timestamps are computed once relative to first load, then persisted.
export const ROLES = { EMPLOYEE: 'Employee', AGENT: 'Agent', ADMIN: 'Administrator' };

export const SEED_USERS = [
  { id: 'u1', name: 'Priya Sharma', email: 'priya.sharma@quickfix.demo', department: 'Finance', role: ROLES.EMPLOYEE, active: true },
  { id: 'u2', name: 'Rahul Verma', email: 'rahul.verma@quickfix.demo', department: 'Engineering', role: ROLES.EMPLOYEE, active: true },
  { id: 'u3', name: 'Ananya Rao', email: 'ananya.rao@quickfix.demo', department: 'HR', role: ROLES.EMPLOYEE, active: true },
  { id: 'u4', name: 'Karthik Reddy', email: 'karthik.reddy@quickfix.demo', department: 'IT Support', role: ROLES.AGENT, active: true },
  { id: 'u5', name: 'Meera Nair', email: 'meera.nair@quickfix.demo', department: 'IT Support', role: ROLES.AGENT, active: true },
  { id: 'u6', name: 'Arjun Patel', email: 'arjun.patel@quickfix.demo', department: 'IT Support', role: ROLES.AGENT, active: true },
  { id: 'u7', name: 'Sana Iqbal', email: 'sana.iqbal@quickfix.demo', department: 'IT Operations', role: ROLES.ADMIN, active: true },
  { id: 'u8', name: 'Vikram Singh', email: 'vikram.singh@quickfix.demo', department: 'Sales', role: ROLES.EMPLOYEE, active: false },
];

export const STATUSES = ['New', 'Assigned', 'In Progress', 'Escalated', 'Resolved'];
export const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

const TEMPLATES = [
  ['VPN connection failure', 'Network'], ['Password reset request', 'Access Request'],
  ['Laptop overheating', 'Hardware'], ['Email synchronization problem', 'Email'],
  ['Software installation request', 'Software'], ['Printer connectivity failure', 'Hardware'],
  ['Suspicious email report', 'Email'], ['Database access request', 'Access Request'],
  ['Wi-Fi connectivity issue', 'Network'], ['Application crash on launch', 'Software'],
];
const HOUR = 3600000;

export function buildSeedTickets(now = Date.now()) {
  const employees = SEED_USERS.filter((u) => u.role === ROLES.EMPLOYEE && u.active);
  const agents = SEED_USERS.filter((u) => u.role === ROLES.AGENT);
  return Array.from({ length: 26 }, (_, i) => {
    const [title, category] = TEMPLATES[i % TEMPLATES.length];
    const status = STATUSES[(i * 3 + 1) % STATUSES.length];
    const createdAt = now - (((i * 7) % 90) + 1) * HOUR;
    const assigned = status !== 'New';
    return {
      id: `QF-${1001 + i}`,
      title,
      description: `${title}. Reported via the QuickFix portal (demo data).`,
      category,
      priority: PRIORITIES[(i * 5 + (i % 3)) % 4],
      status,
      requesterId: employees[i % employees.length].id,
      assigneeId: assigned ? agents[i % agents.length].id : null,
      createdAt,
      updatedAt: createdAt + HOUR,
      resolvedAt: status === 'Resolved' ? createdAt + (((i % 5) + 1) * 2 * HOUR) : null,
    };
  });
}
