import { getItem } from './get-item'
import { validateRevision } from './utils/validate-hash'
import { NotFound, IncorrectRevision } from './error'
import { getDatabase } from '../database'
import { hasItem } from './has-item'

/**
 * @throws {NotFound}
 */
export function deleteItem(storeId: string, itemId: string): void {
  getDatabase().transaction(() => {
    if (!hasItem(storeId, itemId)) throw new NotFound(storeId, itemId)

    del(storeId, itemId)
  })()
}

/**
 * @throws {NotFound}
 * @throws {IncorrectRevision}
 */
export function deleteItemWithCheck(storeId: string, itemId: string, rev: IRevision): void {
  getDatabase().transaction(() => {
    const item = getItem(storeId, itemId)
    if (!item) throw new NotFound(storeId, itemId)

    if (validateRevision(item, rev)) {
      del(storeId, itemId)
    } else {
      throw new IncorrectRevision(storeId, itemId)
    }
  })()
}

function del(storeId: string, itemId: string): void {
  getDatabase().prepare(`
    DELETE FROM store_item
     WHERE store_id = $storeId
       AND item_id = $itemId;
  `).run({ storeId, itemId })
}
