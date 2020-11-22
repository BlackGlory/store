import { getSubDatabase } from './utils/get-sub-database'

export async function getItem(namespace: string, id: string): Promise<IItem | null> {
  const db = getSubDatabase(namespace)

  try {
    const item = await db.get(id)
    return item
  } catch (e) {
    if (e.type === 'NotFoundError') return null
    throw e
  }
}
