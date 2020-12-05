import { hasItem } from './has-item'
import { getItem } from './get-item'
import { validateRevision } from './utils/validate-hash'
import { deleteById } from './utils/delete-by-id'
import { NotFound, IncorrectRevision } from './error'
import { acquire } from './utils/mutex-pool'

export async function deleteItem(namespace: string, id: string): Promise<void> {
  return await acquire(namespace, id, async () => {
    const exist = await hasItem(namespace, id)
    if (!exist) throw new NotFound(namespace, id)
    await deleteById(namespace, id)
  })
}

export async function deleteItemWithCheck(namespace: string, id: string, rev: Revision): Promise<void> {
  return await acquire(namespace, id, async () => {
    const item = await getItem(namespace, id)
    if (!item) throw new NotFound(namespace, id)
    if (validateRevision(item, rev)) {
      await deleteById(namespace, id)
    } else {
      throw new IncorrectRevision(namespace, id)
    }
  })
}
