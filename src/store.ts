import { getCurrentInstance, inject, provide, shallowRef, type InjectionKey, type ShallowRef } from 'vue'
import type { createTakt } from '@vskstudio/takt-core'

/** The Analytics instance type, derived from the core factory (core does not export it). */
export type TaktInstance = ReturnType<typeof createTakt>

// shallowRef, not ref: the Analytics instance is opaque — deep reactive
// proxying would both waste work and break identity (`===`) comparisons.
const TAKT_KEY: InjectionKey<ShallowRef<TaktInstance | null>> = Symbol('takt')

/**
 * Module-level fallback ref. Lets `useTakt()` resolve the instance even from
 * modules outside the component tree. Mirrors the value provided on context.
 */
export const taktStore: ShallowRef<TaktInstance | null> = shallowRef(null)

/**
 * Called once during `<Takt>` setup (synchronously): provides an empty ref into
 * the injection context that `<Takt>` populates after mount.
 */
export function provideTakt(): ShallowRef<TaktInstance | null> {
  const store = shallowRef<TaktInstance | null>(null)
  provide(TAKT_KEY, store)
  return store
}

/** Resolve the live instance: injected ref first, then the module fallback. */
export function resolveTakt(): TaktInstance | null {
  // inject() is only valid during setup; guard so utility modules don't warn.
  const injected = getCurrentInstance() ? inject(TAKT_KEY, null) : null
  return (injected ? injected.value : null) ?? taktStore.value
}
