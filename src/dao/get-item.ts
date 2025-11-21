import { getDatabase } from '@src/database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'
import { IItem } from '@src/contract.js'
import { JSONValue } from '@blackglory/prelude'

export const getItem = withLazyStatic((
  namespace: string
, id: string
): IItem | null => {
  const row = lazyStatic(() => getDatabase().prepare(`
    SELECT value
         , revision
      FROM store_item
     WHERE namespace = $namespace
       AND id = $id
  `), [getDatabase()])
    .get({ namespace, id }) as {
      value: string
    , revision: string
    }
  if (!row) return null

  return {
    value: JSON.parse(row.value) as JSONValue
  , revision: row.revision
  }
})
