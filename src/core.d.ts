type JSONValue = import('justypes').JSONValue
type CustomErrorConstructor = import('@blackglory/errors').CustomErrorConstructor
type IRevision = string

interface IStats {
  namespace: string
  items: number
}

interface IItem {
  revision: IRevision
  type: string
  payload: string
}

interface ICore {
  isAdmin(password: string): boolean

  Store: {
    has(namespace: string, id: string): Promise<boolean>
    get(namespace: string, id: string): Promise<IItem | null>
    getAllItemIds(namespace: string): AsyncIterable<string>
    getAllNamespaces(): AsyncIterable<string>
    clear(namespace: string): Promise<void>
    stats(namespace: string): Promise<IStats>

    /**
     * @throws {IncorrectionRevision}
     */
    set(namespace: string, id: string, type: string, payload: string, revision?: IRevision): Promise<IRevision>

    /**
     * @throws {NotFound}
     * @throws {IncorrectRevision}
     */
    del(namespace: string, id: string, revision?: IRevision): Promise<void>

    NotFound: new (namespace: string, id: string) => CustomError
    IncorrectRevision: new (namespace: string, id: string) => CustomError
  }

  RevisionPolicy: {
    getAllNamespaces(): Promise<string[]>
    get(namespace: string): Promise<{
      updateRevisionRequired: boolean | null
      deleteRevisionRequired: boolean | null
    }>

    setUpdateRevisionRequired(namespace: string, val: boolean): Promise<void>
    unsetUpdateRevisionRequired(namespace: string): Promise<void>

    setDeleteRevisionRequired(namespace: string, val: boolean): Promise<void>
    unsetDeleteRevisionRequired(namespace: string): Promise<void>
  }

  Blacklist: {
    isEnabled(): boolean
    isBlocked(namespace: string): Promise<boolean>
    getAll(): Promise<string[]>
    add(namespace: string): Promise<void>
    remove(namespace: string): Promise<void>

    /**
     * @throws {Forbidden}
     */
    check(namespace: string): Promise<void>
    Forbidden: CustomErrorConstructor
  }

  Whitelist: {
    isEnabled(): boolean
    isBlocked(namespace: string): Promise<boolean>
    getAll(): Promise<string[]>
    add(namespace: string): Promise<void>
    remove(namespace: string): Promise<void>

    /**
     * @throws {Forbidden}
     */
    check(namespace: string): Promise<void>
    Forbidden: CustomErrorConstructor
  }

  JsonSchema: {
    isEnabled(): boolean
    getAllNamespaces(): Promise<string[]>
    get(namespace: string): Promise<string | null>
    set(namespace: string, schema: JSONValue): Promise<void>
    remove(namespace: string): Promise<void>

    /**
     * @throws {InvalidPayload}
     */
    validate(namespace: string, payload: JSONValue): Promise<void>
    InvalidPayload: CustomErrorConstructor
  }

  TBAC: {
    isEnabled(): boolean

    /**
     * @throws {Unauthorized}
     */
    checkWritePermission(namespace: string, token?: string): Promise<void>

    /**
     * @throws {Unauthorized}
     */
    checkReadPermission(namespace: string, token?: string): Promise<void>

    /**
     * @throws {Unauthorized}
     */
    checkDeletePermission(namespace: string, token?: string): Promise<void>

    Unauthorized: CustomErrorConstructor

    Token: {
      getAllNamespaces(): Promise<string[]>
      getAll(namespace: string): Promise<Array<{
        token: string
        write: boolean
        read: boolean
        delete: boolean
      }>>

      setWriteToken(namespace: string, token: string): Promise<void>
      unsetWriteToken(namespace: string, token: string): Promise<void>

      setReadToken(namespace: string, token: string): Promise<void>
      unsetReadToken(namespace: string, token: string): Promise<void>

      setDeleteToken(namespace: string, token: string): Promise<void>
      unsetDeleteToken(namespace: string, token: string): Promise<void>
    }

    TokenPolicy: {
      getAllNamespaces(): Promise<string[]>
      get(namespace: string): Promise<{
        writeTokenRequired: boolean | null
        readTokenRequired: boolean | null
      }>

      setWriteTokenRequired(namespace: string, val: boolean): Promise<void>
      unsetWriteTokenRequired(namespace: string): Promise<void>

      setReadTokenRequired(namespace: string, val: boolean): Promise<void>
      unsetReadTokenRequired(namespace: string): Promise<void>

      setDeleteTokenRequired(namespace: string, val: boolean): Promise<void>
      unsetDeleteTokenRequired(namespace: string): Promise<void>
    }
  }
}
