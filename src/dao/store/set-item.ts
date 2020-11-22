import { acquire } from './utils/mutex-pool'
import { setItemNoLock } from './utils/set-item-no-lock'

export async function setItem(namespace: string, id: string, doc: IDocument): Promise<Hash> {
  return await acquire(namespace, id, () => setItemNoLock(namespace, id, doc))
}
