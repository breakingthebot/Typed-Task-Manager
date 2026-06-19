/**
 * src/config/app-config.ts
 * Centralizes non-secret runtime configuration and domain limits.
 * Connects to: .env.example, services/task-service.ts, utils/task-validation.ts
 * Created: 2026-06-18
 */

export const APP_NAME = 'Typed Task Manager';
export const STORAGE_KEY = 'typed-task-manager.tasks';
export const STORAGE_VERSION = 1;
export const MAX_TITLE_LENGTH = 120;
export const MAX_DESCRIPTION_LENGTH = 1000;

export type LogLevel = 'debug' | 'info' | 'warning' | 'error';

const requestedLogLevel = (import.meta as ImportMeta & { env?: { VITE_LOG_LEVEL?: string } }).env
  ?.VITE_LOG_LEVEL;

export const LOG_LEVEL: LogLevel = isLogLevel(requestedLogLevel) ? requestedLogLevel : 'warning';

/** Checks whether an unknown runtime value is a supported log level. */
function isLogLevel(value: unknown): value is LogLevel {
  return ['debug', 'info', 'warning', 'error'].includes(String(value));
}
