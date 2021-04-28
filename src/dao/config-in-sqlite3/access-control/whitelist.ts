import { getDatabase } from '../database'

export function getAllWhitelistItems(): string[] {
  const result = getDatabase().prepare(`
    SELECT namespace
      FROM store_whitelist;
  `).all()

  return result.map(x => x['namespace'])
}

export function inWhitelist(namespace: string): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT 1
               FROM store_whitelist
              WHERE namespace = $namespace
           ) AS exist_in_whitelist;
  `).get({ namespace })

  return result['exist_in_whitelist'] === 1
}

export function addWhitelistItem(namespace: string) {
  getDatabase().prepare(`
    INSERT INTO store_whitelist (namespace)
    VALUES ($namespace)
        ON CONFLICT
        DO NOTHING;
  `).run({ namespace })
}

export function removeWhitelistItem(namespace: string) {
  getDatabase().prepare(`
    DELETE FROM store_whitelist
     WHERE namespace = $namespace;
  `).run({ namespace })
}
