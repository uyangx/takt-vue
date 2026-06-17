import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock core: createTakt returns spies so tests assert wiring, never real reqs.
const { enableSpa, enableOutbound, enableFiles, pageview, createTakt } = vi.hoisted(() => {
  const enableSpa = vi.fn(() => vi.fn())
  const enableOutbound = vi.fn(() => vi.fn())
  const enableFiles = vi.fn(() => vi.fn())
  const pageview = vi.fn()
  const instance = {
    enableSpa,
    enableOutbound,
    enableFiles,
    pageview,
    track: vi.fn(),
    optOut: vi.fn(),
    optIn: vi.fn(),
  }
  const createTakt = vi.fn(() => instance)
  return { enableSpa, enableOutbound, enableFiles, pageview, createTakt }
})
vi.mock('@vskstudio/takt-core', () => ({ createTakt }))

// Importing the index registers <takt-analytics> as a side effect.
import { defineTaktElement } from '../src/element/index'

/** Create, configure, mount the element, then wait for onMounted to flush. */
async function boot(attrs: Record<string, string> = {}): Promise<HTMLElement> {
  const el = document.createElement('takt-analytics')
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v)
  document.body.appendChild(el)
  await Promise.resolve()
  await new Promise((r) => setTimeout(r, 0))
  return el
}

describe('<takt-analytics> registration', () => {
  it('defineTaktElement registers the custom element and is idempotent', () => {
    expect(() => defineTaktElement()).not.toThrow()
    expect(() => defineTaktElement()).not.toThrow()
    expect(customElements.get('takt-analytics')).toBeTruthy()
  })
})

describe('<takt-analytics> boot behavior', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = ''
  })

  it('with no boolean attributes: privacy defaults stay TRUE, SPA on, pageview fires', async () => {
    await boot({ domain: 'exemple.fr' })
    expect(createTakt).toHaveBeenCalledWith(
      expect.objectContaining({
        domain: 'exemple.fr',
        respectDnt: true,
        excludeLocalhost: true,
      }),
    )
    expect(enableSpa).toHaveBeenCalledTimes(1)
    expect(enableOutbound).not.toHaveBeenCalled()
    expect(enableFiles).not.toHaveBeenCalled()
    expect(pageview).toHaveBeenCalledTimes(1)
  })

  it('with outbound attribute present: enableOutbound is called', async () => {
    await boot({ domain: 'exemple.fr', outbound: '' })
    expect(enableOutbound).toHaveBeenCalledTimes(1)
  })

  it('forwards script-origin to the core (kebab attr maps to camel prop)', async () => {
    await boot({ domain: 'exemple.fr', 'script-origin': 'https://t.example.com' })
    expect(createTakt).toHaveBeenCalledWith(
      expect.objectContaining({ scriptOrigin: 'https://t.example.com' }),
    )
  })

  it('with spa="false": enableSpa is NOT called but pageview still fires', async () => {
    await boot({ domain: 'exemple.fr', spa: 'false' })
    expect(enableSpa).not.toHaveBeenCalled()
    expect(pageview).toHaveBeenCalledTimes(1)
  })

  it('with respectDnt="false" / excludeLocalhost="false": privacy flags are disabled', async () => {
    await boot({ domain: 'exemple.fr', 'respect-dnt': 'false', 'exclude-localhost': 'false' })
    expect(createTakt).toHaveBeenCalledWith(
      expect.objectContaining({ respectDnt: false, excludeLocalhost: false }),
    )
  })

  it('on disconnect: collected disposers run', async () => {
    const spaDispose = vi.fn()
    enableSpa.mockReturnValueOnce(spaDispose)
    const el = await boot({ domain: 'exemple.fr' })
    el.remove()
    await Promise.resolve()
    expect(spaDispose).toHaveBeenCalledTimes(1)
  })
})
