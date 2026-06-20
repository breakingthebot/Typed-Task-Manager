/**
 * src/components/task-templates.ts
 * Renders reusable task templates for faster task creation.
 * Connects to: models/task-template.ts, components/task-app.ts
 * Created: 2026-06-19
 */

import { TASK_TEMPLATES, type TaskTemplate } from '../models/task-template';

interface TaskTemplatesOptions {
  onApplyTemplate(template: TaskTemplate): void;
}

/** Creates the template picker that fills the task form with starter content. */
export function createTaskTemplates(options: TaskTemplatesOptions): HTMLElement {
  const wrapper = document.createElement('section');
  wrapper.className = 'task-templates';

  const heading = document.createElement('div');
  heading.className = 'section-heading';

  const title = document.createElement('h2');
  title.textContent = 'Task templates';

  const copy = document.createElement('p');
  copy.className = 'panel-copy';
  copy.textContent = 'Use a starter template to prefill the form with a common task shape.';

  heading.append(title, copy);

  const list = document.createElement('div');
  list.className = 'template-grid';

  TASK_TEMPLATES.forEach((template) => {
    list.append(createTemplateCard(template, (selectedTemplate) => options.onApplyTemplate(selectedTemplate)));
  });

  wrapper.append(heading, list);
  return wrapper;
}

/** Creates one clickable template card with a prefill action. */
function createTemplateCard(
  template: TaskTemplate,
  onApplyTemplate: (template: TaskTemplate) => void,
): HTMLElement {
  const card = document.createElement('article');
  card.className = 'template-card';

  const title = document.createElement('h3');
  title.textContent = template.label;

  const description = document.createElement('p');
  description.className = 'task-description';
  description.textContent = template.description;

  const details = document.createElement('p');
  details.className = 'task-meta';
  details.textContent = `${startCase(template.values.status)} · ${startCase(template.values.priority)}`;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'button button-secondary';
  button.textContent = 'Use template';
  button.addEventListener('click', () => onApplyTemplate(template));

  card.append(title, description, details, button);
  return card;
}

/** Converts slug-style template values into readable copy. */
function startCase(value: string): string {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
