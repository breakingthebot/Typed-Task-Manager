/**
 * tests/utils/date-format.test.ts
 * Verifies compact task timestamp formatting for valid and invalid values.
 * Connects to: src/utils/date-format.ts
 * Created: 2026-06-18
 */

import { describe, expect, it } from 'vitest';
import { formatTaskTimestamp } from '../../src/utils/date-format';

describe('formatTaskTimestamp', () => {
  it('formats valid ISO strings into readable local output', () => {
    expect(formatTaskTimestamp('2026-06-18T12:00:00.000Z')).not.toBe('Unknown time');
  });

  it('returns a safe fallback when the timestamp is invalid', () => {
    expect(formatTaskTimestamp('not-a-date')).toBe('Unknown time');
  });
});
