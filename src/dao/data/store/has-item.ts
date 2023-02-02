import { getDatabase } from '../database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const hasItem = withLazyStatic(function (
  namespace: string
, id: string
): boolean {
  const row = lazyStatic(() => getDatabase().prepare(`
    SELECT EXISTS(
             SELECT 1
               FROM store_item
              WHERE namespace = $namespace
                AND id = $id
           ) AS matched;
  `), [getDatabase()]).get({ namespace, id }) as { matched: 1 | 0 }

  return row['matched'] === 1
})
