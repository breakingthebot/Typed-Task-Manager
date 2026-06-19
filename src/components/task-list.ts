/**
 * src/components/task-list.ts
 * Renders the visible task cards, empty state, and quick task actions.
 * Connects to: models/task.ts, components/task-app.ts, utils/date-format.ts
 * Created: 2026-06-18
 */

import { TASK_STATUSES, type Task, type TaskStatus } from '../models/task';
import { formatTaskTimestamp } from '../utils/date-format';

interface TaskListOptions {
  tasks: Task[];
  hasLoadError: boolean;
  onEdit(taskId: string): void;
  onDelete(taskId: string): void;
  onStatusChange(taskId: string, status: TaskStatus): void;
}

/** Creates the task list or an appropriate empty/error state. */
export function createTaskList(options: TaskListOptions): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'task-list';

  if (options.hasLoadError) {
    wrapper.append(createEmptyState('Storage error', 'Resolve the storage problem to view tasks.'));
    return wrapper;
  }

  if (options.tasks.length === 0) {
    wrapper.append(
      createEmptyState(
        'No tasks match right now',
        'Add a task or change the current filters to bring work back into view.',
      ),
    );
    return wrapper;
  }

  const list = document.createElement('ul');
  list.className = 'task-card-list';

  options.tasks.forEach((task) => {
    list.append(createTaskCard(task, options));
  });

  wrapper.append(list);
  return wrapper;
}

/** Creates one task card with status, timestamps, and quick actions. */
function createTaskCard(task: Task, options: TaskListOptions): HTMLElement {
  const item = document.createElement('li');
  item.className = 'task-card';

  const header = document.createElement('div');
  header.className = 'task-card-header';

  const titleGroup = document.createElement('div');

  const title = document.createElement('h3');
  title.textContent = task.title;

  const meta = document.createElement('p');
  meta.className = 'task-meta';
  meta.textContent = `Priority ${task.priority} · Updated ${formatTaskTimestamp(task.updatedAt)}`;

  titleGroup.append(title, meta);

  const statusBadge = document.createElement('span');
  statusBadge.className = `status-badge status-${task.status}`;
  statusBadge.textContent = task.status.replace('-', ' ');

  header.append(titleGroup, statusBadge);

  const description = document.createElement('p');
  description.className = 'task-description';
  description.textContent = task.description || 'No description provided.';

  const footer = document.createElement('div');
  footer.className = 'task-card-footer';

  const statusLabel = document.createElement('label');
  statusLabel.className = 'inline-select';
  statusLabel.htmlFor = `task-status-${task.id}`;

  const statusText = document.createElement('span');
  statusText.textContent = 'Move to';

  const statusSelect = document.createElement('select');
  statusSelect.id = `task-status-${task.id}`;
  statusSelect.setAttribute('aria-label', `Change status for ${task.title}`);

  TASK_STATUSES.forEach((status) => {
    const option = document.createElement('option');
    option.value = status;
    option.textContent = status.replace('-', ' ');
    option.selected = status === task.status;
    statusSelect.append(option);
  });

  statusSelect.addEventListener('change', () => {
    options.onStatusChange(task.id, statusSelect.value as TaskStatus);
  });

  statusLabel.append(statusText, statusSelect);

  const buttonRow = document.createElement('div');
  buttonRow.className = 'button-row compact';

  const editButton = document.createElement('button');
  editButton.type = 'button';
  editButton.className = 'button button-secondary';
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', () => options.onEdit(task.id));

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'button button-danger';
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => options.onDelete(task.id));

  buttonRow.append(editButton, deleteButton);
  footer.append(statusLabel, buttonRow);
  item.append(header, description, footer);
  return item;
}

/** Creates a reusable state panel for empty and unavailable task lists. */
function createEmptyState(titleText: string, copyText: string): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'empty-state';

  const title = document.createElement('h3');
  title.textContent = titleText;

  const copy = document.createElement('p');
  copy.textContent = copyText;

  wrapper.append(title, copy);
  return wrapper;
}
