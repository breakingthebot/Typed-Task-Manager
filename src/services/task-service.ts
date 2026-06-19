/**
 * src/services/task-service.ts
 * Implements validated task CRUD independently from the user interface.
 * Connects to: models/task.ts, models/storage.ts, utils/, config/app-config.ts
 * Created: 2026-06-18
 */

import { STORAGE_KEY, STORAGE_VERSION } from '../config/app-config';
import type { StoredCollection, StorageAdapter } from '../models/storage';
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  type Task,
  type TaskDraft,
  type TaskFilters,
  type TaskPriority,
  type TaskUpdate,
} from '../models/task';
import { filterBy, removeById, replaceById } from '../utils/collection';
import { log } from '../utils/logger';
import { sanitizeText, validateTaskInput } from '../utils/task-validation';

export class TaskValidationError extends Error {
  /** Creates a domain error with user-safe validation messages. */
  constructor(public readonly messages: string[]) {
    super(messages.join(' '));
    this.name = 'TaskValidationError';
  }
}

export class TaskNotFoundError extends Error {
  /** Creates a domain error for an unknown task ID. */
  constructor(taskId: string) {
    super(`Task with ID "${taskId}" was not found.`);
    this.name = 'TaskNotFoundError';
  }
}

export class TaskService {
  /** Creates a task service backed by the provided storage implementation. */
  constructor(
    private readonly storage: StorageAdapter,
    private readonly createId: () => string = () => crypto.randomUUID(),
    private readonly now: () => string = () => new Date().toISOString(),
  ) {}

  /** Returns tasks filtered by exact fields and a case-insensitive text query. */
  list(filters: TaskFilters = {}): Task[] {
    let tasks = this.readTasks();
    tasks = filterBy(tasks, { status: filters.status, priority: filters.priority });

    if (filters.query) {
      const query = sanitizeText(filters.query).toLocaleLowerCase();
      tasks = tasks.filter((task) =>
        `${task.title} ${task.description}`.toLocaleLowerCase().includes(query),
      );
    }

    return sortTasks(tasks, filters.sort ?? 'updatedAt-desc');
  }

  /** Returns one task or throws when its ID does not exist. */
  get(taskId: string): Task {
    const task = this.readTasks().find(({ id }) => id === taskId);
    if (!task) throw new TaskNotFoundError(taskId);
    return task;
  }

  /** Validates, normalizes, persists, and returns a new task. */
  create(draft: TaskDraft): Task {
    this.assertValid(draft, true);
    const timestamp = this.now();
    const task: Task = {
      id: this.createId(),
      title: sanitizeText(draft.title),
      description: sanitizeText(draft.description ?? ''),
      status: draft.status ?? 'todo',
      priority: draft.priority ?? 'medium',
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    this.writeTasks([...this.readTasks(), task]);
    log('info', 'Task created', { taskId: task.id });
    return task;
  }

  /** Validates, normalizes, persists, and returns an updated task. */
  update(taskId: string, changes: TaskUpdate): Task {
    this.assertValid(changes, false);
    const current = this.get(taskId);
    const updated: Task = {
      ...current,
      ...changes,
      title: changes.title === undefined ? current.title : sanitizeText(changes.title),
      description:
        changes.description === undefined ? current.description : sanitizeText(changes.description),
      updatedAt: this.now(),
    };
    this.writeTasks(replaceById(this.readTasks(), updated));
    log('info', 'Task updated', { taskId });
    return updated;
  }

  /** Deletes a task and returns the removed entity. */
  delete(taskId: string): Task {
    const task = this.get(taskId);
    this.writeTasks(removeById(this.readTasks(), taskId));
    log('info', 'Task deleted', { taskId });
    return task;
  }

  /** Replaces every stored task with the provided collection. */
  replaceAll(tasks: Task[]): void {
    this.assertImportedTasks(tasks);
    this.writeTasks(tasks);
    log('info', 'Task collection replaced', { count: tasks.length });
  }

  /** Converts parsing and storage failures into explicit diagnostic errors. */
  private readTasks(): Task[] {
    const raw = this.storage.read(STORAGE_KEY);
    if (!raw) return [];

    try {
      const collection = JSON.parse(raw) as StoredCollection<Task>;
      if (collection.version !== STORAGE_VERSION || !Array.isArray(collection.items)) {
        throw new Error('Unsupported or malformed storage schema.');
      }
      return collection.items;
    } catch (error) {
      log('error', 'Task storage could not be read', {
        reason: error instanceof Error ? error.message : 'Unknown parsing error',
      });
      throw new Error('Saved tasks could not be loaded. Clear local site data and try again.');
    }
  }

  /** Serializes tasks using the current storage schema version. */
  private writeTasks(tasks: Task[]): void {
    const collection: StoredCollection<Task> = { version: STORAGE_VERSION, items: tasks };
    try {
      this.storage.write(STORAGE_KEY, JSON.stringify(collection));
    } catch (error) {
      log('error', 'Task storage could not be written', {
        reason: error instanceof Error ? error.message : 'Unknown storage error',
      });
      throw new Error('Your task changes could not be saved. Check browser storage and try again.');
    }
  }

  /** Throws a user-safe error when input violates domain constraints. */
  private assertValid(input: TaskDraft | TaskUpdate, requireTitle: boolean): void {
    const result = validateTaskInput(input, requireTitle);
    if (!result.isValid) throw new TaskValidationError(result.issues.map(({ message }) => message));
  }

  /** Validates imported task records before they replace the existing collection. */
  private assertImportedTasks(tasks: Task[]): void {
    if (!Array.isArray(tasks)) {
      throw new Error('Imported tasks must be an array.');
    }

    tasks.forEach((task, index) => {
      if (!isImportedTask(task)) {
        throw new Error(`Imported task at index ${index} is not valid.`);
      }
    });
  }
}

const PRIORITY_RANK: Record<TaskPriority, number> = {
  low: 0,
  medium: 1,
  high: 2,
};

/** Sorts tasks using the active board sort mode. */
function sortTasks(tasks: Task[], sort: TaskFilters['sort']): Task[] {
  const sorted = [...tasks];

  if (sort === 'updatedAt-asc') {
    return sorted.sort((left, right) => left.updatedAt.localeCompare(right.updatedAt));
  }

  if (sort === 'priority-desc') {
    return sorted.sort(
      (left, right) => PRIORITY_RANK[right.priority] - PRIORITY_RANK[left.priority],
    );
  }

  if (sort === 'priority-asc') {
    return sorted.sort(
      (left, right) => PRIORITY_RANK[left.priority] - PRIORITY_RANK[right.priority],
    );
  }

  if (sort === 'title-asc') {
    return sorted.sort((left, right) => left.title.localeCompare(right.title));
  }

  return sorted.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

/** Checks whether an imported value matches the persisted task shape. */
function isImportedTask(value: unknown): value is Task {
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
