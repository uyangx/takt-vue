import { createTaktAnalyticsElement } from './TaktAnalyticsElement'

const TAG = 'takt-analytics'
let defined = false

/**
 * Registers <takt-analytics>. Idempotent and SSR-safe (no-op when
 * customElements is unavailable or the tag is already defined).
 */
export function defineTaktElement(): void {
  if (defined || typeof customElements === 'undefined') return
  if (!customElements.get(TAG)) customElements.define(TAG, createTaktAnalyticsElement())
  defined = true
}

defineTaktElement()
