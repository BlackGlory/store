import { hasItem } from './has-item'
import { getItem } from './get-item'
import { validateRevision } from './utils/validate-hash'
import { removeById } from './utils/remove-by-id'
import { NotFound, IncorrectRevision } from './error'
import { acquire } from './utils/mutex-pool'

export async function removeItem(namespace: string, id: string): Promise<void> {
  return await acquire(namespace, id, async () => {
    const item = await hasItem(namespace, id)
    if (!item) throw new NotFound(namespace, id)
    await removeById(namespace, id)
  })
}

export async function removeItemWithCheck(namespace: string, id: string, rev: Revision): Promise<void> {
  return await acquire(namespace, id, async () => {
    const item = await getItem(namespace, id)
    if (!item) throw new NotFound(namespace, id)
    if (validateRevision(item, rev)) {
      await removeById(namespace, id)
    } else {
      throw new IncorrectRevision(namespace, id)
    }
  })
}
