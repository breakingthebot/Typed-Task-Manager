/**
 * src/components/task-data-tools.ts
 * Renders import/export controls for moving task data between browsers.
 * Connects to: services/task-service.ts, models/task.ts
 * Created: 2026-06-19
 */

interface TaskDataToolsOptions {
  exportedValue: string;
  statusMessage: string;
  errors: string[];
  onExport: () => void;
  onImport: (value: string) => void;
  onInput: (value: string) => void;
}

/** Creates the data tools panel with a textarea and import/export actions. */
export function createTaskDataTools(options: TaskDataToolsOptions): HTMLElement {
  const wrapper = document.createElement('section');
  wrapper.className = 'panel data-tools';

  const heading = document.createElement('div');
  heading.className = 'section-heading';

  const title = document.createElement('h2');
  title.textContent = 'Import and export';

  const copy = document.createElement('p');
  copy.className = 'panel-copy';
  copy.textContent = 'Export your full task set as JSON, or paste JSON from another browser.';

  heading.append(title, copy);

  const status = document.createElement('p');
  status.className = options.errors.length > 0 ? 'feedback error' : 'feedback';
  status.textContent = options.errors[0] ?? options.statusMessage;

  const field = document.createElement('label');
  field.className = 'field';
  field.htmlFor = 'task-data-json';

  const fieldLabel = document.createElement('span');
  fieldLabel.className = 'field-label';
  fieldLabel.textContent = 'Task JSON';

  const textarea = document.createElement('textarea');
  textarea.id = 'task-data-json';
  textarea.value = options.exportedValue;
  textarea.rows = 8;
  textarea.placeholder = 'Paste exported task JSON here.';
  textarea.addEventListener('input', () => options.onInput(textarea.value));

  field.append(fieldLabel, textarea);

  const buttonRow = document.createElement('div');
  buttonRow.className = 'button-row';

  const exportButton = document.createElement('button');
  exportButton.type = 'button';
  exportButton.className = 'button button-secondary';
  exportButton.textContent = 'Export JSON';
  exportButton.addEventListener('click', () => options.onExport());

  const importButton = document.createElement('button');
  importButton.type = 'button';
  importButton.className = 'button button-primary';
  importButton.textContent = 'Import JSON';
  importButton.addEventListener('click', () => options.onImport(textarea.value));

  buttonRow.append(exportButton, importButton);
  wrapper.append(heading, status, field, buttonRow);
  return wrapper;
}
