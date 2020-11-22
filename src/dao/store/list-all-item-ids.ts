import { getSubDatabase } from './utils/get-sub-database'

export function listAllItemIds(namespace: string): NodeJS.ReadableStream {
  const db = getSubDatabase(namespace)
  return db.createKeyStream()
}
