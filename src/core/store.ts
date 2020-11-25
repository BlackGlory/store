import { StoreDAO, RevisionPolicyDAO } from '@dao'
import { NotFound, IncorrectRevision } from './error'
import { UPDATE_REVISION_REQUIRED, DELETE_REVISION_REQUIRED } from '@env'

export function has(store: string, id: string): Promise<boolean> {
  return StoreDAO.hasItem(store, id)
}

export async function get(store: string, id: string): Promise<IDocument> {
  const item = await StoreDAO.getItem(store, id)
  if (!item) throw new NotFound()
  return item.doc
}

export async function set(store: string, id: string, doc: IDocument, rev?: Revision): Promise<Revision> {
  try {
    if (await StoreDAO.hasItem(store, id)) {
      if (rev) {
        return await StoreDAO.updateItemWithCheck(store, id, rev, doc)
      } else {
        const policies = await RevisionPolicyDAO.getRevisionPolicies(store)
        const updateRevisionRequired = policies.updateRevisionRequired
                                    ?? UPDATE_REVISION_REQUIRED()
        if (updateRevisionRequired) throw new IncorrectRevision()
        return await StoreDAO.updateItem(store, id, doc)
      }
    } else {
      return await StoreDAO.setItem(store, id, doc)
    }
  } catch (e) {
    if (e instanceof StoreDAO.Error.IncorrectRevision) throw new IncorrectRevision()
    if (e instanceof StoreDAO.Error.NotFound) throw new NotFound()
    throw e
  }
}

export async function remove(store: string, id: string, rev?: Revision): Promise<void> {
  try {
    if (rev) {
      return await StoreDAO.removeItemWithCheck(store, id, rev)
    } else {
      const policies = await RevisionPolicyDAO.getRevisionPolicies(store)
      const deleteRevisionRequired = policies.deleteRevisionRequired
                                  ?? DELETE_REVISION_REQUIRED()
      if (deleteRevisionRequired) throw new IncorrectRevision()
      return await StoreDAO.removeItem(store, id)
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