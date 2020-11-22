type Revision = string

interface IMetadata {
  rev: Revision
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

  setItem(namespace: string, id: string, doc: IDocument): Promise<Revision>

  updateItem(namespace: string, id: string, doc: IDocument): Promise<Revision>
  updateItemWithCheck(
    namespace: string
  , id: string
  , rev: Revision
  , doc: IDocument
  ): Promise<Revision>

  removeItem(namespace: string, id: string): Promise<void>
  removeItemWithCheck(namespace: string, id: string, rev: Revision): Promise<void>

  listAllItemIds(namespace: string): NodeJS.ReadableStream

  Error: {
    NotFound: new (namespace: string, id: string) => Error
    IncorrectRevision: new (namespace: string, id: string) => Error
  }
}
