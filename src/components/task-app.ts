/**
 * src/components/task-app.ts
 * Coordinates browser state, task CRUD interactions, and screen rendering.
 * Connects to: models/task.ts, services/task-service.ts, components/task-*.ts
 * Created: 2026-06-18
 */

import { APP_NAME, STORAGE_VERSION } from '../config/app-config';
import type { Task, TaskFilters, TaskStatus } from '../models/task';
import { TaskNotFoundError, TaskValidationError, type TaskService } from '../services/task-service';
import { log } from '../utils/logger';
import { formatTaskTimestamp } from '../utils/date-format';
import { createTaskDataTools } from './task-data-tools';
import { createTaskFilters } from './task-filters';
import { createTaskForm, type TaskFormMode, type TaskFormValues } from './task-form';
import { createTaskList } from './task-list';

interface TaskAppState {
  tasks: Task[];
  filters: TaskFilters;
  mode: TaskFormMode;
  editingTaskId: string | null;
  formValues: TaskFormValues;
  formErrors: string[];
  statusMessage: string;
  loadError: string;
  dataErrors: string[];
  dataText: string;
}

interface TaskApp {
  mount(): void;
}

const DEFAULT_FORM_VALUES: TaskFormValues = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
};

/** Creates the interactive browser application around a task service instance. */
export function createTaskApp(root: HTMLElement, taskService: TaskService): TaskApp {
  const state: TaskAppState = {
    tasks: [],
    filters: { sort: 'updatedAt-desc' },
    mode: 'create',
    editingTaskId: null,
    formValues: { ...DEFAULT_FORM_VALUES },
    formErrors: [],
    statusMessage: 'Ready to manage your work.',
    loadError: '',
    dataErrors: [],
    dataText: '',
  };

  /** Mounts the app with an initial loading state before the first render. */
  function mount(): void {
    renderLoadingState();
    refreshTasks('Loaded saved tasks.');
  }

  /** Re-reads tasks from storage and updates the interface with the latest data. */
  function refreshTasks(statusMessage: string): void {
    try {
      state.tasks = taskService.list(state.filters);
      state.loadError = '';
      state.statusMessage = statusMessage;
      render();
    } catch (error) {
      state.tasks = [];
      state.loadError = getUserMessage(error, 'Tasks could not be loaded.');
      state.statusMessage = 'Storage needs attention before tasks can be used.';
      render();
    }
  }

  /** Updates active filters and rerenders the filtered task list. */
  function handleFilterChange(filters: TaskFilters): void {
    state.filters = filters;
    refreshTasks('Updated task filters.');
  }

  /** Applies form submissions to either create or update one task. */
  function handleFormSubmit(values: TaskFormValues): void {
    try {
      if (state.mode === 'edit' && state.editingTaskId) {
        taskService.update(state.editingTaskId, values);
        state.statusMessage = 'Task updated.';
      } else {
        taskService.create(values);
        state.statusMessage = 'Task created.';
      }

      resetForm();
      refreshTasks(state.statusMessage);
    } catch (error) {
      state.formErrors = getFormMessages(error);
      state.statusMessage = 'Please fix the form and try again.';
      render();
    }
  }

  /** Loads the selected task into edit mode. */
  function handleEdit(taskId: string): void {
    try {
      const task = taskService.get(taskId);
      state.mode = 'edit';
      state.editingTaskId = taskId;
      state.formErrors = [];
      state.formValues = {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
      };
      state.statusMessage = `Editing "${task.title}".`;
      render();
    } catch (error) {
      state.statusMessage = getUserMessage(error, 'Task could not be opened for editing.');
      render();
    }
  }

  /** Removes one task from storage and refreshes the screen. */
  function handleDelete(taskId: string): void {
    try {
      taskService.delete(taskId);
      if (state.editingTaskId === taskId) resetForm();
      refreshTasks('Task deleted.');
    } catch (error) {
      state.statusMessage = getUserMessage(error, 'Task could not be deleted.');
      render();
    }
  }

  /** Applies a quick status change directly from the task list. */
  function handleStatusChange(taskId: string, status: TaskStatus): void {
    try {
      taskService.update(taskId, { status });
      refreshTasks(`Task moved to ${status}.`);
    } catch (error) {
      state.statusMessage = getUserMessage(error, 'Task status could not be changed.');
      render();
    }
  }

  /** Returns the form to create mode with empty values. */
  function handleCancelEdit(): void {
    resetForm();
    state.statusMessage = 'Create mode restored.';
    render();
  }

  /** Exports the full task collection into the JSON panel. */
  function handleExportData(): void {
    try {
      const data = taskService.list({ sort: 'updatedAt-desc' });
      state.dataText = JSON.stringify({ version: STORAGE_VERSION, items: data }, null, 2);
      state.dataErrors = [];
      state.statusMessage = 'Task JSON exported.';
      render();
    } catch (error) {
      state.dataErrors = [getUserMessage(error, 'Task data could not be exported.')];
      render();
    }
  }

  /** Imports task JSON into storage and refreshes the board. */
  function handleImportData(value: string): void {
    try {
      const parsed = JSON.parse(value) as { version?: unknown; items?: unknown };
      if (parsed.version !== STORAGE_VERSION || !Array.isArray(parsed.items)) {
        throw new Error('Import JSON must contain a version 1 task collection.');
      }

      taskService.replaceAll(parsed.items as Task[]);
      state.dataText = JSON.stringify(
        { version: STORAGE_VERSION, items: taskService.list({ sort: 'updatedAt-desc' }) },
        null,
        2,
      );
      state.dataErrors = [];
      state.statusMessage = 'Task data imported.';
      refreshTasks(state.statusMessage);
    } catch (error) {
      state.dataErrors = [getUserMessage(error, 'Task data could not be imported.')];
      render();
    }
  }

  /** Mirrors the JSON textarea as the user edits it. */
  function handleDataInput(value: string): void {
    state.dataText = value;
  }

  /** Replaces the current screen with the full application shell. */
  function render(): void {
    root.replaceChildren(buildShell());
  }

  /** Draws a fast loading view so the app never appears frozen. */
  function renderLoadingState(): void {
    const shell = document.createElement('main');
    shell.className = 'app-shell';

    const loadingCard = document.createElement('section');
    loadingCard.className = 'panel hero-panel';
    loadingCard.setAttribute('aria-busy', 'true');

    const title = document.createElement('h1');
    title.textContent = APP_NAME;

    const message = document.createElement('p');
    message.textContent = 'Loading saved tasks...';

    loadingCard.append(title, message);
    shell.append(loadingCard);
    root.replaceChildren(shell);
  }

  /** Assembles the current app view from focused UI modules. */
  function buildShell(): HTMLElement {
    const shell = document.createElement('main');
    shell.className = 'app-shell';

    const hero = document.createElement('section');
    hero.className = 'panel hero-panel';

    const heading = document.createElement('h1');
    heading.textContent = APP_NAME;

    const summary = document.createElement('p');
    summary.className = 'hero-copy';
    summary.textContent =
      'Track work with typed task data, strict validation, and local-first persistence.';

    const stats = document.createElement('div');
    stats.className = 'hero-stats';
    stats.append(...createBoardStats(state.tasks));

    hero.append(heading, summary, stats);

    const feedback = document.createElement('p');
    feedback.className = state.loadError ? 'feedback error' : 'feedback';
    feedback.setAttribute('role', 'status');
    feedback.setAttribute('aria-live', 'polite');
    feedback.textContent = state.loadError || state.statusMessage;

    const content = document.createElement('div');
    content.className = 'content-grid';

    const formPanel = document.createElement('section');
    formPanel.className = 'panel';
    formPanel.append(
      createTaskForm({
        mode: state.mode,
        values: state.formValues,
        errors: state.formErrors,
        onSubmit: handleFormSubmit,
        onCancel: state.mode === 'edit' ? handleCancelEdit : undefined,
      }),
    );

    const boardPanel = document.createElement('section');
    boardPanel.className = 'panel';
    boardPanel.append(
      createTaskFilters({
        filters: state.filters,
        onChange: handleFilterChange,
      }),
      createTaskList({
        tasks: state.tasks,
        hasLoadError: Boolean(state.loadError),
        onEdit: handleEdit,
        onDelete: handleDelete,
        onStatusChange: handleStatusChange,
      }),
    );

    const dataPanel = createTaskDataTools({
      exportedValue: state.dataText,
      statusMessage: state.statusMessage,
      errors: state.dataErrors,
      onExport: handleExportData,
      onImport: handleImportData,
      onInput: handleDataInput,
    });

    content.append(formPanel, boardPanel);
    shell.append(hero, feedback, content, dataPanel);
    return shell;
  }

  /** Restores create-mode defaults after a successful save or canceled edit. */
  function resetForm(): void {
    state.mode = 'create';
    state.editingTaskId = null;
    state.formErrors = [];
    state.formValues = { ...DEFAULT_FORM_VALUES };
  }

  return { mount };
}

/** Creates one small stat block used in the hero header. */
function createStat(label: string, value: string): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'hero-stat';

  const statLabel = document.createElement('span');
  statLabel.className = 'hero-stat-label';
  statLabel.textContent = label;

  const statValue = document.createElement('strong');
  statValue.className = 'hero-stat-value';
  statValue.textContent = value;

  wrapper.append(statLabel, statValue);
  return wrapper;
}

/** Builds the current visible task counters shown in the hero header. */
function createBoardStats(tasks: Task[]): HTMLElement[] {
  const counts: Record<TaskStatus, number> = {
    todo: 0,
    'in-progress': 0,
    done: 0,
  };

  tasks.forEach((task) => {
    counts[task.status] += 1;
  });

  return [
    createStat('Visible tasks', String(tasks.length)),
    createStat('To do', String(counts.todo)),
    createStat('In progress', String(counts['in-progress'])),
    createStat('Done', String(counts.done)),
    createStat('Last refresh', formatTaskTimestamp(new Date().toISOString())),
  ];
}

/** Normalizes domain and storage errors into a user-facing message. */
function getUserMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    log('warning', 'User-facing task app error', { reason: error.message });
    return error.message;
  }
  log('warning', 'User-facing task app error', { reason: 'Unknown error' });
  return fallback;
}

/** Extracts form-safe validation messages from domain exceptions. */
function getFormMessages(error: unknown): string[] {
  if (error instanceof TaskValidationError) return error.messages;
  if (error instanceof TaskNotFoundError) return [error.message];
  if (error instanceof Error) return [error.message];
  return ['Something unexpected happened while saving the task.'];
}
