type CustomError = import('@blackglory/errors').CustomError

interface IStoreDAO {
  hasItem(namespace: string, id: string): Promise<boolean>
  getItem(namespace: string, id: string): Promise<IItem | null>
  setItem(namespace: string, id: string, type: string, payload: string): Promise<IRevision>
  stats(namespace: string): Promise<IStats>

  /**
   * @throws {NotFound}
   */
  updateItem(namespace: string, id: string, type: string, payload: string): Promise<IRevision>

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
  ): Promise<IRevision>

  /**
   * @throws {NotFound}
   */
  deleteItem(namespace: string, id: string): Promise<void>

  /**
   * @throws {NotFound}
   * @throws {IncorrectRevision}
   */
  deleteItemWithCheck(namespace: string, id: string, revision: IRevision): Promise<void>

  clearItems(namespace: string): Promise<void>

  getAllItemIds(namespace: string): AsyncIterable<string>
  getAllNamespaces(): AsyncIterable<string>

  NotFound: new (namespace: string, id: string) => CustomError
  IncorrectRevision: new (namespace: string, id: string) => CustomError
}
