/**
 * src/models/task-collection.ts
 * Defines the typed JSON envelope used for task import and export.
 * Connects to: utils/task-collection.ts, components/task-app.ts
 * Created: 2026-06-19
 */

import type { Task } from './task';

export interface TaskCollectionEnvelope {
  version: number;
  items: Task[];
}

export type TaskCollectionIssueCode =
  | 'invalid-json'
  | 'unsupported-version'
  | 'missing-items'
  | 'invalid-item';

export interface TaskCollectionIssue {
  code: TaskCollectionIssueCode;
  message: string;
}

export interface TaskCollectionParseSuccess {
  ok: true;
  collection: TaskCollectionEnvelope;
}

export interface TaskCollectionParseFailure {
  ok: false;
  issues: TaskCollectionIssue[];
}

export type TaskCollectionParseResult = TaskCollectionParseSuccess | TaskCollectionParseFailure;
