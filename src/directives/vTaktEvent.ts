import { track as coreTrack } from '@vskstudio/takt-core'
import type { TrackOptions } from '@vskstudio/takt-core'
import type { Directive } from 'vue'
import { resolveTakt } from '../store'

/**
 * Binding value for the `v-takt-event` directive. Extends core's `TrackOptions`
 * (`props`, `revenue`) so the wire shape stays in sync, plus the event `name`.
 */
export interface TaktEventParams extends TrackOptions {
  /** The custom event name to track on click. */
  name: string
}

// Tracks through the active instance, resolved at click time. Prefers the
// instance published by <Takt> / TaktPlugin (via the module store), and falls
// back to core's default instance for users who drive `init()` directly.
function emit(name: string, opts?: TrackOptions): void {
  const instance = resolveTakt()
  if (instance) instance.track(name, opts)
  else coreTrack(name, opts)
}

const PARAMS = Symbol('takt-params')
const HANDLER = Symbol('takt-handler')

type Bound = HTMLElement & {
  [PARAMS]?: TaktEventParams
  [HANDLER]?: () => void
}

/**
 * Directive for declarative click tracking.
 *
 * ```vue
 * <button v-takt-event="{ name: 'Signup', props: { plan: 'pro' } }">Subscribe</button>
 * ```
 *
 * Reactive — updating the bound value changes the tracked name/props/revenue,
 * and the click listener is removed on unmount. At click time it tracks through
 * the active instance published by `<Takt>` / `TaktPlugin`, falling back to
 * core's default instance for an `init()`-driven setup.
 */
export const vTaktEvent: Directive<Bound, TaktEventParams> = {
  mounted(el, binding) {
    el[PARAMS] = binding.value
    const handler = (): void => {
      const current = el[PARAMS]
      if (!current) return
      const opts: TrackOptions = {}
      if (current.props) opts.props = current.props
      if (current.revenue) opts.revenue = current.revenue
      emit(current.name, Object.keys(opts).length ? opts : undefined)
    }
    el[HANDLER] = handler
    el.addEventListener('click', handler)
  },
  updated(el, binding) {
    el[PARAMS] = binding.value
  },
  unmounted(el) {
    if (el[HANDLER]) el.removeEventListener('click', el[HANDLER])
    delete el[HANDLER]
    delete el[PARAMS]
  },
}
