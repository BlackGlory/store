import { isUndefined, JSONValue } from '@blackglory/prelude'
import { setItem as _setItem, setItemWithRevision } from '@dao/set-item.js'
import { isntAbortSignal } from 'extra-abort'

/**
 * @throws {IncorrectRevision}
 */
export function setItem(
  namespace: string
, itemId: string
, value: JSONValue
, revision: string | null
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
  , revision: string | null
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

  if (isUndefined(revision)) {
    return _setItem(namespace, itemId, value)
  } else {
    return setItemWithRevision(namespace, itemId, value, revision)
  }
}
