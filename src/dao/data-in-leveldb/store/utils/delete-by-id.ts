import { getSubDatabase } from '../../database'

export async function deleteById(namespace: string, id: string): Promise<void> {
  const db = getSubDatabase(namespace)
  await db.del(id)
}
