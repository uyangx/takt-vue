# @vskstudio/takt-vue

## 0.1.0

### Minor Changes

- Initial release: idiomatic Vue 3 wrapper for Takt analytics.

  - `<Takt>` component (provides the instance, SSR-safe boot in `onMounted`)
  - `useTakt()` composable with a never-throwing no-op fallback
  - `v-takt-event` directive for declarative click tracking
  - `TaktPlugin` for `app.use()` global install
  - `<takt-analytics>` self-contained custom element via `./element`
