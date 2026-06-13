import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

const { embedUrl } = vi.hoisted(() => ({
  embedUrl: vi.fn((domain: string, opts?: Record<string, unknown>) => `https://h/embed/${domain}?t=${opts?.theme ?? ''}`),
}))
vi.mock('@vskstudio/takt-core', () => ({ embedUrl }))

import TaktEmbed from '../src/TaktEmbed.vue'

describe('<TaktEmbed>', () => {
  it('renders an iframe whose src reflects domain and options', () => {
    const wrapper = mount(TaktEmbed, { props: { domain: 'exemple.fr', theme: 'dark', lang: 'en' } })
    expect(embedUrl).toHaveBeenCalledWith('exemple.fr', { host: undefined, theme: 'dark', lang: 'en' })
    const iframe = wrapper.get('iframe')
    expect(iframe.attributes('src')).toBe('https://h/embed/exemple.fr?t=dark')
    expect(iframe.attributes('title')).toBe('takt')
    expect(iframe.attributes('loading')).toBe('lazy')
  })

  it('applies default dimensions', () => {
    const wrapper = mount(TaktEmbed, { props: { domain: 'exemple.fr' } })
    const iframe = wrapper.get('iframe')
    expect(iframe.attributes('width')).toBe('404')
    expect(iframe.attributes('height')).toBe('264')
  })
})
