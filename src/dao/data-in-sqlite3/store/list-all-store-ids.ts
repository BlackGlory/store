import { getDatabase } from '../database'
import { map } from 'iterable-operator'

export function listAllStoreIds(): Iterable<string> {
  const iter = getDatabase().prepare(`
    SELECT DISTINCT store_id
      FROM store_item;
  `).iterate()
  return map(iter, row => row['store_id'])
}
