import { defineCustomElement } from 'vue'
import TaktAnalytics from './TaktAnalytics.ce.vue'

const TAG = 'takt-analytics'

// `.ce.vue` compiles in custom-element mode; defineCustomElement returns a real
// HTMLElement subclass (styles inlined into the shadow root).
const TaktAnalyticsElement = defineCustomElement(TaktAnalytics)

let defined = false

/**
 * Registers <takt-analytics>. Idempotent and SSR-safe (no-op when
 * customElements is unavailable or the tag is already defined).
 */
export function defineTaktElement(): void {
  if (defined || typeof customElements === 'undefined') return
  if (!customElements.get(TAG)) customElements.define(TAG, TaktAnalyticsElement)
  defined = true
}

defineTaktElement()
