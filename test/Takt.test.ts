import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

// Mock the core so tests assert wiring, never real requests.
const { enableSpa, enableOutbound, enableFiles, pageview, createTakt } = vi.hoisted(() => {
  const enableSpa = vi.fn(() => vi.fn())
  const enableOutbound = vi.fn(() => vi.fn())
  const enableFiles = vi.fn(() => vi.fn())
  const pageview = vi.fn()
  const instance = { enableSpa, enableOutbound, enableFiles, pageview, track: vi.fn(), optOut: vi.fn(), optIn: vi.fn() }
  const createTakt = vi.fn(() => instance)
  return { enableSpa, enableOutbound, enableFiles, pageview, createTakt }
})
vi.mock('@vskstudio/takt-core', () => ({ createTakt }))

import Takt from '../src/Takt.vue'
import { taktStore } from '../src/store'

describe('<Takt>', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    taktStore.value = null
  })

  it('inits with mapped config, enables SPA by default, fires initial pageview', () => {
    mount(Takt, { props: { domain: 'exemple.fr', endpoint: '/api/event' } })
    expect(createTakt).toHaveBeenCalledWith({
      domain: 'exemple.fr',
      endpoint: '/api/event',
      scriptOrigin: undefined,
      respectDnt: true,
      excludeLocalhost: true,
    })
    expect(enableSpa).toHaveBeenCalledTimes(1)
    expect(enableOutbound).not.toHaveBeenCalled()
    expect(enableFiles).not.toHaveBeenCalled()
    expect(pageview).toHaveBeenCalledTimes(1)
    expect(taktStore.value).not.toBeNull()
  })

  it('forwards scriptOrigin to the core', () => {
    mount(Takt, { props: { domain: 'exemple.fr', scriptOrigin: 'https://t.exemple.fr' } })
    expect(createTakt).toHaveBeenCalledWith(
      expect.objectContaining({ scriptOrigin: 'https://t.exemple.fr' }),
    )
  })

  it('enables only the toggled features and passes a file extension list', () => {
    mount(Takt, { props: { spa: false, outbound: true, files: ['pdf', 'zip'] } })
    expect(enableSpa).not.toHaveBeenCalled()
    expect(enableOutbound).toHaveBeenCalledTimes(1)
    expect(enableFiles).toHaveBeenCalledWith(['pdf', 'zip'])
  })

  it('files=true enables file tracking with no extension list (default set)', () => {
    mount(Takt, { props: { domain: 'exemple.fr', files: true } })
    expect(enableFiles).toHaveBeenCalledWith(undefined)
  })

  it('disposes every enabled feature on unmount', () => {
    const spaDispose = vi.fn()
    const outboundDispose = vi.fn()
    enableSpa.mockReturnValueOnce(spaDispose)
    enableOutbound.mockReturnValueOnce(outboundDispose)
    const wrapper = mount(Takt, { props: { outbound: true } })
    wrapper.unmount()
    expect(spaDispose).toHaveBeenCalledTimes(1)
    expect(outboundDispose).toHaveBeenCalledTimes(1)
    expect(taktStore.value).toBeNull()
  })

  it('renders default slot content', () => {
    const wrapper = mount(Takt, { slots: { default: '<p>child</p>' } })
    expect(wrapper.html()).toContain('child')
  })
})
