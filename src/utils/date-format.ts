/**
 * src/utils/date-format.ts
 * Formats task timestamps into short readable local dates and times.
 * Connects to: components/task-app.ts, components/task-list.ts
 * Created: 2026-06-18
 */

/** Formats one ISO timestamp for compact display in the task UI. */
export function formatTaskTimestamp(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown time';

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}
