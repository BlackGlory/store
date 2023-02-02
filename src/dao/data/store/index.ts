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
import { IStoreDAO } from './contract.js'

export const StoreDAO: IStoreDAO = {
  hasItem
, getItem
, setItem
, stats

, updateItem
, updateItemWithCheck

, deleteItem
, deleteItemWithCheck
, clearItems

, getAllItemIds
, getAllNamespaces

, NotFound
, IncorrectRevision
}
