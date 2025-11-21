import { CustomError } from '@blackglory/errors'
import { JSONValue } from '@blackglory/prelude'

export interface INamespaceStats {
  items: number
}

export interface IItem {
  value: JSONValue
  revision: string
}

export interface IAPI {
  getAllNamespaces(): string[]
  getAllItemIds(namespace: string): string[]

  getNamespaceStats(namespace: string): INamespaceStats

  clearItemsByNamespace(namespace: string): null

  hasItem(namespace: string, itemId: string): boolean
  getItem(namespace: string, itemId: string): IItem | null

  /**
   * @param revision
   * 可选参数, 用于实现乐观并发策略.
   * `null`表示目标项目不存在.
   * 
   * @throws {IncorrectRevision}
   * 在提供revision参数的情况下, 如果目标项目的revision值不等于参数, 或项目不存在, 则抛出此错误.
   * 
   * @returns 如果成功, 返回新的revision.
   */
  setItem(
    namespace: string
  , itemId: string
  , value: JSONValue
  , revision?: string | null
  ): string

  /**
   * @param revision 可选参数, 用于实现乐观并发策略.
   * @throws {IncorrectRevision}
   * 在提供revision参数的情况下, 如果目标项目的revision值不等于参数, 或项目不存在, 则抛出此错误.
   */
  removeItem(namespace: string, itemId: string, revision?: string): null
}

export class IncorrectRevision extends CustomError {}
