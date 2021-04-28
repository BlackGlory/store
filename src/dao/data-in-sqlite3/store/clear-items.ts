import { getDatabase } from '../database'

export function clearItems(namespace: string) {
  getDatabase().prepare(`
    DELETE FROM store_item
     WHERE namespace = $namespace;
  `).run({ namespace })
}
