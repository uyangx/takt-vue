# @vskstudio/takt-vue

## 0.2.0

### Minor Changes

- Align with `@vskstudio/takt-core` 0.2 (peer dependency bumped to `>=0.2.0`):
  custom event `props` and `revenue` now flow through `useTakt()`, the
  `v-takt-event` directive and `TaktPlugin`.
  - `v-takt-event` routed through the active instance for correct disposal.
  - Trimmed public surface, hardened CI matrix and packaging metadata.

## 0.1.0

### Minor Changes

- Initial release: idiomatic Vue 3 wrapper for Takt analytics.

  - `<Takt>` component (provides the instance, SSR-safe boot in `onMounted`)
  - `useTakt()` composable with a never-throwing no-op fallback
  - `v-takt-event` directive for declarative click tracking
  - `TaktPlugin` for `app.use()` global install
  - `<takt-analytics>` self-contained custom element via `./element`
