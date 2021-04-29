import { getItem } from './get-item'
import { validateRevision } from './utils/validate-revision'
import { NotFound, IncorrectRevision } from './error'
import { getDatabase } from '../database'
import { hasItem } from './has-item'

/**
 * @throws {NotFound}
 */
export function deleteItem(namespace: string, id: string): void {
  getDatabase().transaction(() => {
    if (!hasItem(namespace, id)) throw new NotFound(namespace, id)

    del(namespace, id)
  })()
}

/**
 * @throws {NotFound}
 * @throws {IncorrectRevision}
 */
export function deleteItemWithCheck(
  namespace: string
, id: string
, revision: IRevision
): void {
  getDatabase().transaction(() => {
    const item = getItem(namespace, id)
    if (!item) throw new NotFound(namespace, id)

    if (validateRevision(item, revision)) {
      del(namespace, id)
    } else {
      throw new IncorrectRevision(namespace, id)
    }
  })()
}

function del(namespace: string, id: string): void {
  getDatabase().prepare(`
    DELETE FROM store_item
     WHERE namespace = $namespace
       AND id = $id;
  `).run({ namespace, id })
}
