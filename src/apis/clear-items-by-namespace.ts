import { clearItemsByNamespace as _clearItemsByNamespace } from '@dao/clear-items-by-namespace.js'

export function clearItemsByNamespace(namespace: string): null {
  _clearItemsByNamespace(namespace)
  return null
}
