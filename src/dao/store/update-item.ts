import { validateHash } from './utils/validate-hash'
import { NotFound, IncorrectHash } from './error'
import { setItemNoLock } from './utils/set-item-no-lock'
import { hasItem } from './has-item'
import { getItem } from './get-item'
import { acquire } from './utils/mutex-pool'

export async function updateItem(namespace: string, id: string, doc: IDocument): Promise<Hash> {
  return await acquire(namespace, id, async () => {
    const item = await hasItem(namespace, id)
    if (!item) throw new NotFound(namespace, id)
    return setItemNoLock(namespace, id, doc)
  })
}

export async function updateItemWithCheck(namespace: string, id: string, hash: Hash, doc: IDocument): Promise<Hash> {
  return await acquire(namespace, id, async () => {
    const item = await getItem(namespace, id)
    if (!item) throw new NotFound(namespace, id)
    if (validateHash(item, hash)) {
      return await setItemNoLock(namespace, id, doc)
    } else {
      throw new IncorrectHash(namespace, id, hash)
    }
  })
}
