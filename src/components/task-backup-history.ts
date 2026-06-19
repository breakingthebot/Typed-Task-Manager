/**
 * src/components/task-backup-history.ts
 * Renders the recent snapshot history used for task recovery.
 * Connects to: models/task-backup.ts, services/task-service.ts, utils/date-format.ts
 * Created: 2026-06-19
 */

import type { TaskBackupRecord } from '../models/task-backup';
import { formatTaskTimestamp } from '../utils/date-format';

interface TaskBackupHistoryOptions {
  backups: TaskBackupRecord[];
  onRestore: (index: number) => void;
}

/** Creates the snapshot history panel with restore actions for recent backups. */
export function createTaskBackupHistory(options: TaskBackupHistoryOptions): HTMLElement {
  const wrapper = document.createElement('section');
  wrapper.className = 'panel backup-history';

  const heading = document.createElement('div');
  heading.className = 'section-heading';

  const title = document.createElement('h2');
  title.textContent = 'Backup history';

  const copy = document.createElement('p');
  copy.className = 'panel-copy';
  copy.textContent =
    'Restore one of the latest snapshots if a change needs to be rolled back quickly.';

  heading.append(title, copy);

  if (options.backups.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'feedback';
    empty.textContent =
      'No backups yet. Any create, update, delete, import, or restore action will add one.';
    wrapper.append(heading, empty);
    return wrapper;
  }

  const list = document.createElement('div');
  list.className = 'backup-list';

  options.backups.forEach((backup, index) => {
    const item = document.createElement('article');
    item.className = 'backup-entry';

    const itemHeading = document.createElement('h3');
    itemHeading.textContent = `${backup.label} - ${backup.items.length} task${backup.items.length === 1 ? '' : 's'}`;

    const meta = document.createElement('p');
    meta.className = 'backup-meta';
    meta.textContent = `Captured ${formatTaskTimestamp(backup.capturedAt)}`;

    const buttonRow = document.createElement('div');
    buttonRow.className = 'button-row';

    const restoreButton = document.createElement('button');
    restoreButton.type = 'button';
    restoreButton.className = 'button button-secondary';
    restoreButton.textContent = 'Restore snapshot';
    restoreButton.addEventListener('click', () => options.onRestore(index));

    buttonRow.append(restoreButton);
    item.append(itemHeading, meta, buttonRow);
    list.append(item);
  });

  wrapper.append(heading, list);
  return wrapper;
}
