import { validateRevision } from './utils/validate-hash'
import { NotFound, IncorrectRevision } from './error'
import { getItem } from './get-item'
import { getDatabase } from '../database'
import { uuid } from './utils/uuid'
import { hasItem } from './has-item'

/**
 * @throws {NotFound}
 */
export function updateItem(storeId: string, itemId: string, type: string, payload: string): IRevision {
  return getDatabase().transaction(() => {
    if (!hasItem(storeId, itemId)) throw new NotFound(storeId, itemId)

    return update(storeId, itemId, type, payload)
  })()
}

/**
 * @throws {NotFound}
 * @throws {IncorrectRevision}
 */
export function updateItemWithCheck(storeId: string, itemId: string, type: string, revision: IRevision, payload: string): IRevision {
  return getDatabase().transaction(() => {
    const item = getItem(storeId, itemId)
    if (!item) throw new NotFound(storeId, itemId)

    if (validateRevision(item, revision)) {
      return update(storeId, itemId, type, payload)
    } else {
      throw new IncorrectRevision(storeId, itemId)
    }
  })()
}

function update(storeId: string, itemId: string, type: string, payload: string): IRevision {
  const revision = uuid()

  getDatabase().prepare(`
    UPDATE store_item
       SET type = $type
         , payload = $payload
         , revision = $revision
     WHERE store_id = $storeId
       AND item_id = $itemId
  `).run({
    storeId
  , itemId
  , type
  , payload
  , revision
  })

  return revision
}
