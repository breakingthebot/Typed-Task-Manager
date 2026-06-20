/**
 * src/utils/task-collection.ts
 * Parses and serializes the versioned task import/export envelope.
 * Connects to: models/task-collection.ts, models/task.ts
 * Created: 2026-06-19
 */

import { STORAGE_VERSION } from '../config/app-config';
import type { TaskCollectionEnvelope, TaskCollectionParseResult } from '../models/task-collection';
import { TASK_PRIORITIES, TASK_STATUSES, type Task } from '../models/task';

/** Serializes tasks into the versioned JSON envelope used by the UI. */
export function serializeTaskCollection(items: Task[]): string {
  return JSON.stringify({ version: STORAGE_VERSION, items }, null, 2);
}

/** Parses a JSON string into the versioned task envelope with explicit errors. */
export function parseTaskCollection(value: string): TaskCollectionParseResult {
  try {
    const parsed = JSON.parse(value) as Partial<TaskCollectionEnvelope> | null;

    if (!parsed || typeof parsed !== 'object') {
      return {
        ok: false,
        issues: [{ code: 'missing-items', message: 'Task JSON must contain a version and items.' }],
      };
    }

    if (parsed.version !== STORAGE_VERSION) {
      return {
        ok: false,
        issues: [
          {
            code: 'unsupported-version',
            message: `Task JSON must use version ${STORAGE_VERSION}.`,
          },
        ],
      };
    }

    if (!Array.isArray(parsed.items)) {
      return {
        ok: false,
        issues: [
          {
            code: 'missing-items',
            message: 'Task JSON must include an items array.',
          },
        ],
      };
    }

    const invalidIndex = parsed.items.findIndex((item) => !isTask(item));
    if (invalidIndex >= 0) {
      return {
        ok: false,
        issues: [
          {
            code: 'invalid-item',
            message: `Task JSON contains an invalid task at index ${invalidIndex}.`,
          },
        ],
      };
    }

    return {
      ok: true,
      collection: {
        version: STORAGE_VERSION,
        items: parsed.items,
      },
    };
  } catch {
    return {
      ok: false,
      issues: [{ code: 'invalid-json', message: 'Task JSON could not be parsed.' }],
    };
  }
}

/** Checks whether an unknown value matches the persisted task shape. */
function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) return false;

  const record = value as Record<string, unknown>;
  return (
    typeof record.id === 'string' &&
    typeof record.title === 'string' &&
    typeof record.description === 'string' &&
    typeof record.status === 'string' &&
    TASK_STATUSES.includes(record.status as (typeof TASK_STATUSES)[number]) &&
    typeof record.priority === 'string' &&
    TASK_PRIORITIES.includes(record.priority as (typeof TASK_PRIORITIES)[number]) &&
    typeof record.createdAt === 'string' &&
    typeof record.updatedAt === 'string'
  );
}
