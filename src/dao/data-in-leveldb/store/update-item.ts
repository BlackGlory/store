import { validateRevision } from './utils/validate-hash'
import { NotFound, IncorrectRevision } from './error'
import { setItemNoLock } from './utils/set-item-no-lock'
import { hasItem } from './has-item'
import { getItem } from './get-item'
import { acquire } from './utils/mutex-pool'

export async function updateItem(namespace: string, id: string, doc: IDocument): Promise<Revision> {
  return await acquire(namespace, id, async () => {
    const item = await hasItem(namespace, id)
    if (!item) throw new NotFound(namespace, id)
    return setItemNoLock(namespace, id, doc)
  })
}

export async function updateItemWithCheck(namespace: string, id: string, rev: Revision, doc: IDocument): Promise<Revision> {
  return await acquire(namespace, id, async () => {
    const item = await getItem(namespace, id)
    if (!item) throw new NotFound(namespace, id)
    if (validateRevision(item, rev)) {
      return await setItemNoLock(namespace, id, doc)
    } else {
      throw new IncorrectRevision(namespace, id)
    }
  })
}
