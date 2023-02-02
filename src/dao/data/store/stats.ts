import { getDatabase } from '../database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'
import { IStats } from './contract.js'

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
