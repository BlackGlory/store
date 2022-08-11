import { getDatabase } from '../database'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const clearItems = withLazyStatic(function (namespace: string): void {
  lazyStatic(() => getDatabase().prepare(`
    DELETE FROM store_item
     WHERE namespace = $namespace;
  `), [getDatabase()]).run({ namespace })
})
