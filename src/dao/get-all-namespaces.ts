import { getDatabase } from '@src/database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const getAllNamespaces = withLazyStatic((): string[] => {
  const rows = lazyStatic(() => getDatabase().prepare(`
    SELECT DISTINCT namespace
      FROM store_item;
  `), [getDatabase()])
    .all() as Array<{ namespace: string }>

  return rows.map(row => row.namespace)
})
