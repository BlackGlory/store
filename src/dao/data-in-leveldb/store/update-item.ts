import { validateRevision } from './utils/validate-hash'
import { NotFound, IncorrectRevision } from './error'
import { setItemNoLock } from './utils/set-item-no-lock'
import { hasItem } from './has-item'
import { getItem } from './get-item'
import { acquire } from './utils/mutex-pool'

export async function updateItem(namespace: string, id: string, type: string, doc: string): Promise<IRevision> {
  return await acquire(namespace, id, async () => {
    const exist = await hasItem(namespace, id)
    if (!exist) throw new NotFound(namespace, id)
    return setItemNoLock(namespace, id, type, doc)
  })
}

export async function updateItemWithCheck(namespace: string, id: string, type: string, rev: IRevision, doc: string): Promise<IRevision> {
  return await acquire(namespace, id, async () => {
    const item = await getItem(namespace, id)
    if (!item) throw new NotFound(namespace, id)
    if (validateRevision(item, rev)) {
      return await setItemNoLock(namespace, id, type, doc)
    } else {
      throw new IncorrectRevision(namespace, id)
    }
  })
}
