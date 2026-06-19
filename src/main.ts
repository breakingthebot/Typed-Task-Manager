/**
 * src/main.ts
 * Boots the browser application and wires the UI to local task storage.
 * Connects to: components/task-app.ts, services/storage-adapter.ts, services/task-service.ts
 * Created: 2026-06-18
 */

import './styles/app.css';
import { createTaskApp } from './components/task-app';
import { BrowserStorageAdapter } from './services/storage-adapter';
import { TaskService } from './services/task-service';

const root = document.querySelector<HTMLDivElement>('#app');

if (!root) {
  throw new Error('Application root "#app" was not found.');
}

const taskService = new TaskService(new BrowserStorageAdapter());
createTaskApp(root, taskService).mount();
