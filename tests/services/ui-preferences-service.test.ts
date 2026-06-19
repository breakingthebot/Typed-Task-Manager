/**
 * tests/services/ui-preferences-service.test.ts
 * Verifies saved board preferences round-trip through storage and fail safely.
 * Connects to: src/services/ui-preferences-service.ts, tests/helpers/memory-storage.ts
 * Created: 2026-06-19
 */

import { describe, expect, it } from 'vitest';
import { UI_PREFERENCES_KEY } from '../../src/config/app-config';
import { UiPreferencesService } from '../../src/services/ui-preferences-service';
import { MemoryStorage } from '../helpers/memory-storage';

describe('UiPreferencesService', () => {
  it('returns defaults when nothing has been saved', () => {
    const service = new UiPreferencesService(new MemoryStorage());

    expect(service.readFilters()).toEqual({ sort: 'updatedAt-desc' });
  });

  it('stores and restores task board filters', () => {
    const storage = new MemoryStorage();
    const service = new UiPreferencesService(storage);

    service.writeFilters({
      query: 'launch',
      status: 'in-progress',
      priority: 'high',
      sort: 'title-asc',
    });

    expect(service.readFilters()).toEqual({
      query: 'launch',
      status: 'in-progress',
      priority: 'high',
      sort: 'title-asc',
    });
  });

  it('treats malformed stored preferences as empty', () => {
    const storage = new MemoryStorage();
    storage.write(UI_PREFERENCES_KEY, '{broken-json');
    const service = new UiPreferencesService(storage);

    expect(service.readFilters()).toEqual({ sort: 'updatedAt-desc' });
  });
});
