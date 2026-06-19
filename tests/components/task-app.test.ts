/**
 * tests/components/task-app.test.ts
 * Verifies browser UI flows for creating, editing, filtering, and deleting tasks.
 * Connects to: src/components/task-app.ts, src/services/task-service.ts
 * Created: 2026-06-18
 */

// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest';
import { STORAGE_KEY } from '../../src/config/app-config';
import { createTaskApp } from '../../src/components/task-app';
import { TaskService } from '../../src/services/task-service';
import { MemoryStorage } from '../helpers/memory-storage';

describe('task app', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    window.localStorage.clear();
  });

  it('creates, filters, edits, and deletes tasks through the browser UI', () => {
    const service = new TaskService(new MemoryStorage(), createIdFactory(), createTimeFactory());
    const root = document.querySelector<HTMLElement>('#app');

    if (!root) throw new Error('Missing app root in test.');

    createTaskApp(root, service).mount();

    setInputValue('Title', 'Plan launch');
    setTextAreaValue('Description', 'Prepare messaging');
    clickButton('Add task');

    expect(root.textContent).toContain('Plan launch');
    expect(root.textContent).toContain('Task created.');

    setInputValue('Search', 'launch');
    expect(root.textContent).toContain('Plan launch');

    clickButton('Edit');
    setInputValue('Title', 'Plan launch week');
    clickButton('Save changes');
    expect(root.textContent).toContain('Plan launch week');

    clickButton('Delete');
    expect(root.textContent).toContain('No tasks match right now');
  });

  it('supports status changes, canceling edits, and storage-load failures', () => {
    const storage = new MemoryStorage();
    const service = new TaskService(storage, createIdFactory(), createTimeFactory());
    const root = document.querySelector<HTMLElement>('#app');

    if (!root) throw new Error('Missing app root in test.');

    createTaskApp(root, service).mount();

    setInputValue('Title', 'Review pull request');
    clickButton('Add task');

    changeSelectValue('Change status for Review pull request', 'done');
    expect(root.textContent).toContain('Task moved to done.');

    clickButton('Edit');
    clickButton('Cancel edit');
    expect(root.textContent).toContain('Create mode restored.');
    expect(root.textContent).toContain('Add a task');

    storage.write(STORAGE_KEY, '{broken-json');
    createTaskApp(root, new TaskService(storage)).mount();
    expect(root.textContent).toContain('Saved tasks could not be loaded.');
  });

  it('groups tasks by status, shows counters, and applies board sorting', () => {
    const service = new TaskService(new MemoryStorage(), createIdFactory(), createTimeFactory());
    const root = document.querySelector<HTMLElement>('#app');

    if (!root) throw new Error('Missing app root in test.');

    createTaskApp(root, service).mount();

    setInputValue('Title', 'Zulu item');
    setSelectValue('Status', 'todo');
    clickButton('Add task');

    setInputValue('Title', 'Alpha item');
    setSelectValue('Status', 'todo');
    clickButton('Add task');

    setInputValue('Title', 'Beta item');
    setSelectValue('Status', 'in-progress');
    clickButton('Add task');

    expect(root.textContent).toContain('Visible tasks3');
    expect(root.textContent).toContain('To do2');
    expect(root.textContent).toContain('In progress1');
    expect(root.textContent).toContain('Done0');

    changeSelectValue('Sort', 'title-asc');

    const todoColumn = getBoardColumn('To do');
    const todoTitles = Array.from(todoColumn.querySelectorAll('h4')).map((node) =>
      node.textContent?.trim(),
    );

    expect(todoTitles).toEqual(['Alpha item', 'Zulu item']);
  });

  it('exports and imports the task collection through the data tools panel', () => {
    const service = new TaskService(new MemoryStorage(), createIdFactory(), createTimeFactory());
    const root = document.querySelector<HTMLElement>('#app');

    if (!root) throw new Error('Missing app root in test.');

    createTaskApp(root, service).mount();

    setInputValue('Title', 'Move this task');
    clickButton('Add task');
    clickButton('Export JSON');

    const exportedJson = getTextareaValue('task-data-json');
    expect(exportedJson).toContain('Move this task');

    document.body.innerHTML = '<div id="app"></div>';
    const importRoot = document.querySelector<HTMLElement>('#app');

    if (!importRoot) throw new Error('Missing app root in import test.');

    createTaskApp(importRoot, new TaskService(new MemoryStorage())).mount();
    setTextareaById('task-data-json', exportedJson);
    clickButton('Import JSON');

    expect(importRoot.textContent).toContain('Task data imported.');
    expect(importRoot.textContent).toContain('Move this task');
  });

  it('supports keyboard shortcuts and undoing a delete', () => {
    const service = new TaskService(new MemoryStorage(), createIdFactory(), createTimeFactory());
    const root = document.querySelector<HTMLElement>('#app');

    if (!root) throw new Error('Missing app root in test.');

    createTaskApp(root, service).mount();

    dispatchShortcut(root, 'f', true);
    expect((document.activeElement as HTMLElement | null)?.id).toBe('task-query');

    setInputValue('Title', 'Keyboard task');
    dispatchShortcut(root, 's', true);
    expect(root.textContent).toContain('Task created.');
    expect(root.textContent).toContain('Keyboard task');

    clickButton('Delete');
    expect(root.textContent).toContain('Deleted "Keyboard task".');
    expect(root.textContent).toContain('Undo delete');

    dispatchShortcut(root, 'z', true);
    expect(root.textContent).toContain('Restored "Keyboard task".');
    expect(root.textContent).toContain('Keyboard task');
  });

  it('shows backup history and restores a saved snapshot', () => {
    const service = new TaskService(new MemoryStorage(), createIdFactory(), createTimeFactory());
    const root = document.querySelector<HTMLElement>('#app');

    if (!root) throw new Error('Missing app root in test.');

    createTaskApp(root, service).mount();

    setInputValue('Title', 'Original task');
    clickButton('Add task');

    clickButton('Edit');
    setInputValue('Title', 'Updated task');
    clickButton('Save changes');

    expect(root.textContent).toContain('Backup history');
    expect(root.textContent).toContain('Task updated');

    const restoreButtons = document.querySelectorAll('.backup-history button');
    const restoreButton = restoreButtons.item(1);
    if (!(restoreButton instanceof HTMLButtonElement)) {
      throw new Error('Restore button not found.');
    }

    restoreButton.click();
    expect(root.textContent).toContain('Restored backup from');
    expect(root.textContent).toContain('Original task');
  });

  it('restores saved board filters on reload', () => {
    const service = new TaskService(new MemoryStorage(), createIdFactory(), createTimeFactory());
    const root = document.querySelector<HTMLElement>('#app');

    if (!root) throw new Error('Missing app root in test.');

    createTaskApp(root, service).mount();

    setInputValue('Title', 'Launch plan');
    setSelectValue('Status', 'in-progress');
    setSelectValue('Priority', 'high');
    clickButton('Add task');

    setInputValue('Search', 'launch');
    changeSelectValue('Status', 'in-progress');
    changeSelectValue('Priority', 'high');
    changeSelectValue('Sort', 'title-asc');

    document.body.innerHTML = '<div id="app"></div>';
    const reloadRoot = document.querySelector<HTMLElement>('#app');
    if (!reloadRoot) throw new Error('Missing app root after reload.');

    createTaskApp(reloadRoot, service).mount();

    expect(getInputValue('Search')).toBe('launch');
    expect(getAriaSelectValue('Status')).toBe('in-progress');
    expect(getAriaSelectValue('Priority')).toBe('high');
    expect(getAriaSelectValue('Sort')).toBe('title-asc');
    expect(reloadRoot.textContent).toContain('Launch plan');
  });
});

/** Creates deterministic task IDs so UI tests can assert stable updates. */
function createIdFactory(): () => string {
  let count = 0;
  return () => `task-${++count}`;
}

/** Creates deterministic timestamps so sorting and labels stay stable in tests. */
function createTimeFactory(): () => string {
  let minute = 0;
  return () => `2026-06-18T12:${String(minute++).padStart(2, '0')}:00.000Z`;
}

/** Changes one text input selected by its visible label. */
function setInputValue(labelText: string, value: string): void {
  const label = findLabel(labelText);
  const input = label.querySelector('input');
  if (!input) throw new Error(`Input not found for label "${labelText}".`);
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

/** Reads the current value of one text input selected by its visible label. */
function getInputValue(labelText: string): string {
  const label = findLabel(labelText);
  const input = label.querySelector('input');
  if (!input) throw new Error(`Input not found for label "${labelText}".`);
  return input.value;
}

/** Changes one text area selected by its visible label. */
function setTextAreaValue(labelText: string, value: string): void {
  const label = findLabel(labelText);
  const textArea = label.querySelector('textarea');
  if (!textArea) throw new Error(`Textarea not found for label "${labelText}".`);
  textArea.value = value;
  textArea.dispatchEvent(new Event('input', { bubbles: true }));
}

/** Changes one textarea by ID. */
function setTextareaById(id: string, value: string): void {
  const textArea = document.getElementById(id);
  if (!(textArea instanceof HTMLTextAreaElement)) {
    throw new Error(`Textarea "${id}" not found.`);
  }
  textArea.value = value;
  textArea.dispatchEvent(new Event('input', { bubbles: true }));
}

/** Changes one select chosen by its visible field label. */
function setSelectValue(labelText: string, value: string): void {
  const label = findLabel(labelText);
  const select = label.querySelector('select');
  if (!select) throw new Error(`Select not found for label "${labelText}".`);
  select.value = value;
  select.dispatchEvent(new Event('change', { bubbles: true }));
}

/** Reads the current value of one select control by its accessible label. */
function getAriaSelectValue(labelText: string): string {
  const select = Array.from(document.querySelectorAll('select')).find(
    (candidate) => candidate.getAttribute('aria-label') === labelText,
  );
  if (!(select instanceof HTMLSelectElement)) {
    throw new Error(`Select "${labelText}" not found.`);
  }
  return select.value;
}

/** Clicks the first button whose text exactly matches the requested label. */
function clickButton(labelText: string): void {
  const button = Array.from(document.querySelectorAll('button')).find(
    (candidate) => candidate.textContent?.trim() === labelText,
  );
  if (!button) throw new Error(`Button "${labelText}" not found.`);
  button.click();
}

/** Changes one select control located by its accessible label. */
function changeSelectValue(labelText: string, value: string): void {
  const select = Array.from(document.querySelectorAll('select')).find(
    (candidate) => candidate.getAttribute('aria-label') === labelText,
  );
  if (!(select instanceof HTMLSelectElement)) {
    throw new Error(`Select "${labelText}" not found.`);
  }
  select.value = value;
  select.dispatchEvent(new Event('change', { bubbles: true }));
}

/** Reads the value of one textarea by ID. */
function getTextareaValue(id: string): string {
  const textArea = document.getElementById(id);
  if (!(textArea instanceof HTMLTextAreaElement)) {
    throw new Error(`Textarea "${id}" not found.`);
  }
  return textArea.value;
}

/** Dispatches one keyboard shortcut event from the app root. */
function dispatchShortcut(target: HTMLElement, key: string, ctrlKey: boolean): void {
  target.dispatchEvent(
    new KeyboardEvent('keydown', {
      bubbles: true,
      ctrlKey,
      metaKey: ctrlKey,
      key,
    }),
  );
}

/** Returns one grouped board column by its visible heading. */
function getBoardColumn(headingText: string): HTMLElement {
  const column = Array.from(document.querySelectorAll('.task-column')).find((candidate) =>
    candidate.textContent?.includes(headingText),
  );
  if (!(column instanceof HTMLElement)) {
    throw new Error(`Task column "${headingText}" not found.`);
  }
  return column;
}

/** Locates one field label by its visible text content. */
function findLabel(labelText: string): HTMLLabelElement {
  const label = Array.from(document.querySelectorAll('label')).find((candidate) =>
    candidate.textContent?.includes(labelText),
  );
  if (!(label instanceof HTMLLabelElement)) {
    throw new Error(`Label "${labelText}" not found.`);
  }
  return label;
}
