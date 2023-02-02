import { getDatabase } from '../database.js'
import { map } from 'iterable-operator'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const getAllItemIds = withLazyStatic(function (
  namespace: string
): Iterable<string> {
  const iter = lazyStatic(() => getDatabase().prepare(`
    SELECT id
      FROM store_item
     WHERE namespace = $namespace;
  `), [getDatabase()]).iterate({ namespace }) as IterableIterator<{ id: string }>

  return map(iter, row => row['id'])
})
