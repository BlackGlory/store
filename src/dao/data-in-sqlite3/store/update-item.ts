import { validateRevision } from './utils/validate-revision'
import { NotFound, IncorrectRevision } from './error'
import { getItem } from './get-item'
import { getDatabase } from '../database'
import { uuid } from './utils/uuid'
import { hasItem } from './has-item'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

/**
 * @throws {NotFound}
 */
export const updateItem = withLazyStatic(function (
  namespace: string
, id: string
, type: string
, payload: string
): IRevision {
  return lazyStatic(() => getDatabase().transaction((
    namespace: string
  , id: string
  , type: string
  , payload: string
  ) => {
    if (!hasItem(namespace, id)) throw new NotFound(namespace, id)

    return update(namespace, id, type, payload)
  }), [getDatabase()])(namespace, id, type, payload)
})

/**
 * @throws {NotFound}
 * @throws {IncorrectRevision}
 */
export const updateItemWithCheck = withLazyStatic(function (
  namespace: string
, id: string
, type: string
, revision: IRevision
, payload: string
): IRevision {
  return lazyStatic(() => getDatabase().transaction((
    namespace: string
  , id: string
  , type: string
  , revision: IRevision
  , payload: string
  ) => {
    const item = getItem(namespace, id)
    if (!item) throw new NotFound(namespace, id)

    if (validateRevision(item, revision)) {
      return update(namespace, id, type, payload)
    } else {
      throw new IncorrectRevision(namespace, id)
    }
  }), [getDatabase()])(namespace, id, type, revision, payload)
})

const update = withLazyStatic(function (
  namespace: string
, id: string
, type: string
, payload: string
): IRevision {
  const revision = uuid()

  lazyStatic(() => getDatabase().prepare(`
    UPDATE store_item
       SET type = $type
         , payload = $payload
         , revision = $revision
     WHERE namespace = $namespace
       AND id = $id
  `), [getDatabase()]).run({
    namespace
  , id
  , type
  , payload
  , revision
  })

  return revision
})
