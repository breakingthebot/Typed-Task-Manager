/**
 * src/models/storage.ts
 * Defines persisted collection and storage adapter contracts.
 * Connects to: services/storage-adapter.ts, services/task-service.ts
 * Created: 2026-06-18
 */

export interface StoredCollection<T> {
  version: number;
  items: T[];
}

export interface StorageAdapter {
  read(key: string): string | null;
  write(key: string, value: string): void;
}
