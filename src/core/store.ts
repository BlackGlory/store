import { StoreDAO, RevisionPolicyDAO } from '@dao'
import { UPDATE_REVISION_REQUIRED, DELETE_REVISION_REQUIRED } from '@env'

export function has(store: string, id: string): Promise<boolean> {
  return StoreDAO.hasItem(store, id)
}

export async function get(store: string, id: string): Promise<IItem | null> {
  return StoreDAO.getItem(store, id)
}

/**
 * @throws {IncorrectRevision}
 */
export async function set(store: string, id: string, type: string, payload: string, rev?: IRevision): Promise<IRevision> {
  try {
    if (rev) {
      return await StoreDAO.updateItemWithCheck(store, id, type, rev, payload)
    } else {
      const policies = await RevisionPolicyDAO.getRevisionPolicies(store)
      const updateRevisionRequired = policies.updateRevisionRequired
                                  ?? UPDATE_REVISION_REQUIRED()
      if (updateRevisionRequired) throw new IncorrectRevision(store, id)
      return await StoreDAO.updateItem(store, id, type, payload)
    }
  } catch (e) {
    if (e instanceof StoreDAO.NotFound) {
      return await StoreDAO.setItem(store, id, type, payload)
    }
    if (e instanceof StoreDAO.IncorrectRevision) throw new IncorrectRevision(store, id)
    throw e
  }
}

/**
 * @throws {NotFound}
 * @throws {IncorrectRevision}
 */
export async function del(store: string, id: string, rev?: IRevision): Promise<void> {
  try {
    if (rev) {
      return await StoreDAO.deleteItemWithCheck(store, id, rev)
    } else {
      const policies = await RevisionPolicyDAO.getRevisionPolicies(store)
      const deleteRevisionRequired = policies.deleteRevisionRequired
                                  ?? DELETE_REVISION_REQUIRED()
      if (deleteRevisionRequired) throw new IncorrectRevision(store, id)
      return await StoreDAO.deleteItem(store, id)
    }
  } catch (e) {
    if (e instanceof StoreDAO.IncorrectRevision) throw new IncorrectRevision(store, id)
    if (e instanceof StoreDAO.NotFound) throw new NotFound(store, id)
    throw e
  }
}

export function list(store: string): AsyncIterable<string> {
  return StoreDAO.listAllItemIds(store)
}

export class IncorrectRevision extends StoreDAO.IncorrectRevision {}
export class NotFound extends StoreDAO.NotFound {}
