import { getDatabase } from '../database'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const stats = withLazyStatic(function (namespace: string): IStats {
  const row = lazyStatic(() => getDatabase().prepare(`
    SELECT COUNT(*) AS items
      FROM store_item
     WHERE namespace = $namespace;
  `), [getDatabase()]).get({ namespace })

  return {
    namespace: namespace
  , items: row['items']
  }
})
