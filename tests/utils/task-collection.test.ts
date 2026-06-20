/**
 * tests/utils/task-collection.test.ts
 * Verifies typed parsing and serialization for task import/export payloads.
 * Connects to: src/utils/task-collection.ts, src/models/task-collection.ts
 * Created: 2026-06-19
 */

import { describe, expect, it } from 'vitest';
import { STORAGE_VERSION } from '../../src/config/app-config';
import { parseTaskCollection, serializeTaskCollection } from '../../src/utils/task-collection';
import type { Task } from '../../src/models/task';

describe('task collection utility', () => {
  it('serializes tasks into a versioned JSON envelope', () => {
    const tasks = [createTask('task-1')];

    const output = serializeTaskCollection(tasks);
    const parsed = JSON.parse(output) as { version: number; items: Task[] };

    expect(parsed.version).toBe(STORAGE_VERSION);
    expect(parsed.items).toHaveLength(1);
    expect(parsed.items[0].id).toBe('task-1');
  });

  it('parses a valid task collection', () => {
    const result = parseTaskCollection(
      JSON.stringify({ version: STORAGE_VERSION, items: [createTask('task-2')] }),
    );

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error('Expected a valid parse result.');
    expect(result.collection.items[0].id).toBe('task-2');
  });

  it('reports typed errors for invalid task collection payloads', () => {
    const malformed = parseTaskCollection('{broken-json');
    const versionMismatch = parseTaskCollection(
      JSON.stringify({ version: STORAGE_VERSION + 1, items: [] }),
    );
    const invalidTask = parseTaskCollection(
      JSON.stringify({ version: STORAGE_VERSION, items: [{ id: 'x' }] }),
    );

    expect(malformed.ok).toBe(false);
    if (malformed.ok) throw new Error('Expected malformed JSON to fail.');
    expect(malformed.issues[0].code).toBe('invalid-json');

    expect(versionMismatch.ok).toBe(false);
    if (versionMismatch.ok) throw new Error('Expected version mismatch to fail.');
    expect(versionMismatch.issues[0].code).toBe('unsupported-version');

    expect(invalidTask.ok).toBe(false);
    if (invalidTask.ok) throw new Error('Expected invalid task payload to fail.');
    expect(invalidTask.issues[0].code).toBe('invalid-item');
  });
});

function createTask(id: string): Task {
  return {
    id,
    title: 'Test task',
    description: 'Task used in parser coverage.',
    status: 'todo',
    priority: 'medium',
    createdAt: '2026-06-19T12:00:00.000Z',
    updatedAt: '2026-06-19T12:00:00.000Z',
  };
}
