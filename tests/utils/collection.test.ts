/**
 * tests/utils/collection.test.ts
 * Verifies generic collection helpers remain immutable and type-agnostic.
 * Connects to: src/utils/collection.ts
 * Created: 2026-06-18
 */

import { describe, expect, it } from 'vitest';
import { filterBy, removeById, replaceById, sortBy } from '../../src/utils/collection';

interface Item {
  id: string;
  name: string;
  group: string;
}

const items: Item[] = [
  { id: '1', name: 'Bravo', group: 'b' },
  { id: '2', name: 'Alpha', group: 'a' },
];

describe('collection utilities', () => {
  it('filters by defined criteria only', () => {
    expect(filterBy(items, { group: 'a', name: undefined })).toEqual([items[1]]);
  });

  it('sorts a copy without mutating its input', () => {
    expect(sortBy(items, 'name').map(({ name }) => name)).toEqual(['Alpha', 'Bravo']);
    expect(items[0]?.name).toBe('Bravo');
  });

  it('replaces and removes entities by ID immutably', () => {
    const replacement: Item = { id: '1', name: 'Changed', group: 'b' };
    expect(replaceById(items, replacement)[0]).toEqual(replacement);
    expect(removeById(items, '1')).toEqual([items[1]]);
    expect(items).toHaveLength(2);
  });
});
