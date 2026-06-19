/**
 * src/models/task-backup.ts
 * Defines stored task snapshot records used by the backup history panel.
 * Connects to: services/task-service.ts, components/task-backup-history.ts
 * Created: 2026-06-19
 */

import type { Task } from './task';

export interface TaskBackupRecord {
  capturedAt: string;
  label: string;
  items: Task[];
}
