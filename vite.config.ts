/**
 * vite.config.ts
 * Configures Vite builds and Vitest coverage for the task manager.
 * Connects to: package.json, src/, tests/
 * Created: 2026-06-18
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      thresholds: {
        lines: 90,
        functions: 90,
        statements: 90,
        branches: 85,
      },
    },
    include: ['tests/**/*.test.ts'],
  },
});
