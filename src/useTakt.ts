import { resolveTakt, type TaktInstance } from './store'
import { noopTakt } from './noop'

/**
 * Returns the live Takt instance provided by `<Takt>`, or a safe no-op that
 * never throws. Call it from a component `setup` (resolves via injection) or
 * from anywhere (resolves via the module fallback ref).
 */
export function useTakt(): TaktInstance {
  return resolveTakt() ?? noopTakt()
}
