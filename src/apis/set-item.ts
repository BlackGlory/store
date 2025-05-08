import { isntUndefined, JSONValue } from '@blackglory/prelude'
import { setItem as _setItem, setItemWithRevision } from '@dao/set-item.js'
import { IncorrectRevision } from '@src/contract.js'

/**
 * @throws {IncorrectRevision}
 */
export function setItem(
  namespace: string
, itemId: string
, value: JSONValue
, revision?: string
): string {
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
