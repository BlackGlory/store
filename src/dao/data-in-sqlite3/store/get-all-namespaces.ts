import { getDatabase } from '../database'
import { map } from 'iterable-operator'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const getAllNamespaces = withLazyStatic(function (): Iterable<string> {
  const iter = lazyStatic(() => getDatabase().prepare(`
    SELECT DISTINCT namespace
      FROM store_item;
  `), [getDatabase()]).iterate()

  return map(iter, row => row['namespace'])
})
