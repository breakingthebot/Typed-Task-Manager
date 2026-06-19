<!--
README.md
Explains project purpose, setup, operation, and architecture.
Connects to: package.json, src/, tests/, CHANGELOG.md
Created: 2026-06-18
-->

# Typed Task Manager

A browser-based task manager built with strict TypeScript and a testable, storage-independent CRUD domain.

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

Iteration 1 provides the typed task domain and testable CRUD service. The browser interface is planned for Iteration 2.

```bash
npm run test
npm run test:coverage
npm run lint
npm run build
```

## Deployed

Not deployed.

## Architecture Notes

This first iteration builds the reliable core before adding screens. Task contracts live in `src/models`, reusable generic helpers and validation live in `src/utils`, and CRUD behavior lives in `src/services`. The task service depends on a storage adapter instead of reaching directly into browser APIs, which keeps persistence replaceable and makes the domain easy to test in isolation.

Every write validates and normalizes input first. Stored data carries a schema version so malformed or incompatible saved data fails explicitly instead of silently producing incorrect results. Structured logs capture operation context and task IDs without logging task content.

## Testing

Tests mirror the source structure and cover generic utilities, validation, CRUD behavior, filtering, and malformed storage handling.

```bash
npm run check
```

## Notes

- Tasks are stored only in the current browser.
- Clearing local site data removes stored tasks.
- The project has no runtime dependencies and makes no network requests in Iteration 1.
- See [CHANGELOG.md](CHANGELOG.md) for iteration history.

## License

Licensed under the [MIT License](LICENSE).
