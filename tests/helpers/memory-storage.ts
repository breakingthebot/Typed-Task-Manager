/**
 * tests/helpers/memory-storage.ts
 * Provides deterministic storage for service unit tests.
 * Connects to: models/storage.ts, tests/services/task-service.test.ts
 * Created: 2026-06-18
 */

import type { StorageAdapter } from '../../src/models/storage';

export class MemoryStorage implements StorageAdapter {
  private readonly values = new Map<string, string>();

  /** Reads an in-memory value by key. */
  read(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  /** Writes an in-memory value by key. */
  write(key: string, value: string): void {
    this.values.set(key, value);
  }
}
