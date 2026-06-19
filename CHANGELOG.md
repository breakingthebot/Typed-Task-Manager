<!--
CHANGELOG.md
Records user-visible changes by completed build iteration.
Connects to: README.md, Git history
Created: 2026-06-18
-->

# Changelog

All notable changes to this project are documented here.

## [Unreleased]

## [1.2.0] - 2026-06-19

### Added

- Bulk selection controls on task cards with bulk status changes and bulk delete actions.
- Single undo path for restoring a deleted group of tasks.
- Browser and service coverage for the bulk action flow.

### Changed

- README now documents bulk task actions and the grouped undo flow.

## [1.1.0] - 2026-06-19

### Added

- Reset filters button for clearing saved board preferences back to the default view.
- Browser coverage for the filter reset flow.

### Changed

- README now documents the reset action for board preferences.

## [1.0.0] - 2026-06-19

### Added

- Task duplication action on task cards that opens a prefilled create draft.
- Browser coverage for the duplicate flow.

### Changed

- README now documents task duplication alongside backup history and preferences.

## [0.9.0] - 2026-06-19

### Added

- Persisted board filters and sort order using browser storage.
- Service coverage for storing, restoring, and validating UI preferences.
- Browser coverage proving the board restores saved filter state after reload.

### Changed

- README now documents saved board preferences and reload behavior.

## [0.8.0] - 2026-06-19

### Added

- Recent backup snapshots stored after each write, with direct restore actions in the UI.
- Backup history coverage in the browser and service test suites.

### Changed

- README now documents backup history and the recovery flow.

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
