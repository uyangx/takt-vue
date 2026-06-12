// Functional surface: re-export the core's public functions so users have a
// single import, plus the declarative click-tracking directive.
export { init, track, pageview, optOut, optIn } from '@vskstudio/takt-core'
export { vTaktEvent } from './vTaktEvent'
export type { TaktEventParams } from './vTaktEvent'
