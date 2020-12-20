import { getDatabase } from '../database'
import { uuid } from './utils/uuid'

export function setItem(storeId: string, itemId: string, type: string, payload: string): IRevision {
  const rev = uuid()

  getDatabase().prepare(`
    INSERT INTO store_item (store_id, item_id, type, payload, rev)
    VALUES ($storeId, $itemId, $type, $payload, $rev)
        ON CONFLICT(store_id, item_id)
        DO UPDATE SET type = $type
                    , payload = $payload
                    , rev = $rev;
  `).run({
    storeId
  , itemId
  , type
  , payload
  , rev
  })

  return rev
}
