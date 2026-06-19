/**
 * src/components/task-form.ts
 * Renders the create and edit task form with validation feedback.
 * Connects to: models/task.ts, components/task-app.ts
 * Created: 2026-06-18
 */

import { TASK_PRIORITIES, TASK_STATUSES, type TaskPriority, type TaskStatus } from '../models/task';

export type TaskFormMode = 'create' | 'edit';

export interface TaskFormValues {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
}

interface TaskFormOptions {
  mode: TaskFormMode;
  values: TaskFormValues;
  errors: string[];
  onSubmit(values: TaskFormValues): void;
  onCancel?(): void;
}

/** Creates the task form with accessible labels, validation, and submit actions. */
export function createTaskForm(options: TaskFormOptions): HTMLElement {
  const form = document.createElement('form');
  form.className = 'task-form';
  form.noValidate = true;

  const heading = document.createElement('h2');
  heading.textContent = options.mode === 'edit' ? 'Edit task' : 'Add a task';

  const intro = document.createElement('p');
  intro.className = 'panel-copy';
  intro.textContent =
    options.mode === 'edit'
      ? 'Update the selected task and save the changes back to local storage.'
      : 'Capture a title, optional notes, and the work state you want to track.';

  const errorList = createErrorList(options.errors);
  const titleField = createTextField({
    id: 'task-title',
    label: 'Title',
    value: options.values.title,
    required: true,
    placeholder: 'Ship the next release',
  });
  const descriptionField = createTextAreaField({
    id: 'task-description',
    label: 'Description',
    value: options.values.description,
    placeholder: 'What matters, what is blocked, and what done looks like.',
  });
  const statusField = createSelectField({
    id: 'task-status',
    label: 'Status',
    value: options.values.status,
    options: TASK_STATUSES.map((status) => ({ value: status, label: startCase(status) })),
  });
  const priorityField = createSelectField({
    id: 'task-priority',
    label: 'Priority',
    value: options.values.priority,
    options: TASK_PRIORITIES.map((priority) => ({ value: priority, label: startCase(priority) })),
  });

  const buttonRow = document.createElement('div');
  buttonRow.className = 'button-row';

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.className = 'button button-primary';
  submitButton.textContent = options.mode === 'edit' ? 'Save changes' : 'Add task';

  buttonRow.append(submitButton);

  if (options.onCancel) {
    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.className = 'button button-secondary';
    cancelButton.textContent = 'Cancel edit';
    cancelButton.addEventListener('click', () => options.onCancel?.());
    buttonRow.append(cancelButton);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    options.onSubmit({
      title: titleField.control.value,
      description: descriptionField.control.value,
      status: statusField.control.value as TaskStatus,
      priority: priorityField.control.value as TaskPriority,
    });
  });

  form.append(
    heading,
    intro,
    errorList,
    titleField.wrapper,
    descriptionField.wrapper,
    statusField.wrapper,
    priorityField.wrapper,
    buttonRow,
  );
  return form;
}

/** Creates the shared validation block for user-safe error messages. */
function createErrorList(errors: string[]): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = errors.length > 0 ? 'form-errors' : 'form-errors hidden';
  wrapper.setAttribute('role', 'alert');
  wrapper.setAttribute('aria-live', 'assertive');

  if (errors.length === 0) return wrapper;

  const heading = document.createElement('strong');
  heading.textContent = 'Fix these issues before saving:';

  const list = document.createElement('ul');
  list.className = 'error-list';

  errors.forEach((error) => {
    const item = document.createElement('li');
    item.textContent = error;
    list.append(item);
  });

  wrapper.append(heading, list);
  return wrapper;
}

/** Creates a labeled text input row and returns both wrapper and control. */
function createTextField(options: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  required: boolean;
}): { wrapper: HTMLElement; control: HTMLInputElement } {
  const wrapper = document.createElement('label');
  wrapper.className = 'field';
  wrapper.htmlFor = options.id;

  const label = document.createElement('span');
  label.className = 'field-label';
  label.textContent = options.label;

  const control = document.createElement('input');
  control.id = options.id;
  control.name = options.id;
  control.type = 'text';
  control.value = options.value;
  control.placeholder = options.placeholder;
  control.required = options.required;
  control.maxLength = 120;

  wrapper.append(label, control);
  return { wrapper, control };
}

/** Creates a labeled text area row and returns both wrapper and control. */
function createTextAreaField(options: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
}): { wrapper: HTMLElement; control: HTMLTextAreaElement } {
  const wrapper = document.createElement('label');
  wrapper.className = 'field';
  wrapper.htmlFor = options.id;

  const label = document.createElement('span');
  label.className = 'field-label';
  label.textContent = options.label;

  const control = document.createElement('textarea');
  control.id = options.id;
  control.name = options.id;
  control.value = options.value;
  control.placeholder = options.placeholder;
  control.rows = 5;
  control.maxLength = 1000;

  wrapper.append(label, control);
  return { wrapper, control };
}

/** Creates a labeled select field with predefined option values. */
function createSelectField(options: {
  id: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
}): { wrapper: HTMLElement; control: HTMLSelectElement } {
  const wrapper = document.createElement('label');
  wrapper.className = 'field';
  wrapper.htmlFor = options.id;

  const label = document.createElement('span');
  label.className = 'field-label';
  label.textContent = options.label;

  const control = document.createElement('select');
  control.id = options.id;
  control.name = options.id;

  options.options.forEach((optionData) => {
    const option = document.createElement('option');
    option.value = optionData.value;
    option.textContent = optionData.label;
    option.selected = optionData.value === options.value;
    control.append(option);
  });

  wrapper.append(label, control);
  return { wrapper, control };
}

/** Converts internal slug values into readable UI labels. */
function startCase(value: string): string {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
