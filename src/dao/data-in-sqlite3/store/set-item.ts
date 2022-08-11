import { getDatabase } from '../database'
import { uuid } from './utils/uuid'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const setItem = withLazyStatic(function (
  namespace: string
, id: string
, type: string
, payload: string
): IRevision {
  const revision = uuid()

  lazyStatic(() => getDatabase().prepare(`
    INSERT INTO store_item (namespace, id, type, payload, revision)
    VALUES ($namespace, $id, $type, $payload, $revision)
        ON CONFLICT(namespace, id)
        DO UPDATE SET type = $type
                    , payload = $payload
                    , revision = $revision;
  `), [getDatabase()]).run({
    namespace
  , id
  , type
  , payload
  , revision
  })

  return revision
})
