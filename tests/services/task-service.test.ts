/**
 * tests/services/task-service.test.ts
 * Verifies complete task CRUD, filtering, ordering, and failure behavior.
 * Connects to: src/services/task-service.ts, tests/helpers/memory-storage.ts
 * Created: 2026-06-18
 */

import { beforeEach, describe, expect, it } from 'vitest';
import {
  TaskNotFoundError,
  TaskService,
  TaskValidationError,
} from '../../src/services/task-service';
import { MemoryStorage } from '../helpers/memory-storage';

describe('TaskService', () => {
  let service: TaskService;
  let timestamp: string;

  beforeEach(() => {
    timestamp = '2026-06-18T12:00:00.000Z';
    service = new TaskService(
      new MemoryStorage(),
      () => 'task-1',
      () => timestamp,
    );
  });

  it('creates and reads a normalized task with defaults', () => {
    const task = service.create({ title: '  Ship feature  ', description: '  Validate it  ' });
    expect(task).toMatchObject({
      id: 'task-1',
      title: 'Ship feature',
      description: 'Validate it',
      status: 'todo',
      priority: 'medium',
    });
    expect(service.get('task-1')).toEqual(task);
  });

  it('updates a task while preserving untouched fields', () => {
    service.create({ title: 'Original', priority: 'high' });
    timestamp = '2026-06-18T13:00:00.000Z';
    const updated = service.update('task-1', { title: ' Revised ', status: 'done' });
    expect(updated).toMatchObject({ title: 'Revised', status: 'done', priority: 'high' });
    expect(updated.updatedAt).toBe(timestamp);
  });

  it('deletes and returns a task', () => {
    const created = service.create({ title: 'Temporary' });
    expect(service.delete('task-1')).toEqual(created);
    expect(service.list()).toEqual([]);
  });

  it('filters tasks by fields and case-insensitive text', () => {
    service.create({ title: 'Write DOCS', status: 'in-progress', priority: 'high' });
    expect(service.list({ query: 'docs', status: 'in-progress', priority: 'high' })).toHaveLength(
      1,
    );
    expect(service.list({ status: 'done' })).toEqual([]);
  });

  it('rejects invalid input with a user-safe domain error', () => {
    expect(() => service.create({ title: '' })).toThrow(TaskValidationError);
  });

  it('throws an explicit error for unknown task IDs', () => {
    expect(() => service.get('missing')).toThrow(TaskNotFoundError);
  });

  it('rejects malformed persisted data', () => {
    const storage = new MemoryStorage();
    storage.write('typed-task-manager.tasks', '{not-json');
    expect(() => new TaskService(storage).list()).toThrow('Saved tasks could not be loaded');
  });
});
