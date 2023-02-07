import { getItem as _getItem } from '@dao/get-item.js'
import { IItem } from '@src/contract.js'

export function getItem(namespace: string, itemId: string): IItem | null {
  return _getItem(namespace, itemId)
}
