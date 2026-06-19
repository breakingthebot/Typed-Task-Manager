/**
 * src/utils/logger.ts
 * Emits structured, level-aware diagnostic events without sensitive payloads.
 * Connects to: config/app-config.ts, services/task-service.ts
 * Created: 2026-06-18
 */

import { LOG_LEVEL, type LogLevel } from '../config/app-config';

interface LogEvent {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
}

const LOG_RANK: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warning: 2,
  error: 3,
};

/** Writes a structured event when its level meets the configured threshold. */
export function log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
  if (LOG_RANK[level] < LOG_RANK[LOG_LEVEL]) return;

  const event: LogEvent = { timestamp: new Date().toISOString(), level, message, context };
  const output = JSON.stringify(event);

  if (level === 'error') console.error(output);
  else if (level === 'warning') console.warn(output);
  else console.info(output);
}
