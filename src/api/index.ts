import { isAdmin } from './admin.js'
import * as Blacklist from './blacklist.js'
import * as Whitelist from './whitelist.js'
import * as JsonSchema from './json-schema.js'
import { TBAC } from './token-based-access-control/index.js'
import * as Store from './store.js'
import * as RevisionPolicy from './revision-policy.js'
import { IAPI } from './contract.js'

export const api: IAPI = {
  isAdmin
, Store
, RevisionPolicy
, Blacklist
, Whitelist
, JsonSchema
, TBAC
}
