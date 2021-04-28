import { getDatabase } from '../database'

export function hasItem(namespace: string, id: string): boolean {
  const row = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT 1
               FROM store_item
              WHERE namespace = $namespace
                AND id = $id
           ) AS matched;
  `).get({ namespace, id })

  return row['matched'] === 1
}
