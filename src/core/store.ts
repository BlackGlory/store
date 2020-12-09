import { StoreDAO, RevisionPolicyDAO } from '@dao'
import { NotFound, IncorrectRevision } from './error'
import { UPDATE_REVISION_REQUIRED, DELETE_REVISION_REQUIRED } from '@env'

export function has(store: string, id: string): Promise<boolean> {
  return StoreDAO.hasItem(store, id)
}

export async function get(store: string, id: string): Promise<IItem | null> {
  return StoreDAO.getItem(store, id)
}

export async function set(store: string, id: string, type: string, doc: IDocument, rev?: Revision): Promise<Revision> {
  try {
    if (await StoreDAO.hasItem(store, id)) {
      if (rev) {
        return await StoreDAO.updateItemWithCheck(store, id, type, rev, doc)
      } else {
        const policies = await RevisionPolicyDAO.getRevisionPolicies(store)
        const updateRevisionRequired = policies.updateRevisionRequired
                                    ?? UPDATE_REVISION_REQUIRED()
        if (updateRevisionRequired) throw new IncorrectRevision()
        return await StoreDAO.updateItem(store, id, type, doc)
      }
    } else {
      return await StoreDAO.setItem(store, id, type, doc)
    }
  } catch (e) {
    if (e instanceof StoreDAO.Error.IncorrectRevision) throw new IncorrectRevision()
    throw e
  }
}

export async function del(store: string, id: string, rev?: Revision): Promise<void> {
  try {
    if (rev) {
      return await StoreDAO.deleteItemWithCheck(store, id, rev)
    } else {
      const policies = await RevisionPolicyDAO.getRevisionPolicies(store)
      const deleteRevisionRequired = policies.deleteRevisionRequired
                                  ?? DELETE_REVISION_REQUIRED()
      if (deleteRevisionRequired) throw new IncorrectRevision()
      return await StoreDAO.deleteItem(store, id)
    }
  } catch (e) {
    if (e instanceof StoreDAO.Error.IncorrectRevision) throw new IncorrectRevision()
    if (e instanceof StoreDAO.Error.NotFound) throw new NotFound()
    throw e
  }
}

export function list(store: string): NodeJS.ReadableStream {
  return StoreDAO.listAllItemIds(store)
}
