/**
 * src/services/ui-preferences-service.ts
 * Stores and restores board preferences without coupling them to task CRUD.
 * Connects to: models/ui-preferences.ts, models/storage.ts, config/app-config.ts
 * Created: 2026-06-19
 */

import { UI_PREFERENCES_KEY, UI_PREFERENCES_VERSION } from '../config/app-config';
import type { StorageAdapter, StoredCollection } from '../models/storage';
import {
  TASK_PRIORITIES,
  TASK_SORT_OPTIONS,
  TASK_STATUSES,
  type TaskFilters,
} from '../models/task';
import type { UiPreferences } from '../models/ui-preferences';
import { log } from '../utils/logger';

const DEFAULT_FILTERS: TaskFilters = { sort: 'updatedAt-desc' };
type TaskSort = Exclude<TaskFilters['sort'], undefined>;

/** Persists and restores the browser's last-used task board preferences. */
export class UiPreferencesService {
  /** Creates a preferences service backed by the provided storage implementation. */
  constructor(private readonly storage: StorageAdapter) {}

  /** Returns the saved filters or a safe default when none exist. */
  readFilters(): TaskFilters {
    const stored = this.readPreferences();
    return stored?.filters ?? { ...DEFAULT_FILTERS };
  }

  /** Saves the current filters for the next browser session. */
  writeFilters(filters: TaskFilters): void {
    const collection: StoredCollection<UiPreferences> = {
      version: UI_PREFERENCES_VERSION,
      items: [{ filters: this.normalizeFilters(filters) }],
    };

    try {
      this.storage.write(UI_PREFERENCES_KEY, JSON.stringify(collection));
    } catch (error) {
      log('warning', 'UI preferences could not be saved', {
        reason: error instanceof Error ? error.message : 'Unknown storage error',
      });
    }
  }

  /** Resets the saved board preferences back to the default filter state. */
  resetFilters(): void {
    this.writeFilters(DEFAULT_FILTERS);
  }

  /** Reads the stored preference record and returns the first saved snapshot. */
  private readPreferences(): UiPreferences | null {
    const raw = this.storage.read(UI_PREFERENCES_KEY);
    if (!raw) return null;

    try {
      const collection = JSON.parse(raw) as StoredCollection<UiPreferences>;
      if (collection.version !== UI_PREFERENCES_VERSION || !Array.isArray(collection.items)) {
        throw new Error('Unsupported or malformed preference schema.');
      }

      const preference = collection.items[0] as Partial<UiPreferences> | undefined;
      if (!preference) return null;
      return { filters: this.normalizeFilters(preference.filters) };
    } catch (error) {
      log('warning', 'UI preferences could not be read', {
        reason: error instanceof Error ? error.message : 'Unknown parsing error',
      });
      return null;
    }
  }

  /** Normalizes unknown filter values into the persisted task filter shape. */
  private normalizeFilters(filters: Partial<TaskFilters> | undefined): TaskFilters {
    const source = filters ?? {};
    const query = source.query;
    const status = source.status;
    const priority = source.priority;
    const sort = source.sort;

    return {
      query: typeof query === 'string' ? query : undefined,
      status: isTaskStatus(status) ? status : undefined,
      priority: isTaskPriority(priority) ? priority : undefined,
      sort: isTaskSort(sort) ? sort : 'updatedAt-desc',
    };
  }
}

/** Checks whether a value matches a supported task status. */
function isTaskStatus(value: unknown): value is TaskFilters['status'] {
  return (
    typeof value === 'string' && TASK_STATUSES.includes(value as (typeof TASK_STATUSES)[number])
  );
}

/** Checks whether a value matches a supported task priority. */
function isTaskPriority(value: unknown): value is TaskFilters['priority'] {
  return (
    typeof value === 'string' && TASK_PRIORITIES.includes(value as (typeof TASK_PRIORITIES)[number])
  );
}

/** Checks whether a value matches a supported task sort option. */
function isTaskSort(value: unknown): value is TaskSort {
  return typeof value === 'string' && TASK_SORT_OPTIONS.includes(value as TaskSort);
}
