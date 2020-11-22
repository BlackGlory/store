import { NotFound, IncorrectHash } from './error'
import { setItem } from './set-item'
import { getItem }  from './get-item'
import { hasItem } from './has-item'
import { updateItem, updateItemWithCheck } from './update-item'
import { removeItem, removeItemWithCheck } from './remove-item'
import { listAllItemIds } from './list-all-item-ids'

export const StoreDAO: IStoreDAO = {
  hasItem
, getItem
, setItem
, updateItem
, updateItemWithCheck
, removeItem
, removeItemWithCheck
, listAllItemIds
, Error: {
    NotFound
  , IncorrectHash
  }
}
