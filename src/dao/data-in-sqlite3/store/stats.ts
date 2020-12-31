import { getDatabase } from '../database'

export function stats(storeId: string): Stats {
  const row = getDatabase().prepare(`
    SELECT COUNT(*) AS items
      FROM store_item
     WHERE store_id = $storeId;
  `).get({ storeId })

  return {
    id: storeId
  , items: row['items']
  }
}
