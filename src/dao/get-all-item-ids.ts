import { getDatabase } from '../database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const getAllItemIds = withLazyStatic((namespace: string): string[] => {
  const rows = lazyStatic(() => getDatabase().prepare(`
    SELECT id
      FROM store_item
     WHERE namespace = $namespace;
  `), [getDatabase()])
    .all({ namespace }) as Array<{ id: string }>

  return rows.map(row => row.id)
})
