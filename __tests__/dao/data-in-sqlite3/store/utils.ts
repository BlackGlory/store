import { getDatabase } from '@dao/data-in-sqlite3/database'

interface IRawItem {
  store_id: string
  item_id: string
  type: string
  payload: string
  rev: string
}

export function setRawItem(props: IRawItem): void {
  getDatabase().prepare(`
    INSERT INTO store_item (
      store_id
    , item_id
    , type
    , payload
    , rev
    )
    VALUES (
      $store_id
    , $item_id
    , $type
    , $payload
    , $rev
    );
  `).run(props)
}

export function hasRawItem(storeId: string, itemId: string): boolean {
  return !!getRawItem(storeId, itemId)
}

export function getRawItem(storeId: string, itemId: string): IRawItem | null {
  return getDatabase().prepare(`
    SELECT *
      FROM store_item
     WHERE store_id = $storeId
       AND item_id = $itemId;
  `).get({ storeId, itemId })
}
