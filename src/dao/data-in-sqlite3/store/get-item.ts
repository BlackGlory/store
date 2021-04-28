import { getDatabase } from '../database'

export function getItem(namespace: string, id: string): IItem | null {
  const row = getDatabase().prepare(`
    SELECT revision
         , type
         , payload
      FROM store_item
     WHERE namespace = $namespace
       AND id = $id
  `).get({ namespace, id })
  if (!row) return null

  return {
    revision: row['revision']
  , type: row['type']
  , payload: row['payload']
  }
}
