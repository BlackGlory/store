type CustomError = import('@blackglory/errors').CustomError

interface IStoreDAO {
  hasItem(storeId: string, itemId: string): Promise<boolean>
  getItem(storeId: string, itemId: string): Promise<IItem | null>
  setItem(storeId: string, itemId: string, type: string, payload: string): Promise<IRevision>
  stats(storeId: string): Promise<Stats>

  /**
   * @throws {NotFound}
   */
  updateItem(storeId: string, itemId: string, type: string, payload: string): Promise<IRevision>

  /**
   * @throws {NotFound}
   * @throws {IncorrectRevision}
   */
  updateItemWithCheck(
    storeId: string
  , itemId: string
  , type: string
  , revision: IRevision
  , payload: string
  ): Promise<IRevision>

  /**
   * @throws {NotFound}
   */
  deleteItem(storeId: string, itemId: string): Promise<void>

  /**
   * @throws {NotFound}
   * @throws {IncorrectRevision}
   */
  deleteItemWithCheck(storeId: string, itemId: string, revision: IRevision): Promise<void>

  clearItems(storeId: string): Promise<void>

  getAllItemIds(storeId: string): AsyncIterable<string>
  getAllStoreIds(): AsyncIterable<string>

  NotFound: new (storeId: string, itemId: string) => CustomError
  IncorrectRevision: new (storeId: string, itemId: string) => CustomError
}
