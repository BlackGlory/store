import { StoreDAO, RevisionPolicyDAO } from '@dao'
import { UPDATE_REVISION_REQUIRED, DELETE_REVISION_REQUIRED } from '@env'

export function has(namespace: string, id: string): Promise<boolean> {
  return StoreDAO.hasItem(namespace, id)
}

export async function get(namespace: string, id: string): Promise<IItem | null> {
  return StoreDAO.getItem(namespace, id)
}

export async function stats(namespace: string): Promise<IStats> {
  return StoreDAO.stats(namespace)
}

export async function clear(namespace: string): Promise<void> {
  return StoreDAO.clearItems(namespace)
}

/**
 * @throws {IncorrectRevision}
 */
export async function set(namespace: string, id: string, type: string, payload: string, revision?: IRevision): Promise<IRevision> {
  try {
    if (revision) {
      return await StoreDAO.updateItemWithCheck(namespace, id, type, revision, payload)
    } else {
      const policies = await RevisionPolicyDAO.getRevisionPolicies(namespace)
      const updateRevisionRequired = policies.updateRevisionRequired
                                  ?? UPDATE_REVISION_REQUIRED()
      if (updateRevisionRequired) throw new IncorrectRevision(namespace, id)
      return await StoreDAO.updateItem(namespace, id, type, payload)
    }
  } catch (e) {
    if (e instanceof StoreDAO.NotFound) {
      return await StoreDAO.setItem(namespace, id, type, payload)
    }
    if (e instanceof StoreDAO.IncorrectRevision) throw new IncorrectRevision(namespace, id)
    throw e
  }
}

/**
 * @throws {NotFound}
 * @throws {IncorrectRevision}
 */
export async function del(namespace: string, id: string, revision?: IRevision): Promise<void> {
  try {
    if (revision) {
      return await StoreDAO.deleteItemWithCheck(namespace, id, revision)
    } else {
      const policies = await RevisionPolicyDAO.getRevisionPolicies(namespace)
      const deleteRevisionRequired = policies.deleteRevisionRequired
                                  ?? DELETE_REVISION_REQUIRED()
      if (deleteRevisionRequired) throw new IncorrectRevision(namespace, id)
      return await StoreDAO.deleteItem(namespace, id)
    }
  } catch (e) {
    if (e instanceof StoreDAO.IncorrectRevision) throw new IncorrectRevision(namespace, id)
    if (e instanceof StoreDAO.NotFound) throw new NotFound(namespace, id)
    throw e
  }
}

export function getAllItemIds(namespace: string): AsyncIterable<string> {
  return StoreDAO.getAllItemIds(namespace)
}

export function getAllNamespaces(): AsyncIterable<string> {
  return StoreDAO.getAllNamespaces()
}

export class IncorrectRevision extends StoreDAO.IncorrectRevision {}
export class NotFound extends StoreDAO.NotFound {}
