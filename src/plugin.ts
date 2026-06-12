import type { App, Plugin } from 'vue'
import { createTakt, type Config } from '@vskstudio/takt-core'
import { vTaktEvent } from './directives/vTaktEvent'
import { taktStore } from './store'

export interface TaktPluginOptions extends Config {
  outbound?: boolean
  files?: boolean | string[]
  spa?: boolean
}

/**
 * Vue plugin: `app.use(TaktPlugin, options?)`. Always registers the global
 * `v-takt-event` directive. When `options` are supplied, also bootstraps a
 * single browser instance (pageview + autocapture), so a `<Takt>` component is
 * optional. Init is deferred off the server — `install` may run during SSR.
 */
export const TaktPlugin: Plugin<[TaktPluginOptions?]> = {
  install(app: App, options?: TaktPluginOptions) {
    app.directive('takt-event', vTaktEvent)
    if (!options || typeof window === 'undefined') return

    const { outbound = false, files = false, spa = true, ...config } = options
    const takt = createTakt(config)
    // The bootstrapped instance lives for the app's lifetime; its autocapture
    // disposers are intentionally not retained (use <Takt> for scoped teardown).
    if (spa) takt.enableSpa()
    if (outbound) takt.enableOutbound()
    if (files) takt.enableFiles(Array.isArray(files) ? files : undefined)
    takt.pageview()
    taktStore.value = takt
  },
}
