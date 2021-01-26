import { getDatabase } from '../database'
import { uuid } from './utils/uuid'

export function setItem(storeId: string, itemId: string, type: string, payload: string): IRevision {
  const revision = uuid()

  getDatabase().prepare(`
    INSERT INTO store_item (store_id, item_id, type, payload, revision)
    VALUES ($storeId, $itemId, $type, $payload, $revision)
        ON CONFLICT(store_id, item_id)
        DO UPDATE SET type = $type
                    , payload = $payload
                    , revision = $revision;
  `).run({
    storeId
  , itemId
  , type
  , payload
  , revision
  })

  return revision
}
