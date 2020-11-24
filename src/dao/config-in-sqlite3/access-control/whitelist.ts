import { getDatabase } from '../database'

export function getAllWhitelistItems(): string[] {
  const result = getDatabase().prepare(`
    SELECT store_id FROM store_whitelist;
  `).all()
  return result.map(x => x['store_id'])
}

export function inWhitelist(id: string): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM store_whitelist
              WHERE store_id = $id
           ) AS exist_in_whitelist;
  `).get({ id })
  return result['exist_in_whitelist'] === 1
}

export function addWhitelistItem(id: string) {
  try {
    getDatabase().prepare(`
      INSERT INTO store_whitelist (store_id)
      VALUES ($id);
    `).run({ id })
  } catch {}
}

export function removeWhitelistItem(id: string) {
  getDatabase().prepare(`
    DELETE FROM store_whitelist
     WHERE store_id = $id;
  `).run({ id })
}
