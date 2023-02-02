import { CustomError } from '@blackglory/errors'
import { IItem, IStats, IRevision } from '@api/contract.js'
export { IItem, IStats, IRevision } from '@api/contract.js'

export interface IStoreDAO {
  hasItem(namespace: string, id: string): boolean
  getItem(namespace: string, id: string): IItem | null
  setItem(namespace: string, id: string, type: string, payload: string): IRevision
  stats(namespace: string): IStats

  /**
   * @throws {NotFound}
   */
  updateItem(namespace: string, id: string, type: string, payload: string): IRevision

  /**
   * @throws {NotFound}
   * @throws {IncorrectRevision}
   */
  updateItemWithCheck(
    namespace: string
  , id: string
  , type: string
  , revision: IRevision
  , payload: string
  ): IRevision

  /**
   * @throws {NotFound}
   */
  deleteItem(namespace: string, id: string): void

  /**
   * @throws {NotFound}
   * @throws {IncorrectRevision}
   */
  deleteItemWithCheck(namespace: string, id: string, revision: IRevision): void

  clearItems(namespace: string): void

  getAllItemIds(namespace: string): Iterable<string>
  getAllNamespaces(): Iterable<string>

  NotFound: new (namespace: string, id: string) => CustomError
  IncorrectRevision: new (namespace: string, id: string) => CustomError
}
