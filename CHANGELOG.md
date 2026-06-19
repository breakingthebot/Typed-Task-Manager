<!--
CHANGELOG.md
Records user-visible changes by completed build iteration.
Connects to: README.md, Git history
Created: 2026-06-18
-->

# Changelog

All notable changes to this project are documented here.

## [Unreleased]

## [0.7.0] - 2026-06-19

### Added

- Status-grouped task board columns for `To do`, `In progress`, and `Done`.
- Visible board counters for overall tasks and per-status totals.
- Sort controls for newest, oldest, priority, and title ordering.
- JSON import/export tooling for moving task collections between browsers.
- Delete undo toast and keyboard shortcuts for save, search, and undo actions.
- Browser tests covering grouped board layout, counters, and sorting behavior.
- Browser tests covering task import and export round-trips.
- Browser tests covering shortcut handling and delete undo behavior.

### Changed

- Task listing now supports explicit board sort options.
- README now documents grouped board behavior and sort controls.

## [0.2.0] - 2026-06-18

### Added

- Browser application entrypoint with a responsive two-panel layout.
- Modular UI for task creation, filtering, editing, deletion, and quick status changes.
- Loading, empty, validation, and storage error states with user-facing messaging.
- Local time formatting helper for task timestamps.
- Browser interaction tests covering create, edit, filter, and delete flows.

### Changed

- Build pipeline now emits a real Vite browser bundle.
- README now documents the browser app workflow and updated architecture.

## [0.1.0] - 2026-06-18

### Added

- Strict TypeScript project configuration with linting, formatting, builds, and CI.
- Typed task, draft, update, filter, validation, and storage contracts.
- Storage-independent CRUD service with explicit validation and persistence errors.
- Reusable generic filtering, sorting, replacement, and removal utilities.
- Structured level-aware logging without task content.
- Unit tests for CRUD, filtering, validation, malformed storage, and collection helpers.
- Setup, architecture, environment, testing, and operating documentation.
- MIT license.
