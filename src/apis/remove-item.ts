import { removeItem as _removeItem, removeItemWithRevision } from '@dao/remove-item.js'
import { IncorrectRevision } from '@src/contract.js'
import { isntAbortSignal } from 'extra-abort'

/**
 * @throws {IncorrectRevision}
 */
export function removeItem(
  namespace: string
, itemId: string
, revision: string
, signal?: AbortSignal
): null
export function removeItem(
  namespace: string
, itemId: string
, signal?: AbortSignal
): null
export function removeItem(...args:
| [
    namespace: string
  , itemId: string
  , revision: string
  , signal?: AbortSignal
  ]
| [
    namespace: string
  , itemId: string
  , signal?: AbortSignal
  ]
): null {
  const [namespace, itemId, revisionOrSignal] = args
  const revision = isntAbortSignal(revisionOrSignal)
                 ? revisionOrSignal
                 : undefined

  if (revision) {
    if (!removeItemWithRevision(namespace, itemId, revision)) {
      throw new IncorrectRevision()
    }
  } else {
    _removeItem(namespace, itemId)
  }
  return null
}
