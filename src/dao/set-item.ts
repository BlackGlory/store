import { JSONValue } from '@blackglory/prelude'
import { getDatabase } from '../database.js'
import { uuid } from './utils/uuid.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const setItem = withLazyStatic((
  namespace: string
, id: string
, value: JSONValue
): string => {
  const revision = uuid()

  lazyStatic(() => getDatabase().prepare(`
    INSERT INTO store_item (namespace, id, value, revision)
    VALUES ($namespace, $id, $value, $revision)
        ON CONFLICT(namespace, id)
        DO UPDATE SET value = $value
                    , revision = $revision;
  `), [getDatabase()])
    .run({
      namespace
    , id
    , value: JSON.stringify(value)
    , revision
    })

  return revision
})

export const setItemWithRevision = withLazyStatic((
  namespace: string
, id: string
, value: JSONValue
, revision: string
): string | false => {
  const newRevision = uuid()

  const { changes } = lazyStatic(() => getDatabase().prepare(`
    UPDATE store_item
       SET value = $value
         , revision = $newRevision
     WHERE namespace = $namespace
       AND id = $id
       AND revision = $revision;
  `), [getDatabase()])
    .run({
      namespace
    , id
    , value: JSON.stringify(value)
    , revision
    , newRevision
    })

  if (changes > 0) {
    return newRevision
  } else {
    return false
  }
})
