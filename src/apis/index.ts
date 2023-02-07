import { IAPI } from '@src/contract.js'
import { stats } from './stats.js'
import { getAllNamespaces } from './get-all-namespaces.js'
import { getAllItemIds } from './get-all-item-ids.js'
import { clearItemsByNamespace } from './clear-items-by-namespace.js'
import { hasItem } from './has-item.js'
import { getItem } from './get-item.js'
import { setItem } from './set-item.js'
import { removeItem } from './remove-item.js'

export const API: IAPI = {
  stats
, getAllNamespaces
, getAllItemIds
, clearItemsByNamespace
, hasItem
, getItem
, setItem
, removeItem
}
