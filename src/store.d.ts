type Hash = string

interface IMetadata {
  hash: Hash
}

interface IDocument {
  [index: string]: Json
}

interface IItem {
  meta: IMetadata
  doc: IDocument
}

interface IStoreDAO {
  hasItem(namespace: string, id: string): Promise<boolean>
  getItem(namespace: string, id: string): Promise<IItem | null>

  setItem(namespace: string, id: string, doc: IDocument): Promise<Hash>

  updateItem(namespace: string, id: string, doc: IDocument): Promise<Hash>
  updateItemWithCheck(
    namespace: string
  , id: string
  , hash: Hash
  , doc: IDocument
  ): Promise<Hash>

  removeItem(namespace: string, id: string): Promise<void>
  removeItemWithCheck(namespace: string, id: string, hash: Hash): Promise<void>

  listAllItemIds(namespace: string): NodeJS.ReadableStream

  Error: {
    NotFound: new (namespace: string, id: string) => Error
    IncorrectHash: new (namespace: string, id: string, hash: string) => Error
  }
}
