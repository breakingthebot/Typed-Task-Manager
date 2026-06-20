<!--
CHANGELOG.md
Records user-visible changes by completed build iteration.
Connects to: README.md, Git history
Created: 2026-06-18
-->

# Changelog

All notable changes to this project are documented here.

## [Unreleased]

## [1.8.0] - 2026-06-19

### Changed

- Reverted the app to a neutral light visual system so the interface is readable on refresh.
- Kept the denser spacing and clearer hierarchy from the last polish passes.
- README now describes the lighter, more legible theme.

## [1.7.0] - 2026-06-19

### Added

- Typed task collection envelope and parser utility for import/export.
- Browser coverage for valid, invalid, and version-mismatched task JSON imports.

### Changed

- Task import/export now returns explicit schema errors instead of relying on raw JSON parsing.
- README now documents the typed import/export boundary.

## [1.6.0] - 2026-06-19

### Changed

- Switched the app into a darker, higher-contrast visual theme.
- Updated panels, cards, inputs, and board columns to fit the new product-style surface.
- README now describes the active dark visual direction.

## [1.5.0] - 2026-06-19

### Changed

- Tightened the typography and spacing so the interface reads more like a focused product surface.
- Reduced the blocky feel across panels, cards, and board columns.
- README now describes the denser layout and visual refinement.

## [1.4.0] - 2026-06-19

### Changed

- Refined the interface with softer surfaces, rounded controls, and clearer spacing.
- Improved the board and task cards so the layout feels less blocky and easier to scan.
- README now describes the updated visual treatment.

## [1.3.0] - 2026-06-19

### Added

- Starter task templates for fast form prefill on common work types.
- Browser coverage for the template picker and the prefilling flow.

### Changed

- README now documents task templates alongside the existing UI features.

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
