/**
 * src/models/task-template.ts
 * Defines reusable starter templates for common task creation scenarios.
 * Connects to: components/task-templates.ts, components/task-app.ts, components/task-form.ts
 * Created: 2026-06-19
 */

import type { TaskPriority, TaskStatus } from './task';

export interface TaskTemplateValues {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
}

export interface TaskTemplate {
  id: string;
  label: string;
  description: string;
  values: TaskTemplateValues;
}

export const TASK_TEMPLATES: TaskTemplate[] = [
  {
    id: 'template-feature',
    label: 'Feature kickoff',
    description: 'Start a scoped feature with a clear goal and a medium priority.',
    values: {
      title: 'Plan the next feature',
      description: 'Define the user goal, success criteria, and first implementation slice.',
      status: 'todo',
      priority: 'medium',
    },
  },
  {
    id: 'template-bug',
    label: 'Bug triage',
    description: 'Capture an urgent fix that needs immediate attention.',
    values: {
      title: 'Investigate the reported bug',
      description: 'Reproduce the issue, isolate the cause, and verify the fix.',
      status: 'in-progress',
      priority: 'high',
    },
  },
  {
    id: 'template-review',
    label: 'Weekly review',
    description: 'Create a low-pressure review task for cleanup and follow-up work.',
    values: {
      title: 'Review open follow-ups',
      description: 'Check pending tasks, close completed work, and note blockers.',
      status: 'todo',
      priority: 'low',
    },
  },
];
