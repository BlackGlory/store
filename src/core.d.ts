type IRevision = string

interface IMetadata {
  rev: IRevision
  type: string
}

type IDocument = import('@blackglory/types').Json

interface IItem {
  meta: IMetadata
  doc: IDocument
}

interface ICore {
  isAdmin(password: string): boolean

  stats(): {
    memoryUsage: NodeJS.MemoryUsage
    cpuUsage: NodeJS.CpuUsage
    resourceUsage: NodeJS.ResourceUsage
  }

  Store: {
    has(store: string, id: string): Promise<boolean>
    get(store: string, id: string): Promise<IItem | null>
    set(store: string, id: string, type: string, doc: IDocument, rev?: IRevision): Promise<IRevision>
    del(store: string, id: string, rev?: IRevision): Promise<void>
    list(store: string): NodeJS.ReadableStream
  }

  RevisionPolicy: {
    getAllIds(): Promise<string[]>
    get(id: string): Promise<{
      updateRevisionRequired: boolean | null
      deleteRevisionRequired: boolean | null
    }>

    setUpdateRevisionRequired(id: string, val: boolean): Promise<void>
    unsetUpdateRevisionRequired(id: string): Promise<void>

    setDeleteRevisionRequired(id: string, val: boolean): Promise<void>
    unsetDeleteRevisionRequired(id: string): Promise<void>
  }

  Blacklist: {
    isEnabled(): boolean
    isBlocked(id: string): Promise<boolean>
    check(id: string): Promise<void>
    getAll(): Promise<string[]>
    add(id: string): Promise<void>
    remove(id: string): Promise<void>
  }

  Whitelist: {
    isEnabled(): boolean
    isBlocked(id: string): Promise<boolean>
    check(id: string): Promise<void>
    getAll(): Promise<string[]>
    add(id: string): Promise<void>
    remove(id: string): Promise<void>
  }

  JsonSchema: {
    isEnabled(): boolean
    validate(id: string, payload: unknown): Promise<void>
    getAllIds(): Promise<string[]>
    get(id: string): Promise<string | null>
    set(id: string, schema: import('@blackglory/types').Json): Promise<void>
    remove(id: string): Promise<void>
  }

  TBAC: {
    isEnabled(): boolean
    checkWritePermission(id: string, token?: string): Promise<void>
    checkReadPermission(id: string, token?: string): Promise<void>
    checkDeletePermission(id: string, token?: string): Promise<void>

    Token: {
      getAllIds(): Promise<string[]>
      getAll(id: string): Promise<Array<{
        token: string
        write: boolean
        read: boolean
        delete: boolean
      }>>

      setWriteToken(id: string, token: string): Promise<void>
      unsetWriteToken(id: string, token: string): Promise<void>

      setReadToken(id: string, token: string): Promise<void>
      unsetReadToken(id: string, token: string): Promise<void>

      setDeleteToken(id: string, token: string): Promise<void>
      unsetDeleteToken(id: string, token: string): Promise<void>
    }

    TokenPolicy: {
      getAllIds(): Promise<string[]>
      get(id: string): Promise<{
        writeTokenRequired: boolean | null
        readTokenRequired: boolean | null
      }>

      setWriteTokenRequired(id: string, val: boolean): Promise<void>
      unsetWriteTokenRequired(id: string): Promise<void>

      setReadTokenRequired(id: string, val: boolean): Promise<void>
      unsetReadTokenRequired(id: string): Promise<void>

      setDeleteTokenRequired(id: string, val: boolean): Promise<void>
      unsetDeleteTokenRequired(id: string): Promise<void>
    }
  }

  Error: {
    Forbidden: new () => Error
    Unauthorized: new () => Error
    NotFound: new () => Error
    IncorrectRevision: new () => Error
  }
}
