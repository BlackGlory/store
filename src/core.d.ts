type IRevision = string

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
    list(store: string): NodeJS.ReadableStream

    /**
     * @throws {IncorrectionRevision}
     */
    set(store: string, id: string, type: string, payload: string, rev?: IRevision): Promise<IRevision>

    /**
     * @throws {IncorrectRevision}
     * @throws {NotFound}
     */
    del(store: string, id: string, rev?: IRevision): Promise<void>

    IncorrectRevision: new () => import('@blackglory/errors').CustomError
    NotFound: new () => import('@blackglory/errors').CustomError
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
    Forbidden: new () => import('@blackglory/errors').CustomError
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
    Forbidden: new () => import('@blackglory/errors').CustomError
  }

  JsonSchema: {
    isEnabled(): boolean
    getAllIds(): Promise<string[]>
    get(id: string): Promise<string | null>
    set(id: string, schema: import('@blackglory/types').Json): Promise<void>
    remove(id: string): Promise<void>

    /**
     * @throws {InvalidPayload}
     */
    validate(id: string, payload: import('@blackglory/types').Json): Promise<void>
    InvalidPayload: new () => import('@blackglory/errors').CustomError
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

    Unauthorized: new () => import('@blackglory/errors').CustomError

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
