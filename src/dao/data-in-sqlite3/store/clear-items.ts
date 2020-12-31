import { getDatabase } from '../database'

export function clearItems(storeId: string) {
  getDatabase().prepare(`
    DELETE FROM store_item
     WHERE store_id = $storeId;
  `).run({ storeId })
}
