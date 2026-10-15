import { describe, it, expect } from 'vitest';
import { getSlaState } from '../utils/slaUtils.js';
const H = 3600000, now = 1_700_000_000_000;
describe('getSlaState', () => {
  it('healthy early', () => expect(getSlaState({ priority: 'Medium', createdAt: now - H }, now)).toBe('Healthy'));
  it('at risk past 75%', () => expect(getSlaState({ priority: 'Critical', createdAt: now - 3.5 * H }, now)).toBe('At risk'));
  it('breached past deadline', () => expect(getSlaState({ priority: 'High', createdAt: now - 9 * H }, now)).toBe('Breached'));
  it('met when resolved in time', () => expect(getSlaState({ priority: 'Low', createdAt: now - 80 * H, resolvedAt: now - 20 * H }, now)).toBe('Met'));
});
