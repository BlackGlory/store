import { isAdmin } from './admin'
import { stats } from './stats'
import * as Error from './error'
import * as Blacklist from './blacklist'
import * as Whitelist from './whitelist'
import * as JsonSchema from './json-schema'
import { TBAC } from './token-based-access-control'
import * as Store from './store'

export const Core: ICore = {
  isAdmin
, stats
, Store
, Blacklist
, Whitelist
, JsonSchema
, TBAC
, Error
}
