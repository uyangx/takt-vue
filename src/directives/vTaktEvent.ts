import { track as coreTrack } from '@vskstudio/takt-core'
import type { TrackOptions } from '@vskstudio/takt-core'
import type { Directive } from 'vue'
import { resolveTakt } from '../store'

// Derives props/revenue from core's TrackOptions so the wire shape stays in sync.
export interface TaktEventParams extends TrackOptions {
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

// Vue directive: tracks a custom event on click. Reactive — updating the bound
// value changes the tracked name/props/revenue; the listener is removed on unmount.
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
