/**
 * src/components/task-bulk-actions.ts
 * Renders the bulk action bar for updating or deleting selected tasks.
 * Connects to: models/task.ts, components/task-app.ts
 * Created: 2026-06-19
 */

import { TASK_STATUSES, type TaskStatus } from '../models/task';

interface TaskBulkActionsOptions {
  selectedCount: number;
  onApplyStatus(status: TaskStatus): void;
  onDeleteSelected(): void;
  onClearSelection(): void;
}

/** Creates the bulk action toolbar for the currently selected tasks. */
export function createTaskBulkActions(options: TaskBulkActionsOptions): HTMLElement {
  const wrapper = document.createElement('section');
  wrapper.className = 'panel bulk-actions';

  const heading = document.createElement('div');
  heading.className = 'section-heading';

  const title = document.createElement('h2');
  title.textContent = 'Bulk actions';

  const copy = document.createElement('p');
  copy.className = 'panel-copy';
  copy.textContent =
    options.selectedCount > 0
      ? `${options.selectedCount} task(s) selected.`
      : 'Select one or more tasks to move or delete them together.';

  heading.append(title, copy);

  const controls = document.createElement('div');
  controls.className = 'filter-grid';

  const statusField = document.createElement('label');
  statusField.className = 'field';
  statusField.htmlFor = 'bulk-status';

  const statusLabel = document.createElement('span');
  statusLabel.className = 'field-label';
  statusLabel.textContent = 'Move selected to';

  const statusSelect = document.createElement('select');
  statusSelect.id = 'bulk-status';
  statusSelect.setAttribute('aria-label', 'Bulk status');

  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'Choose a status';
  statusSelect.append(placeholder);

  TASK_STATUSES.forEach((status) => {
    const option = document.createElement('option');
    option.value = status;
    option.textContent = status.replace('-', ' ');
    statusSelect.append(option);
  });

  statusField.append(statusLabel, statusSelect);

  const buttonRow = document.createElement('div');
  buttonRow.className = 'button-row';

  const applyButton = document.createElement('button');
  applyButton.type = 'button';
  applyButton.className = 'button button-primary';
  applyButton.textContent = 'Apply status';
  applyButton.disabled = options.selectedCount === 0;
  applyButton.addEventListener('click', () => {
    if (!statusSelect.value) return;
    options.onApplyStatus(statusSelect.value as TaskStatus);
  });

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'button button-danger';
  deleteButton.textContent = 'Delete selected';
  deleteButton.disabled = options.selectedCount === 0;
  deleteButton.addEventListener('click', () => options.onDeleteSelected());

  const clearButton = document.createElement('button');
  clearButton.type = 'button';
  clearButton.className = 'button button-secondary';
  clearButton.textContent = 'Clear selection';
  clearButton.disabled = options.selectedCount === 0;
  clearButton.addEventListener('click', () => options.onClearSelection());

  buttonRow.append(applyButton, deleteButton, clearButton);
  controls.append(statusField, buttonRow);
  wrapper.append(heading, controls);
  return wrapper;
}
