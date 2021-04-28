import { getDatabase } from '../database'

export function stats(namespace: string): IStats {
  const row = getDatabase().prepare(`
    SELECT COUNT(*) AS items
      FROM store_item
     WHERE namespace = $namespace;
  `).get({ namespace })

  return {
    namespace: namespace
  , items: row['items']
  }
}
