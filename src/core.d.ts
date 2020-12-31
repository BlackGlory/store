type Json = import('@blackglory/types').Json
type CustomErrorConstructor = import('@blackglory/errors').CustomErrorConstructor
type IRevision = string

interface Stats {
  id: string
  items: number
}

interface IItem {
  rev: IRevision
  type: string
  payload: string
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
    listItems(store: string): AsyncIterable<string>
    listStores(): AsyncIterable<string>
    clear(store: string): Promise<void>
    stats(store: string): Promise<Stats>

    /**
     * @throws {IncorrectionRevision}
     */
    set(store: string, id: string, type: string, payload: string, rev?: IRevision): Promise<IRevision>

    /**
     * @throws {NotFound}
     * @throws {IncorrectRevision}
     */
    del(store: string, id: string, rev?: IRevision): Promise<void>

    NotFound: new (namespace: string, id: string) => CustomError
    IncorrectRevision: new (namespace: string, id: string) => CustomError
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
    getAll(): Promise<string[]>
    add(id: string): Promise<void>
    remove(id: string): Promise<void>

    /**
     * @throws {Forbidden}
     */
    check(id: string): Promise<void>
    Forbidden: CustomErrorConstructor
  }

  Whitelist: {
    isEnabled(): boolean
    isBlocked(id: string): Promise<boolean>
    getAll(): Promise<string[]>
    add(id: string): Promise<void>
    remove(id: string): Promise<void>

    /**
     * @throws {Forbidden}
     */
    check(id: string): Promise<void>
    Forbidden: CustomErrorConstructor
  }

  JsonSchema: {
    isEnabled(): boolean
    getAllIds(): Promise<string[]>
    get(id: string): Promise<string | null>
    set(id: string, schema: Json): Promise<void>
    remove(id: string): Promise<void>

    /**
     * @throws {InvalidPayload}
     */
    validate(id: string, payload: Json): Promise<void>
    InvalidPayload: CustomErrorConstructor
  }

  TBAC: {
    isEnabled(): boolean

    /**
     * @throws {Unauthorized}
     */
    checkWritePermission(id: string, token?: string): Promise<void>

    /**
     * @throws {Unauthorized}
     */
    checkReadPermission(id: string, token?: string): Promise<void>

    /**
     * @throws {Unauthorized}
     */
    checkDeletePermission(id: string, token?: string): Promise<void>

    Unauthorized: CustomErrorConstructor

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
}
