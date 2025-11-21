import { getDatabase } from '@src/database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'
import { INamespaceStats } from '@src/contract.js'

export const getNamespaceStats = withLazyStatic((
  namespace: string
): INamespaceStats => {
  const row = lazyStatic(() => getDatabase().prepare(`
    SELECT COUNT(*) AS items
      FROM store_item
     WHERE namespace = $namespace;
  `), [getDatabase()])
    .get({ namespace }) as { items: number }

  return { items: row.items }
})
