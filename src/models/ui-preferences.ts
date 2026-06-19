/**
 * src/models/ui-preferences.ts
 * Defines persisted browser preferences for the task board.
 * Connects to: services/ui-preferences-service.ts, components/task-app.ts
 * Created: 2026-06-19
 */

import type { TaskFilters } from './task';

export interface UiPreferences {
  filters: TaskFilters;
}
