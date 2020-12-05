import { NotFound, IncorrectRevision } from './error'
import { setItem } from './set-item'
import { getItem }  from './get-item'
import { hasItem } from './has-item'
import { updateItem, updateItemWithCheck } from './update-item'
import { deleteItem, deleteItemWithCheck } from './delete-item'
import { listAllItemIds } from './list-all-item-ids'

export const StoreDAO: IStoreDAO = {
  hasItem
, getItem
, setItem
, updateItem
, updateItemWithCheck
, deleteItem
, deleteItemWithCheck
, listAllItemIds
, Error: {
    NotFound
  , IncorrectRevision
  }
}
