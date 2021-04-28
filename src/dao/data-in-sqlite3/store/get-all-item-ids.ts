import { getDatabase } from '../database'
import { map } from 'iterable-operator'

export function getAllItemIds(namespace: string): Iterable<string> {
  const iter = getDatabase().prepare(`
    SELECT id
      FROM store_item
     WHERE namespace = $namespace;
  `).iterate({ namespace })

  return map(iter, row => row['id'])
}
