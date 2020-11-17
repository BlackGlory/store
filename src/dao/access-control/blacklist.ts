import { getDatabase } from './database'

export function getAllBlacklistItems(): string[] {
  const result = getDatabase().prepare(`
    SELECT store_id FROM store_blacklist;
  `).all()
  return result.map(x => x['store_id'])
}

export function inBlacklist(id: string): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM store_blacklist
              WHERE store_id = $id
           ) AS exist_in_blacklist;
  `).get({ id })
  return result['exist_in_blacklist'] === 1
}

export function addBlacklistItem(id: string) {
  try {
    getDatabase().prepare(`
      INSERT INTO store_blacklist (store_id)
      VALUES ($id);
    `).run({ id })
  } catch {}
}

export function removeBlacklistItem(id: string) {
  getDatabase().prepare(`
    DELETE FROM store_blacklist
     WHERE store_id = $id;
  `).run({ id })
}
