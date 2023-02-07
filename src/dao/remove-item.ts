import { getDatabase } from '../database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const removeItem = withLazyStatic((namespace: string, id: string): boolean => {
  const { changes } = lazyStatic(() => getDatabase().prepare(`
    DELETE FROM store_item
    WHERE namespace = $namespace
      AND id = $id;
  `), [getDatabase()])
    .run({ namespace, id })

  return changes > 0
})

export const removeItemWithRevision = withLazyStatic((
  namespace: string
, id: string
, revision: string
): boolean => {
  const { changes } = lazyStatic(() => getDatabase().prepare(`
    DELETE FROM store_item
    WHERE namespace = $namespace
      AND id = $id
      AND revision = $revision;
  `), [getDatabase()])
    .run({ namespace, id, revision })

  return changes > 0
})
