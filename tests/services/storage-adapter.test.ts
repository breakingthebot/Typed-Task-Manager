/**
 * tests/services/storage-adapter.test.ts
 * Verifies the browser storage adapter reads from and writes to localStorage.
 * Connects to: src/services/storage-adapter.ts
 * Created: 2026-06-18
 */

// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest';
import { BrowserStorageAdapter } from '../../src/services/storage-adapter';

describe('BrowserStorageAdapter', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('round-trips stored values through browser localStorage', () => {
    const adapter = new BrowserStorageAdapter();

    adapter.write('task-key', 'stored-value');

    expect(adapter.read('task-key')).toBe('stored-value');
  });
});
