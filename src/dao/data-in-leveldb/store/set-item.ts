import { acquire } from './utils/mutex-pool'
import { setItemNoLock } from './utils/set-item-no-lock'

export async function setItem(namespace: string, id: string, type: string, doc: IDocument): Promise<IRevision> {
  return await acquire(namespace, id, () => setItemNoLock(namespace, id, type, doc))
}
