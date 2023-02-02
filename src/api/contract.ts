import { JSONValue } from '@blackglory/prelude'
import { CustomError, CustomErrorConstructor } from '@blackglory/errors'

export type IRevision = string

export interface IStats {
  namespace: string
  items: number
}

export interface IItem {
  revision: IRevision
  type: string
  payload: string
}

export interface IAPI {
  isAdmin(password: string): boolean

  Store: {
    has(namespace: string, id: string): boolean
    get(namespace: string, id: string): IItem | null
    getAllItemIds(namespace: string): Iterable<string>
    getAllNamespaces(): Iterable<string>
    clear(namespace: string): void
    stats(namespace: string): IStats

    /**
     * @throws {IncorrectionRevision}
     */
    set(
      namespace: string
    , id: string
    , type: string
    , payload: string
    , revision?: IRevision
    ): IRevision

    /**
     * @throws {NotFound}
     * @throws {IncorrectRevision}
     */
    del(namespace: string, id: string, revision?: IRevision): void

    NotFound: new (namespace: string, id: string) => CustomError
    IncorrectRevision: new (namespace: string, id: string) => CustomError
  }

  RevisionPolicy: {
    getAllNamespaces(): string[]
    get(namespace: string): {
      updateRevisionRequired: boolean | null
      deleteRevisionRequired: boolean | null
    }

    setUpdateRevisionRequired(namespace: string, val: boolean): void
    unsetUpdateRevisionRequired(namespace: string): void

    setDeleteRevisionRequired(namespace: string, val: boolean): void
    unsetDeleteRevisionRequired(namespace: string): void
  }

  Blacklist: {
    isEnabled(): boolean
    isBlocked(namespace: string): boolean
    getAll(): string[]
    add(namespace: string): void
    remove(namespace: string): void

    /**
     * @throws {Forbidden}
     */
    check(namespace: string): void
    Forbidden: CustomErrorConstructor
  }

  Whitelist: {
    isEnabled(): boolean
    isBlocked(namespace: string): boolean
    getAll(): string[]
    add(namespace: string): void
    remove(namespace: string): void

    /**
     * @throws {Forbidden}
     */
    check(namespace: string): void
    Forbidden: CustomErrorConstructor
  }

  JSONSchema: {
    isEnabled(): boolean
    getAllNamespaces(): string[]
    get(namespace: string): string | null
    set(namespace: string, schema: JSONValue): void
    remove(namespace: string): void

    /**
     * @throws {InvalidPayload}
     */
    validate(namespace: string, payload: JSONValue): void
    InvalidPayload: CustomErrorConstructor
  }

  TBAC: {
    isEnabled(): boolean

    /**
     * @throws {Unauthorized}
     */
    checkWritePermission(namespace: string, token?: string): void

    /**
     * @throws {Unauthorized}
     */
    checkReadPermission(namespace: string, token?: string): void

    /**
     * @throws {Unauthorized}
     */
    checkDeletePermission(namespace: string, token?: string): void

    Unauthorized: CustomErrorConstructor

    Token: {
      getAllNamespaces(): string[]
      getAll(namespace: string): Array<{
        token: string
        write: boolean
        read: boolean
        delete: boolean
      }>

      setWriteToken(namespace: string, token: string): void
      unsetWriteToken(namespace: string, token: string): void

      setReadToken(namespace: string, token: string): void
      unsetReadToken(namespace: string, token: string): void

      setDeleteToken(namespace: string, token: string): void
      unsetDeleteToken(namespace: string, token: string): void
    }

    TokenPolicy: {
      getAllNamespaces(): string[]
      get(namespace: string): {
        writeTokenRequired: boolean | null
        readTokenRequired: boolean | null
      }

      setWriteTokenRequired(namespace: string, val: boolean): void
      unsetWriteTokenRequired(namespace: string): void

      setReadTokenRequired(namespace: string, val: boolean): void
      unsetReadTokenRequired(namespace: string): void

      setDeleteTokenRequired(namespace: string, val: boolean): void
      unsetDeleteTokenRequired(namespace: string): void
    }
  }
}
