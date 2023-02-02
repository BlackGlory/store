import { StoreDAO, RevisionPolicyDAO } from '@dao/index.js'
import { UPDATE_REVISION_REQUIRED, DELETE_REVISION_REQUIRED } from '@env/index.js'
import { IItem, IRevision, IStats } from './contract.js'

export function has(namespace: string, id: string): boolean {
  return StoreDAO.hasItem(namespace, id)
}

export function get(namespace: string, id: string): IItem | null {
  return StoreDAO.getItem(namespace, id)
}

export function stats(namespace: string): IStats {
  return StoreDAO.stats(namespace)
}

export function clear(namespace: string): void {
  StoreDAO.clearItems(namespace)
}

/**
 * @throws {IncorrectRevision}
 */
export function set(
  namespace: string
, id: string
, type: string
, payload: string
, revision?: IRevision
): IRevision {
  try {
    if (revision) {
      return StoreDAO.updateItemWithCheck(namespace, id, type, revision, payload)
    } else {
      const policies = RevisionPolicyDAO.getRevisionPolicies(namespace)
      const updateRevisionRequired = policies.updateRevisionRequired
                                  ?? UPDATE_REVISION_REQUIRED()
      if (updateRevisionRequired) throw new IncorrectRevision(namespace, id)
      return StoreDAO.updateItem(namespace, id, type, payload)
    }
  } catch (e) {
    if (e instanceof StoreDAO.NotFound) {
      return StoreDAO.setItem(namespace, id, type, payload)
    }
    if (e instanceof StoreDAO.IncorrectRevision) throw new IncorrectRevision(namespace, id)
    throw e
  }
}

/**
 * @throws {NotFound}
 * @throws {IncorrectRevision}
 */
export function del(namespace: string, id: string, revision?: IRevision): void {
  try {
    if (revision) {
      return StoreDAO.deleteItemWithCheck(namespace, id, revision)
    } else {
      const policies = RevisionPolicyDAO.getRevisionPolicies(namespace)
      const deleteRevisionRequired = policies.deleteRevisionRequired
                                  ?? DELETE_REVISION_REQUIRED()
      if (deleteRevisionRequired) throw new IncorrectRevision(namespace, id)
      return StoreDAO.deleteItem(namespace, id)
    }
  } catch (e) {
    if (e instanceof StoreDAO.IncorrectRevision) throw new IncorrectRevision(namespace, id)
    if (e instanceof StoreDAO.NotFound) throw new NotFound(namespace, id)
    throw e
  }
}

export function getAllItemIds(namespace: string): Iterable<string> {
  return StoreDAO.getAllItemIds(namespace)
}

export function getAllNamespaces(): Iterable<string> {
  return StoreDAO.getAllNamespaces()
}

export class IncorrectRevision extends StoreDAO.IncorrectRevision {}
export class NotFound extends StoreDAO.NotFound {}
