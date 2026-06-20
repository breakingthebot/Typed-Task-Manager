/**
 * tests/components/task-templates.test.ts
 * Verifies the reusable task template picker and its callback wiring.
 * Connects to: src/components/task-templates.ts, src/models/task-template.ts
 * Created: 2026-06-19
 */

// @vitest-environment jsdom

import { describe, expect, it, vi } from 'vitest';
import { TASK_TEMPLATES } from '../../src/models/task-template';
import { createTaskTemplates } from '../../src/components/task-templates';

describe('task templates', () => {
  it('renders the starter templates and applies a selected preset', () => {
    const onApplyTemplate = vi.fn();
    document.body.innerHTML = '<div id="app"></div>';
    const root = document.querySelector<HTMLElement>('#app');

    if (!root) throw new Error('Missing app root in test.');

    root.append(createTaskTemplates({ onApplyTemplate }));

    expect(root.textContent).toContain('Task templates');
    expect(root.textContent).toContain('Feature kickoff');
    expect(root.textContent).toContain('Bug triage');
    expect(root.textContent).toContain('Weekly review');

    const buttons = Array.from(document.querySelectorAll('button'));
    const useTemplateButton = buttons.find(
      (button) => button.textContent?.trim() === 'Use template',
    );
    if (!useTemplateButton) {
      throw new Error('Template button not found.');
    }

    useTemplateButton.click();

    expect(onApplyTemplate).toHaveBeenCalledTimes(1);
    expect(onApplyTemplate).toHaveBeenCalledWith(TASK_TEMPLATES[0]);
  });
});
