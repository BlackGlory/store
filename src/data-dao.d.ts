type CustomError = import('@blackglory/errors').CustomError

interface IDataDAO {
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
  , rev: IRevision
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
  deleteItemWithCheck(storeId: string, itemId: string, rev: IRevision): Promise<void>

  clearItems(storeId: string): Promise<void>

  listAllItemIds(storeId: string): AsyncIterable<string>
  listAllStoreIds(): AsyncIterable<string>

  NotFound: new (storeId: string, itemId: string) => CustomError
  IncorrectRevision: new (storeId: string, itemId: string) => CustomError
}
