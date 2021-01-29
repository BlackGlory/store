import { NotFound, IncorrectRevision } from './error'
import { setItem } from './set-item'
import { getItem }  from './get-item'
import { hasItem } from './has-item'
import { updateItem, updateItemWithCheck } from './update-item'
import { deleteItem, deleteItemWithCheck } from './delete-item'
import { clearItems } from './clear-items'
import { getAllItemIds } from './get-all-item-ids'
import { getAllStoreIds } from './get-all-store-ids'
import { stats } from './stats'

export const StoreDAO: IStoreDAO = {
  hasItem: asyncify(hasItem)
, getItem: asyncify(getItem)
, setItem: asyncify(setItem)
, stats: asyncify(stats)

, updateItem: asyncify(updateItem)
, updateItemWithCheck: asyncify(updateItemWithCheck)

, deleteItem: asyncify(deleteItem)
, deleteItemWithCheck: asyncify(deleteItemWithCheck)
, clearItems: asyncify(clearItems)

, getAllItemIds: asyncifyIterable(getAllItemIds)
, getAllStoreIds: asyncifyIterable(getAllStoreIds)

, NotFound
, IncorrectRevision
}

function asyncify<T extends any[], U>(fn: (...args: T) => U): (...args: T) => Promise<U> {
  return async function (this: unknown, ...args: T): Promise<U> {
    return Reflect.apply(fn, this, args)
  }
}

function asyncifyIterable<T extends any[], U>(fn: (...args: T) => Iterable<U>): (...args: T) => AsyncIterable<U> {
  return async function* (this: unknown, ...args: T): AsyncIterable<U> {
    yield* Reflect.apply(fn, this, args)
  }
}
