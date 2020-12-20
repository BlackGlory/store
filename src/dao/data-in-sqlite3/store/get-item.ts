import { getDatabase } from '../database'

export function getItem(storeId: string, itemId: string): IItem | null {
  const row = getDatabase().prepare(`
    SELECT rev
         , type
         , payload
      FROM store_item
     WHERE store_id = $storeId
       AND item_id = $itemId
  `).get({ storeId, itemId })
  if (!row) return null

  return {
    rev: row['rev']
  , type: row['type']
  , payload: row['payload']
  }
}
