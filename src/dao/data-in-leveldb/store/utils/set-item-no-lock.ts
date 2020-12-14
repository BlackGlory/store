import { getSubDatabase } from '../../database'
import { nanoid } from 'nanoid'

export async function setItemNoLock(namespace: string, id: string, type: string, doc: IDocument): Promise<IRevision> {
  const db = getSubDatabase(namespace)

  const rev = nanoid()
  const item: IItem = {
    meta: { type, rev }
  , doc
  }
  await db.put(id, item)
  return rev
}
