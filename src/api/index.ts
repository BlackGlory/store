import { isAdmin } from './admin.js'
import * as Store from './store.js'
import * as RevisionPolicy from './revision-policy.js'
import { IAPI } from './contract.js'

export const api: IAPI = {
  isAdmin
, Store
, RevisionPolicy
}
