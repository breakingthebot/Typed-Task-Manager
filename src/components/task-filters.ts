/**
 * src/components/task-filters.ts
 * Renders task query and select filters for the browser task board.
 * Connects to: models/task.ts, components/task-app.ts
 * Created: 2026-06-18
 */

import { TASK_PRIORITIES, TASK_STATUSES, type TaskFilters } from '../models/task';

interface TaskFilterOptions {
  filters: TaskFilters;
  onChange(filters: TaskFilters): void;
}

/** Creates the filter bar and emits the current filter state after each change. */
export function createTaskFilters(options: TaskFilterOptions): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'task-filters';

  const heading = document.createElement('div');
  heading.className = 'section-heading';

  const title = document.createElement('h2');
  title.textContent = 'Task board';

  const copy = document.createElement('p');
  copy.className = 'panel-copy';
  copy.textContent = 'Search by text or narrow the board by status and priority.';

  heading.append(title, copy);

  const controls = document.createElement('div');
  controls.className = 'filter-grid';

  const queryField = createFilterInput(
    'task-query',
    'Search',
    options.filters.query ?? '',
    'Search title or description',
  );
  const statusField = createFilterSelect('filter-status', 'Status', options.filters.status, [
    { value: '', label: 'All statuses' },
    ...TASK_STATUSES.map((status) => ({ value: status, label: startCase(status) })),
  ]);
  const priorityField = createFilterSelect(
    'filter-priority',
    'Priority',
    options.filters.priority,
    [
      { value: '', label: 'All priorities' },
      ...TASK_PRIORITIES.map((priority) => ({ value: priority, label: startCase(priority) })),
    ],
  );

  const syncFilters = (): void => {
    options.onChange({
      query: queryField.value.trim() || undefined,
      status: (statusField.value || undefined) as TaskFilters['status'],
      priority: (priorityField.value || undefined) as TaskFilters['priority'],
    });
  };

  queryField.addEventListener('input', syncFilters);
  statusField.addEventListener('change', syncFilters);
  priorityField.addEventListener('change', syncFilters);

  controls.append(
    wrapFilter('Search', queryField),
    wrapFilter('Status', statusField),
    wrapFilter('Priority', priorityField),
  );
  wrapper.append(heading, controls);
  return wrapper;
}

/** Creates a labeled filter wrapper around one form control. */
function wrapFilter(labelText: string, control: HTMLInputElement | HTMLSelectElement): HTMLElement {
  const wrapper = document.createElement('label');
  wrapper.className = 'field';
  wrapper.htmlFor = control.id;

  const label = document.createElement('span');
  label.className = 'field-label';
  label.textContent = labelText;

  wrapper.append(label, control);
  return wrapper;
}

/** Creates the text input used for freeform filtering. */
function createFilterInput(
  id: string,
  ariaLabel: string,
  value: string,
  placeholder: string,
): HTMLInputElement {
  const input = document.createElement('input');
  input.id = id;
  input.type = 'search';
  input.value = value;
  input.placeholder = placeholder;
  input.setAttribute('aria-label', ariaLabel);
  return input;
}

/** Creates one select filter populated from task enum values. */
function createFilterSelect(
  id: string,
  ariaLabel: string,
  value: string | undefined,
  options: { value: string; label: string }[],
): HTMLSelectElement {
  const select = document.createElement('select');
  select.id = id;
  select.setAttribute('aria-label', ariaLabel);

  options.forEach((optionData) => {
    const option = document.createElement('option');
    option.value = optionData.value;
    option.textContent = optionData.label;
    option.selected = optionData.value === (value ?? '');
    select.append(option);
  });

  return select;
}

/** Converts task slug values into readable labels for filter controls. */
function startCase(value: string): string {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
