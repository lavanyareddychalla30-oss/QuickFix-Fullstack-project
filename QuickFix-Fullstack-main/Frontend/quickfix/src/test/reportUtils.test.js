import { describe, it, expect } from 'vitest';
import { countBy, avgResolutionHours, volumeByDay } from '../utils/reportUtils.js';
const H = 36e5, now = 1_700_000_000_000;
describe('reportUtils', () => {
  it('counts by key', () => expect(countBy([{ a: 'x' }, { a: 'x' }, { a: 'y' }], 'a')).toEqual([{ name: 'x', value: 2 }, { name: 'y', value: 1 }]));
  it('averages resolution hours', () => expect(avgResolutionHours([{ createdAt: 0, resolvedAt: 2 * H }, { createdAt: 0, resolvedAt: 4 * H }, { createdAt: 0 }])).toBe(3));
  it('builds one bucket per day', () => expect(volumeByDay([{ createdAt: now - H }], 7, now)).toHaveLength(7));
});
