import * as RevisionPolicy from './revision-policy.js'

export const RevisionPolicyDAO: IRevisionPolicyDAO = {
  getAllNamespacesWithRevisionPolicies: asyncify(RevisionPolicy.getAllNamespacesWithRevisionPolicies)
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
