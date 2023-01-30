import { getItem } from './get-item.js'
import { validateRevision } from './utils/validate-revision.js'
import { NotFound, IncorrectRevision } from './error.js'
import { getDatabase } from '../database.js'
import { hasItem } from './has-item.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

/**
 * @throws {NotFound}
 */
export const deleteItem = withLazyStatic(function (
  namespace: string
, id: string
): void {
  lazyStatic(() => getDatabase().transaction((
    namespace: string
  , id: string
  ) => {
    if (!hasItem(namespace, id)) throw new NotFound(namespace, id)

    del(namespace, id)
  }), [getDatabase()])(namespace, id)
})

/**
 * @throws {NotFound}
 * @throws {IncorrectRevision}
 */
export const deleteItemWithCheck = withLazyStatic(function (
  namespace: string
, id: string
, revision: IRevision
): void {
  lazyStatic(() => getDatabase().transaction((
    namespace: string
  , id: string
  , revision: string
  ) => {
    const item = getItem(namespace, id)
    if (!item) throw new NotFound(namespace, id)
    if (!validateRevision(item, revision)) throw new IncorrectRevision(namespace, id)

    del(namespace, id)
  }), [getDatabase()])(namespace, id, revision)
})

const del = withLazyStatic(function (namespace: string, id: string): void {
  lazyStatic(() => getDatabase().prepare(`
    DELETE FROM store_item
     WHERE namespace = $namespace
       AND id = $id;
  `), [getDatabase()]).run({ namespace, id })
})
