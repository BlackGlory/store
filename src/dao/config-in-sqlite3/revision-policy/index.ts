import * as RevisionPolicy from './revision-policy'

export const RevisionPolicyDAO: IRevisionPolicyDAO = {
  getAllIdsWithRevisionPolicies: asyncify(RevisionPolicy.getAllIdsWithRevisionPolicies)
, getRevisionPolicies: asyncify(RevisionPolicy.getRevisionPolicies)

, setUpdateRevisionRequired: asyncify(RevisionPolicy.setUpdateRevisionRequired)
, unsetUpdateRevisionRequired: asyncify(RevisionPolicy.unsetUpdateRevisionRequired)

, setDeleteRevisionRequired: asyncify(RevisionPolicy.setDeleteRevisionRequired)
, unsetDeleteRevisionRequired: asyncify(RevisionPolicy.unsetDeleteRevisionRequired)
}

function asyncify<T extends any[], U>(fn: (...args: T) => U): (...args: T) => Promise<U> {
  return async function (this: unknown, ...args: T): Promise<U> {
    return Reflect.apply(fn, this, args)
  }
}
