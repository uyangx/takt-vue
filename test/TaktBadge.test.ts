import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

const { badgeUrl } = vi.hoisted(() => ({
  badgeUrl: vi.fn((domain: string, opts?: Record<string, unknown>) => `https://h/public/${domain}/badge.svg?v=${opts?.variant ?? ''}`),
}))
vi.mock('@vskstudio/takt-core', () => ({ badgeUrl }))

import TaktBadge from '../src/TaktBadge.vue'

describe('<TaktBadge>', () => {
  it('renders an img whose src reflects domain and options', () => {
    const wrapper = mount(TaktBadge, { props: { domain: 'exemple.fr', variant: 'd', glyph: 'unplug', lang: 'fr' } })
    expect(badgeUrl).toHaveBeenCalledWith('exemple.fr', { host: undefined, variant: 'd', glyph: 'unplug', lang: 'fr' })
    const img = wrapper.get('img')
    expect(img.attributes('src')).toBe('https://h/public/exemple.fr/badge.svg?v=d')
    expect(img.attributes('alt')).toBe('takt')
    expect(img.attributes('loading')).toBe('lazy')
  })
})
