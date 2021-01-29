import { getDatabase } from '../database'
import { map } from 'iterable-operator'

export function getAllItemIds(storeId: string): Iterable<string> {
  const iter = getDatabase().prepare(`
    SELECT item_id
      FROM store_item
     WHERE store_id = $storeId;
  `).iterate({ storeId })

  return map(iter, row => row['item_id'])
}
