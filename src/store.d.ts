interface IStoreDAO {
  hasItem(namespace: string, id: string): Promise<boolean>
  getItem(namespace: string, id: string): Promise<IItem | null>

  setItem(namespace: string, id: string, type: string, payload: string): Promise<IRevision>

  updateItem(namespace: string, id: string, type: string, payload: string): Promise<IRevision>
  updateItemWithCheck(
    namespace: string
  , id: string
  , type: string
  , rev: IRevision
  , payload: string
  ): Promise<IRevision>

  deleteItem(namespace: string, id: string): Promise<void>
  deleteItemWithCheck(namespace: string, id: string, rev: IRevision): Promise<void>

  listAllItemIds(namespace: string): NodeJS.ReadableStream

  Error: {
    NotFound: new (namespace: string, id: string) => Error
    IncorrectRevision: new (namespace: string, id: string) => Error
  }
}
