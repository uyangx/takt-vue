import type { TaktInstance } from './store'

let warned = false

/**
 * A never-throwing stand-in returned by `useTakt()` when no `<Takt>` has
 * mounted (SSR pass, early call, or misuse). Warns once in the browser.
 */
export function noopTakt(): TaktInstance {
  if (!warned && typeof console !== 'undefined') {
    console.warn('[takt] useTakt() called before <Takt> mounted — returning a no-op instance.')
    warned = true
  }
  const noop = (): void => {}
  const disposer = (): (() => void) => noop
  return {
    track: noop,
    pageview: noop,
    optOut: noop,
    optIn: noop,
    enableSpa: disposer,
    enableOutbound: disposer,
    enableFiles: disposer,
  } as unknown as TaktInstance
}
