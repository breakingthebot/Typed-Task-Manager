/**
 * src/services/storage-adapter.ts
 * Wraps browser storage behind a testable persistence contract.
 * Connects to: models/storage.ts, services/task-service.ts
 * Created: 2026-06-18
 */

import type { StorageAdapter } from '../models/storage';

/** Persists string values through the browser's localStorage API. */
export class BrowserStorageAdapter implements StorageAdapter {
  /** Reads a stored value by key. */
  read(key: string): string | null {
    return window.localStorage.getItem(key);
  }

  /** Writes a stored value by key. */
  write(key: string, value: string): void {
    window.localStorage.setItem(key, value);
  }
}
