import { getDatabase } from '../database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const getAllWhitelistItems = withLazyStatic(function (): string[] {
  const result = lazyStatic(() => getDatabase().prepare(`
    SELECT namespace
      FROM store_whitelist;
  `), [getDatabase()]).all()

  return result.map(x => x['namespace'])
})

export const inWhitelist = withLazyStatic(function (namespace: string): boolean {
  const result = lazyStatic(() => getDatabase().prepare(`
    SELECT EXISTS(
             SELECT 1
               FROM store_whitelist
              WHERE namespace = $namespace
           ) AS exist_in_whitelist;
  `), [getDatabase()]).get({ namespace })

  return result['exist_in_whitelist'] === 1
})

export const addWhitelistItem = withLazyStatic(function (namespace: string): void {
  lazyStatic(() => getDatabase().prepare(`
    INSERT INTO store_whitelist (namespace)
    VALUES ($namespace)
        ON CONFLICT
        DO NOTHING;
  `), [getDatabase()]).run({ namespace })
})

export const removeWhitelistItem = withLazyStatic(function (namespace: string): void {
  lazyStatic(() => getDatabase().prepare(`
    DELETE FROM store_whitelist
     WHERE namespace = $namespace;
  `), [getDatabase()]).run({ namespace })
})
