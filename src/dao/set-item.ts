import { isNull, JSONValue } from '@blackglory/prelude'
import { getDatabase } from '@src/database.js'
import { uuid } from './utils/uuid.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'
import { IncorrectRevision } from '@src/contract.js'

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

/**
 * @throws {IncorrectRevision}
 */
export function setItemWithRevision(
  namespace: string
, id: string
, value: JSONValue
, revision: string | null
): string {
  return isNull(revision)
       ? insertItemStrict(namespace, id, value)
       : updateItemWithRevision(namespace, id, value, revision)
}

/**
 * @throws {IncorrectRevision}
 */
const insertItemStrict = withLazyStatic((
  namespace: string
, id: string
, value: JSONValue
): string => {
  const revision = uuid()

  const { changes } = lazyStatic(() => getDatabase().prepare(`
    INSERT INTO store_item (namespace, id, value, revision)
    VALUES ($namespace, $id, $value, $revision)
        ON CONFLICT
        DO NOTHING
  `), [getDatabase()])
    .run({
      namespace
    , id
    , value: JSON.stringify(value)
    , revision
    })

  if (changes === 0) throw new IncorrectRevision()

  return revision
})

/**
 * @throws {IncorrectRevision}
 */
const updateItemWithRevision = withLazyStatic((
  namespace: string
, id: string
, value: JSONValue
, revision: string | null
): string => {
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

  if (changes === 0) throw new IncorrectRevision()

  return newRevision
})
