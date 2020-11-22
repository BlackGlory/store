import { hasItem } from './has-item'
import { getItem } from './get-item'
import { validateHash } from './utils/validate-hash'
import { removeById } from './utils/remove-by-id'
import { NotFound, IncorrectHash } from './error'
import { acquire } from './utils/mutex-pool'

export async function removeItem(namespace: string, id: string): Promise<void> {
  return await acquire(namespace, id, async () => {
    const item = await hasItem(namespace, id)
    if (!item) throw new NotFound(namespace, id)
    await removeById(namespace, id)
  })
}

export async function removeItemWithCheck(namespace: string, id: string, hash: Hash): Promise<void> {
  return await acquire(namespace, id, async () => {
    const item = await getItem(namespace, id)
    if (!item) throw new NotFound(namespace, id)
    if (validateHash(item, hash)) {
      await removeById(namespace, id)
    } else {
      throw new IncorrectHash(namespace, id, hash)
    }
  })
}
