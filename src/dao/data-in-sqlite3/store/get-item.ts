import { getDatabase } from '../database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const getItem = withLazyStatic(function (
  namespace: string
, id: string
): IItem | null {
  const row = lazyStatic(() => getDatabase().prepare(`
    SELECT revision
         , type
         , payload
      FROM store_item
     WHERE namespace = $namespace
       AND id = $id
  `), [getDatabase()]).get({ namespace, id })
  if (!row) return null

  return {
    revision: row['revision']
  , type: row['type']
  , payload: row['payload']
  }
})
