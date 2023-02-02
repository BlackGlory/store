import { startService, stopService, getAddress } from '@test/utils.js'
import { AccessControlDAO } from '@dao/index.js'
import { fetch } from 'extra-fetch'
import { del } from 'extra-request'
import { url, pathname, searchParam } from 'extra-request/transformers'

beforeEach(startService)
afterEach(stopService)

describe('token-based access control', () => {
  describe('enabled', () => {
    describe('namespace need delete tokens', () => {
      describe('token matched', () => {
        it('204', async () => {
          process.env.STORE_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const token = 'token'
          AccessControlDAO.TokenPolicy.setDeleteTokenRequired(namespace, true)
          AccessControlDAO.Token.setDeleteToken({ namespace, token })

          const res = await fetch(del(
            url(getAddress())
          , pathname(`/store/${namespace}`)
          , searchParam('token', token)
          ))

          expect(res.status).toBe(204)
        })
      })

      describe('token does not matched', () => {
        it('401', async () => {
          process.env.STORE_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const token = 'token'
          AccessControlDAO.TokenPolicy.setDeleteTokenRequired(namespace, true)
          AccessControlDAO.Token.setDeleteToken({ namespace, token })

          const res = await fetch(del(
            url(getAddress())
          , pathname(`/store/${namespace}`)
          ))

          expect(res.status).toBe(401)
        })
      })

      describe('no token', () => {
        it('401', async () => {
          process.env.STORE_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const token = 'token'
          AccessControlDAO.TokenPolicy.setDeleteTokenRequired(namespace, true)
          AccessControlDAO.Token.setDeleteToken({ namespace, token })

          const res = await fetch(del(
            url(getAddress())
          , pathname(`/store/${namespace}`)
          ))

          expect(res.status).toBe(401)
        })
      })
    })

    describe('namespace does not need delete tokens', () => {
      describe('DELETE_TOKEN_REQUIRED=true', () => {
        it('401', async () => {
          process.env.STORE_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.STORE_DELETE_TOKEN_REQUIRED = 'true'
          const namespace = 'namespace'

          const res = await fetch(del(
            url(getAddress())
          , pathname(`/store/${namespace}`)
          ))

          expect(res.status).toBe(401)
        })
      })

      describe('DELETE_TOKEN_REQUIRED=false', () => {
        it('204', async () => {
          process.env.STORE_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'

          const res = await fetch(del(
            url(getAddress())
          , pathname(`/store/${namespace}`)
          ))

          expect(res.status).toBe(204)
        })
      })
    })
  })

  describe('disabled', () => {
    describe('namespace need delete tokens', () => {
      describe('no token', () => {
        it('204', async () => {
          const namespace = 'namespace'
          const token = 'token'
          AccessControlDAO.TokenPolicy.setDeleteTokenRequired(namespace, true)
          AccessControlDAO.Token.setDeleteToken({ namespace, token })

          const res = await fetch(del(
            url(getAddress())
          , pathname(`/store/${namespace}`)
          ))

          expect(res.status).toBe(204)
        })
      })
    })

    describe('namespace does not need delete tokens', () => {
      describe('DELETE_TOKEN_REQUIRED=true', () => {
        it('204', async () => {
          process.env.STORE_DELETE_TOKEN_REQUIRED = 'true'
          const namespace = 'namespace'
          const token = 'token'
          AccessControlDAO.TokenPolicy.setDeleteTokenRequired(namespace, true)
          AccessControlDAO.Token.setDeleteToken({ namespace, token })

          const res = await fetch(del(
            url(getAddress())
          , pathname(`/store/${namespace}`)
          ))

          expect(res.status).toBe(204)
        })
      })
    })
  })
})
