import { validateRevision } from './utils/validate-hash'
import { NotFound, IncorrectRevision } from './error'
import { getItem } from './get-item'
import { getDatabase } from '../database'
import { uuid } from './utils/uuid'
import { hasItem } from './has-item'

/**
 * @throws {NotFound}
 */
export function updateItem(namespace: string, id: string, type: string, payload: string): IRevision {
  return getDatabase().transaction(() => {
    if (!hasItem(namespace, id)) throw new NotFound(namespace, id)

    return update(namespace, id, type, payload)
  })()
}

/**
 * @throws {NotFound}
 * @throws {IncorrectRevision}
 */
export function updateItemWithCheck(namespace: string, id: string, type: string, revision: IRevision, payload: string): IRevision {
  return getDatabase().transaction(() => {
    const item = getItem(namespace, id)
    if (!item) throw new NotFound(namespace, id)

    if (validateRevision(item, revision)) {
      return update(namespace, id, type, payload)
    } else {
      throw new IncorrectRevision(namespace, id)
    }
  })()
}

function update(namespace: string, id: string, type: string, payload: string): IRevision {
  const revision = uuid()

  getDatabase().prepare(`
    UPDATE store_item
       SET type = $type
         , payload = $payload
         , revision = $revision
     WHERE namespace = $namespace
       AND id = $id
  `).run({
    namespace
  , id
  , type
  , payload
  , revision
  })

  return revision
}
