/**
 * tests/components/task-bulk-actions.test.ts
 * Verifies the bulk actions panel renders the empty and active states.
 * Connects to: src/components/task-bulk-actions.ts
 * Created: 2026-06-19
 */

// @vitest-environment jsdom

import { describe, expect, it, vi } from 'vitest';
import { createTaskBulkActions } from '../../src/components/task-bulk-actions';

describe('task bulk actions', () => {
  it('renders a disabled empty state when nothing is selected', () => {
    const onApplyStatus = vi.fn();
    const onDeleteSelected = vi.fn();
    const onClearSelection = vi.fn();
    const panel = createTaskBulkActions({
      selectedCount: 0,
      onApplyStatus,
      onDeleteSelected,
      onClearSelection,
    });

    expect(panel.textContent).toContain('Select one or more tasks');
    expect(getButton(panel, 'Apply status').disabled).toBe(true);
    expect(getButton(panel, 'Delete selected').disabled).toBe(true);
    expect(getButton(panel, 'Clear selection').disabled).toBe(true);

    getButton(panel, 'Apply status').dispatchEvent(new Event('click', { bubbles: true }));

    expect(onApplyStatus).not.toHaveBeenCalled();
    expect(onDeleteSelected).not.toHaveBeenCalled();
    expect(onClearSelection).not.toHaveBeenCalled();
  });

  it('forwards bulk action events for selected tasks', () => {
    const onApplyStatus = vi.fn();
    const onDeleteSelected = vi.fn();
    const onClearSelection = vi.fn();
    const panel = createTaskBulkActions({
      selectedCount: 2,
      onApplyStatus,
      onDeleteSelected,
      onClearSelection,
    });

    const statusSelect = panel.querySelector<HTMLSelectElement>('#bulk-status');
    if (!statusSelect) throw new Error('Bulk status select not found.');
    statusSelect.value = 'done';
    statusSelect.dispatchEvent(new Event('change', { bubbles: true }));

    getButton(panel, 'Apply status').click();
    getButton(panel, 'Delete selected').click();
    getButton(panel, 'Clear selection').click();

    expect(panel.textContent).toContain('2 task(s) selected.');
    expect(onApplyStatus).toHaveBeenCalledWith('done');
    expect(onDeleteSelected).toHaveBeenCalledTimes(1);
    expect(onClearSelection).toHaveBeenCalledTimes(1);
  });
});

/** Finds one button by its visible label inside a panel. */
function getButton(root: HTMLElement, labelText: string): HTMLButtonElement {
  const button = Array.from(root.querySelectorAll('button')).find(
    (candidate) => candidate.textContent?.trim() === labelText,
  );
  if (!(button instanceof HTMLButtonElement)) {
    throw new Error(`Button "${labelText}" not found.`);
  }
  return button;
}
