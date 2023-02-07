import { hasItem as _hasItem } from '@dao/has-item.js'

export function hasItem(namespace: string, itemId: string): boolean {
  return _hasItem(namespace, itemId)
}
