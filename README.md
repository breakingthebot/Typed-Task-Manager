<!--
README.md
Explains project purpose, setup, operation, and architecture.
Connects to: package.json, src/, tests/, CHANGELOG.md
Created: 2026-06-18
-->

# Typed Task Manager

A browser-based task manager built with strict TypeScript, modular UI components, grouped task board sections, import/export tooling, backup history, saved board preferences, task templates, task duplication, bulk task actions, delete undo, and a refined visual system built for easier scanning.

## Stack

- TypeScript 5 with strict compiler checks
- Vite 6 for local development and browser bundling
- Vitest 3 with V8 coverage
- ESLint 9 and Prettier 3
- Browser `localStorage`; no database or external API

## Setup

1. Install Node.js 22 or newer.
2. Clone the repository and enter its directory.
3. Copy `.env.example` to `.env` if you want to change the optional log level.
4. Install dependencies:

   ```bash
   npm install
   ```

## Environment Variables

- `VITE_LOG_LEVEL` - optional; accepts `debug`, `info`, `warning`, or `error`.

No secrets are required. See `.env.example` for the complete template.

## Running Locally

Run the browser app:

```bash
npm run dev
```

Run checks:

```bash
npm run test
npm run test:coverage
npm run lint
npm run build
```

## Deployed

Production: https://typed-task-manager.vercel.app

## Architecture Notes

This build starts with a typed domain core and then layers a framework-free browser UI on top of it. Task contracts live in `src/models`, reusable helpers and validation live in `src/utils`, persistence and CRUD behavior live in `src/services`, and the browser rendering code is split across focused files in `src/components`. The task service still depends on a storage adapter instead of direct browser access, which keeps the domain testable and the UI thin.

Every write validates and normalizes input first. Stored data carries a schema version so malformed or incompatible saved data fails explicitly instead of silently producing incorrect results. The UI adds loading, empty, validation, and storage-error states so the app still explains what is happening when something goes wrong. The board is now grouped into status columns with visible counters and sort controls, which makes it easier to scan current work without changing the underlying CRUD service.

The app includes JSON import/export, keyboard shortcuts, delete undo, backup history, persisted board filters, task templates, task duplication, preference reset, and bulk task actions. Those features are split across focused components and services so the UI stays small and the domain logic stays testable. The latest polish pass tightens the typography, reduces visual bulk, and gives the board clearer hierarchy so the layout reads more like a product surface than a generic form stack.

## Testing

Tests mirror the source structure and now cover domain behavior plus browser interaction flows including create, edit, duplicate, bulk actions, filter, delete, backup restore, and persisted preferences.

```bash
npm run check
```

## Notes

- Tasks are stored only in the current browser.
- Clearing local site data removes stored tasks.
- Tasks are persisted in browser `localStorage`.
- The app is fully client-side and makes no network requests.
- The board can be sorted by recency, priority, or title.
- The app can export and import the full task collection as JSON.
- The app supports delete undo and keyboard shortcuts for search, save, and undo.
- The app records recent backup snapshots and can restore one directly from the UI.
- The app remembers the last-used board filters and sort order across reloads.
- Board preferences are stored separately from task data.
- Starter templates can prefill the form with common task shapes.
- Tasks can be duplicated into a prefilled create draft from the board.
- Board filters can be reset back to the default view.
- Multiple selected tasks can be updated or deleted together.
- The interface uses softer cards, rounded controls, and clearer section hierarchy.
- The latest spacing pass makes the board denser and easier to scan.
- See [CHANGELOG.md](CHANGELOG.md) for release history.

## License

Licensed under the [MIT License](LICENSE).
