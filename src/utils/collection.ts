/**
 * src/utils/collection.ts
 * Provides reusable generic collection transformations.
 * Connects to: services/task-service.ts
 * Created: 2026-06-18
 */

/** Returns items matching every defined property in the supplied criteria. */
export function filterBy<T extends object>(items: readonly T[], criteria: Partial<T>): T[] {
  const entries = Object.entries(criteria) as [keyof T, T[keyof T]][];
  return items.filter((item) =>
    entries.every(([key, value]) => value === undefined || item[key] === value),
  );
}

/** Returns a new array sorted by a selected comparable property. */
export function sortBy<T, K extends keyof T>(
  items: readonly T[],
  key: K,
  direction: 'asc' | 'desc' = 'asc',
): T[] {
  const multiplier = direction === 'asc' ? 1 : -1;
  return [...items].sort(
    (left, right) => String(left[key]).localeCompare(String(right[key])) * multiplier,
  );
}

/** Creates an immutable copy with one matching entity replaced. */
export function replaceById<T extends { id: string }>(items: readonly T[], replacement: T): T[] {
  return items.map((item) => (item.id === replacement.id ? replacement : item));
}

/** Creates an immutable copy without the entity matching the supplied ID. */
export function removeById<T extends { id: string }>(items: readonly T[], id: string): T[] {
  return items.filter((item) => item.id !== id);
}
