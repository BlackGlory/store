import { getAllItemIds as _getAllItemIds } from '@dao/get-all-item-ids.js'

export function getAllItemIds(namespace: string): string[] {
  return _getAllItemIds(namespace)
}
