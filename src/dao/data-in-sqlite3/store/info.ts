import { getDatabase } from '../database'

export function info(): IInfo[] {
  const rows = getDatabase().prepare(`
    SELECT store_id AS id
         , COUNT(*) AS items
      FROM store_item
     GROUP BY store_id;
  `).all()

  return rows.map(row => ({
    id: row['id']
  , items: row['items']
  }))
}
