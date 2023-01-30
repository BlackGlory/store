import { NotFound, IncorrectRevision } from './error.js'
import { setItem } from './set-item.js'
import { getItem }  from './get-item.js'
import { hasItem } from './has-item.js'
import { updateItem, updateItemWithCheck } from './update-item.js'
import { deleteItem, deleteItemWithCheck } from './delete-item.js'
import { clearItems } from './clear-items.js'
import { getAllItemIds } from './get-all-item-ids.js'
import { getAllNamespaces } from './get-all-namespaces.js'
import { stats } from './stats.js'

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
, getAllNamespaces: asyncifyIterable(getAllNamespaces)

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
