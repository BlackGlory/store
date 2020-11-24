import { getSubDatabase } from '../database'

export function listAllItemIds(namespace: string): NodeJS.ReadableStream {
  const db = getSubDatabase(namespace)
  return db.createKeyStream()
}
