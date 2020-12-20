import { getDatabase } from '@dao/data-in-sqlite3/database'

export function set(storeId: string, itemId: string, item: IItem) {
  getDatabase().prepare(`
    INSERT INTO store_item (store_id, item_id, type, payload, rev)
    VALUES ($storeId, $itemId, $type, $payload, $rev);
  `).run({
    storeId
  , itemId
  , type: item.type
  , payload: item.payload
  , rev: item.rev
  })
}

export function get(storeId: string, itemId: string): IItem {
  const row = getDatabase().prepare(`
    SELECT type
         , payload
         , rev
      FROM store_item
     WHERE store_id = $storeId
       AND item_id = $itemId;
  `).get({ storeId, itemId })
  return {
    type: row['type']
  , payload: row['payload']
  , rev: row['rev']
  }
}

export function has(storeId: string, itemId: string): boolean {
  const row = getDatabase().prepare(`
    SELECT type
         , payload
         , rev
      FROM store_item
     WHERE store_id = $storeId
       AND item_id = $itemId;
  `).get({ storeId, itemId })
  return row
}
