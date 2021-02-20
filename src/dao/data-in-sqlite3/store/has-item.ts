import { getDatabase } from '../database'

export function hasItem(storeId: string, itemId: string): boolean {
  const row = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM store_item
              WHERE store_id = $storeId
                AND item_id = $itemId
           ) AS matched;
  `).get({ storeId, itemId })

  return row['matched'] === 1
}
