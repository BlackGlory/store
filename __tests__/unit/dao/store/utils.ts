import { getDatabase } from '@dao/store/database'
import sub = require('subleveldown')

export async function set(namespace: string, id: string, item: any) {
  const db = sub(getDatabase(), namespace, { valueEncoding: 'json' })
  await db.put(id, item)
}

export async function get(namespace: string, id: string): Promise<IItem> {
  const db = sub(getDatabase(), namespace, { valueEncoding: 'json' })
  return await db.get(id)
}

export async function has(namespace: string, id: string) {
  const db = sub(getDatabase(), namespace, { valueEncodding: 'json' })
  try {
    await db.get(id)
    return true
  } catch (e) {
    if (e.type === 'NotFoundError') return false
    throw e
  }
}
