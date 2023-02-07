import { getDatabase } from '../database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const clearItemsByNamespace = withLazyStatic((namespace: string): void => {
  lazyStatic(() => getDatabase().prepare(`
    DELETE FROM store_item
     WHERE namespace = $namespace;
  `), [getDatabase()])
    .run({ namespace })
})
