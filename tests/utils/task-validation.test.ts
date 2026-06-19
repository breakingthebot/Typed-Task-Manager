/**
 * tests/utils/task-validation.test.ts
 * Verifies normalization and validation at the task domain boundary.
 * Connects to: src/utils/task-validation.ts, src/config/app-config.ts
 * Created: 2026-06-18
 */

import { describe, expect, it } from 'vitest';
import { MAX_DESCRIPTION_LENGTH, MAX_TITLE_LENGTH } from '../../src/config/app-config';
import { sanitizeText, validateTaskInput } from '../../src/utils/task-validation';

describe('task validation', () => {
  it('sanitizes control characters and surrounding whitespace', () => {
    expect(sanitizeText('  safe\u0000title  ')).toBe('safe title');
  });

  it('requires a title when creating a task', () => {
    expect(validateTaskInput({ title: '  ' }, true)).toEqual({
      isValid: false,
      issues: [{ field: 'title', message: 'Title is required.' }],
    });
  });

  it('rejects fields beyond configured limits', () => {
    const result = validateTaskInput(
      {
        title: 'x'.repeat(MAX_TITLE_LENGTH + 1),
        description: 'x'.repeat(MAX_DESCRIPTION_LENGTH + 1),
      },
      true,
    );
    expect(result.issues).toHaveLength(2);
  });
});
