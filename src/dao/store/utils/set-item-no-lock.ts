import { getSubDatabase } from './get-sub-database'
import { computeHash } from './compute-hash'

export async function setItemNoLock(namespace: string, id: string, doc: IDocument): Promise<Hash> {
  const db = getSubDatabase(namespace)

  const hash = computeHash(JSON.stringify(doc))
  const item: IItem = {
    meta: { hash }
  , doc: doc
  }
  await db.put(id, item)
  return hash
}
