import { getItem } from './get-item'
import { validateRevision } from './utils/validate-revision'
import { NotFound, IncorrectRevision } from './error'
import { getDatabase } from '../database'
import { hasItem } from './has-item'
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

    if (validateRevision(item, revision)) {
      del(namespace, id)
    } else {
      throw new IncorrectRevision(namespace, id)
    }
  }), [getDatabase()])(namespace, id, revision)
})

const del = withLazyStatic(function (namespace: string, id: string): void {
  lazyStatic(() => getDatabase().prepare(`
    DELETE FROM store_item
     WHERE namespace = $namespace
       AND id = $id;
  `), [getDatabase()]).run({ namespace, id })
})
