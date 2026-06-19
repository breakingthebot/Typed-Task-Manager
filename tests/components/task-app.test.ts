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

/** Changes one text area selected by its visible label. */
function setTextAreaValue(labelText: string, value: string): void {
  const label = findLabel(labelText);
  const textArea = label.querySelector('textarea');
  if (!textArea) throw new Error(`Textarea not found for label "${labelText}".`);
  textArea.value = value;
  textArea.dispatchEvent(new Event('input', { bubbles: true }));
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
