import { describe, it, expect } from 'vitest';
import { can } from '../utils/permissions.js';
describe('can', () => {
  it('employee cannot add internal notes', () => expect(can('Employee', 'comment:internal')).toBe(false));
  it('agent can accept tickets', () => expect(can('Agent', 'tickets:accept')).toBe(true));
  it('only admin manages users', () => { expect(can('Administrator', 'users:manage')).toBe(true); expect(can('Agent', 'users:manage')).toBe(false); });
});
