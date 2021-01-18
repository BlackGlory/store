import { isAdmin } from './admin'
import { metrics } from './metrics'
import * as Blacklist from './blacklist'
import * as Whitelist from './whitelist'
import * as JsonSchema from './json-schema'
import { TBAC } from './token-based-access-control'
import * as Store from './store'
import * as RevisionPolicy from './revision-policy'

export const Core: ICore = {
  isAdmin
, metrics
, Store
, RevisionPolicy
, Blacklist
, Whitelist
, JsonSchema
, TBAC
}
