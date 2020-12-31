import { getDatabase } from '../database'
import { map } from 'iterable-operator'

export function listAllStoreIds(): Iterable<string> {
  const iter = getDatabase().prepare(`
    SELECT store_id
      FROM store_item
     GROUP BY store_id;
  `).iterate()
  return map(iter, row => row['store_id'])
}
