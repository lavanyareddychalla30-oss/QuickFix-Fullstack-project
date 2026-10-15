import { describe, it, expect } from 'vitest';
import { generateTicketId, filterTickets, toCSV } from '../utils/ticketUtils.js';
import { validateTicket } from '../utils/validation.js';
const mk = (id, over = {}) => ({ id, title: 'VPN down', category: 'Network', priority: 'High', status: 'New', requesterId: 'u1', assigneeId: null, createdAt: 1_700_000_000_000, ...over });
describe('ticketUtils', () => {
  it('generates the next unique id', () => expect(generateTicketId([mk('QF-1001'), mk('QF-1030')])).toBe('QF-1031'));
  it('filters by search, status and priority', () => {
    const l = [mk('QF-1001'), mk('QF-1002', { title: 'Printer', status: 'Resolved', priority: 'Low' })];
    expect(filterTickets(l, { q: 'printer' })).toHaveLength(1);
    expect(filterTickets(l, { status: 'New', priority: 'High' })).toHaveLength(1);
    expect(filterTickets(l, { assignee: 'none' })).toHaveLength(2);
  });
  it('exports one CSV row per ticket plus header', () => expect(toCSV([mk('QF-1001')]).split('\n')).toHaveLength(2));
});
describe('validateTicket', () => {
  it('flags missing fields', () => expect(Object.keys(validateTicket({}))).toEqual(['title', 'description', 'category']));
  it('accepts a valid ticket', () => expect(validateTicket({ title: 'VPN fails', description: 'Cannot connect to the VPN since morning.', category: 'Network' })).toEqual({}));
});
