import { isntUndefined } from '@blackglory/prelude'
import { removeItem as _removeItem, removeItemWithRevision } from '@dao/remove-item.js'
import { IncorrectRevision } from '@src/contract.js'

/**
 * @throws {IncorrectRevision}
 */
export function removeItem(
  namespace: string
, itemId: string
, revision?: string
): null {
  if (isntUndefined(revision)) {
    if (!removeItemWithRevision(namespace, itemId, revision)) {
      throw new IncorrectRevision()
    }
  } else {
    _removeItem(namespace, itemId)
  }
  return null
}
