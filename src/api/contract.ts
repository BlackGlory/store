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
}
