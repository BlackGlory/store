import { Forbidden, Unauthorized } from '../error'
import {
  TOKEN_BASED_ACCESS_CONTROL
, READ_TOKEN_REQUIRED
, WRITE_TOKEN_REQUIRED
, DELETE_TOKEN_REQUIRED
} from '@env'
import { AccessControlDAO } from '@dao'
import * as TokenPolicy from './token-policy'
import * as Token from './token'

export const TBAC: ICore['TBAC'] = {
  isEnabled
, checkWritePermission
, checkReadPermission
, checkDeletePermission
, TokenPolicy
, Token
}

function isEnabled() {
  return TOKEN_BASED_ACCESS_CONTROL()
}

async function checkWritePermission(id: string, token?: string) {
  if (!isEnabled()) return

  const writeTokenRequired =
    (await TokenPolicy.get(id)).writeTokenRequired
  ?? WRITE_TOKEN_REQUIRED()

  if (writeTokenRequired) {
    if (!token) throw new Unauthorized()
    if (!await AccessControlDAO.matchWriteToken({ token, id })) throw new Unauthorized()
  }

}

async function checkReadPermission(id: string, token?: string) {
  if (!isEnabled()) return

  const readTokenRequired =
    (await TokenPolicy.get(id)).readTokenRequired
  ?? READ_TOKEN_REQUIRED()

  if (readTokenRequired) {
    if (!token) throw new Unauthorized()
    if (!await AccessControlDAO.matchReadToken({ token, id })) throw new Unauthorized()
  }
}

async function checkDeletePermission(id: string, token?: string) {
  if (!isEnabled()) return

  const deleteTokenRequired =
    (await TokenPolicy.get(id)).deleteTokenRequired
  ?? DELETE_TOKEN_REQUIRED()

  if (deleteTokenRequired) {
    if (!token) throw new Unauthorized()
    if (!await AccessControlDAO.matchDeleteToken({ token, id })) throw new Unauthorized()
  }
}
