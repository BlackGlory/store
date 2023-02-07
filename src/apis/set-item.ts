import { isntUndefined } from '@blackglory/prelude'
import { setItem as _setItem, setItemWithRevision } from '@dao/set-item.js'
import { Revision } from '@src/contract.js'
import { IncorrectRevision } from '@src/errors.js'

/**
 * @throws {IncorrectRevision}
 */
export function setItem(
  namespace: string
, itemId: string
, value: string
, revision?: Revision
): Revision {
  if (isntUndefined(revision)) {
    const newRevision = setItemWithRevision(namespace, itemId, value, revision)
    if (newRevision) {
      return newRevision
    } else {
      throw new IncorrectRevision()
    }
  } else {
    return _setItem(namespace, itemId, value)
  }
}
