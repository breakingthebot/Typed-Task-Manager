/**
 * src/utils/task-validation.ts
 * Validates and normalizes hostile task input before persistence.
 * Connects to: models/task.ts, config/app-config.ts, services/task-service.ts
 * Created: 2026-06-18
 */

import { MAX_DESCRIPTION_LENGTH, MAX_TITLE_LENGTH } from '../config/app-config';
import type { TaskDraft, TaskUpdate, ValidationIssue, ValidationResult } from '../models/task';

/** Removes control characters and trims a user-provided string. */
export function sanitizeText(value: string): string {
  // Control characters can corrupt persisted JSON and create confusing UI output.
  return [...value]
    .map((character) => (isControlCharacter(character) ? ' ' : character))
    .join('')
    .trim();
}

/** Validates a task draft or partial update against domain constraints. */
export function validateTaskInput(
  input: TaskDraft | TaskUpdate,
  requireTitle: boolean,
): ValidationResult {
  const issues: ValidationIssue[] = [];
  const title = input.title === undefined ? undefined : sanitizeText(input.title);
  const description = input.description === undefined ? undefined : sanitizeText(input.description);

  if (requireTitle && !title) {
    issues.push({ field: 'title', message: 'Title is required.' });
  }
  if (title !== undefined && title.length > MAX_TITLE_LENGTH) {
    issues.push({
      field: 'title',
      message: `Title must be ${MAX_TITLE_LENGTH} characters or fewer.`,
    });
  }
  if (description !== undefined && description.length > MAX_DESCRIPTION_LENGTH) {
    issues.push({
      field: 'description',
      message: `Description must be ${MAX_DESCRIPTION_LENGTH} characters or fewer.`,
    });
  }

  return { isValid: issues.length === 0, issues };
}

/** Detects ASCII control characters that should never be persisted to storage. */
function isControlCharacter(value: string): boolean {
  const codePoint = value.codePointAt(0);
  return codePoint !== undefined && (codePoint <= 31 || codePoint === 127);
}
