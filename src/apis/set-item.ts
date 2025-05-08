import { JSONValue } from '@blackglory/prelude'
import { setItem as _setItem, setItemWithRevision } from '@dao/set-item.js'
import { IncorrectRevision } from '@src/contract.js'
import { isntAbortSignal } from 'extra-abort'

/**
 * @throws {IncorrectRevision}
 */
export function setItem(
  namespace: string
, itemId: string
, value: JSONValue
, revision: string
, signal?: AbortSignal
): string
export function setItem(
  namespace: string
, itemId: string
, value: JSONValue
, signal?: AbortSignal
): string
export function setItem(...args:
| [
    namespace: string
  , itemId: string
  , value: JSONValue
  , revision: string
  , signal?: AbortSignal
  ]
| [
    namespace: string
  , itemId: string
  , value: JSONValue
  , signal?: AbortSignal
  ]
): string {
  const [namespace, itemId, value, revisionOrSignal] = args
  const revision = isntAbortSignal(revisionOrSignal)
                 ? revisionOrSignal
                 : undefined

  if (revision) {
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
