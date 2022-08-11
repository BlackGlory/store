import { getDatabase } from '../database'
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
  `), [getDatabase()]).get({ namespace, id })

  return row['matched'] === 1
})
