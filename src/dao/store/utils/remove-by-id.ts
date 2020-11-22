import { getSubDatabase } from './get-sub-database'

export async function removeById(namespace: string, id: string): Promise<void> {
  const db = getSubDatabase(namespace)
  await db.del(id)
}
