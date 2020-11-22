import { getSubDatabase } from './get-sub-database'
import { nanoid } from 'nanoid'

export async function setItemNoLock(namespace: string, id: string, doc: IDocument): Promise<Revision> {
  const db = getSubDatabase(namespace)

  const rev = nanoid()
  const item: IItem = {
    meta: { rev }
  , doc: doc
  }
  await db.put(id, item)
  return rev
}
