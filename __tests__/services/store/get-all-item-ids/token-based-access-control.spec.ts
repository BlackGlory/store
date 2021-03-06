import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'
import { fetch } from 'extra-fetch'
import { get } from 'extra-request'
import { url, pathname, searchParam } from 'extra-request/lib/es2018/transformers'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('token-based access control', () => {
  describe('enabled', () => {
    describe('id need delete tokens', () => {
      describe('token matched', () => {
        it('200', async () => {
          process.env.STORTOKEN_BASED_ACCESS_CONTROL = 'true'
          const storeId = 'store-id'
          const token = 'token'
          await AccessControlDAO.setReadTokenRequired(storeId, true)
          await AccessControlDAO.setReadToken({ id: storeId, token })

          const res = await fetch(get(
            url(getAddress())
          , pathname(`/store/${storeId}/items`)
          , searchParam('token', token)
          ))

          expect(res.status).toBe(200)
        })
      })

      describe('token does not matched', () => {
        it('401', async () => {
          process.env.STORE_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const storeId = 'store-id'
          const token = 'token'
          await AccessControlDAO.setReadTokenRequired(storeId, true)
          await AccessControlDAO.setReadToken({ id: storeId, token })

          const res = await fetch(get(
            url(getAddress())
          , pathname(`/store/${storeId}/items`)
          ))

          expect(res.status).toBe(401)
        })
      })

      describe('no token', () => {
        it('401', async () => {
          process.env.STORE_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const storeId = 'store-id'
          const token = 'token'
          await AccessControlDAO.setReadTokenRequired(storeId, true)
          await AccessControlDAO.setReadToken({ id: storeId, token })

          const res = await fetch(get(
            url(getAddress())
          , pathname(`/store/${storeId}/items`)
          ))

          expect(res.status).toBe(401)
        })
      })
    })

    describe('id does not need delete tokens', () => {
      describe('READ_TOKEN_REQUIRED=true', () => {
        it('401', async () => {
          process.env.STORE_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.STORE_READ_TOKEN_REQUIRED = 'true'
          const storeId = 'store-id'

          const res = await fetch(get(
            url(getAddress())
          , pathname(`/store/${storeId}/items`)
          ))

          expect(res.status).toBe(401)
        })
      })

      describe('READ_TOKEN_REQUIRED=false', () => {
        it('200', async () => {
          process.env.STORE_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const storeId = 'store-id'

          const res = await fetch(get(
            url(getAddress())
          , pathname(`/store/${storeId}/items`)
          ))

          expect(res.status).toBe(200)
        })
      })
    })
  })

  describe('disabled', () => {
    describe('id need delete tokens', () => {
      describe('no token', () => {
        it('200', async () => {
          const storeId = 'store-id'
          const token = 'token'
          await AccessControlDAO.setReadTokenRequired(storeId, true)
          await AccessControlDAO.setReadToken({ id: storeId, token })

          const res = await fetch(get(
            url(getAddress())
          , pathname(`/store/${storeId}/items`)
          ))

          expect(res.status).toBe(200)
        })
      })
    })

    describe('id does not need delete tokens', () => {
      describe('READ_TOKEN_REQUIRED=true', () => {
        it('200', async () => {
          process.env.STORE_READ_TOKEN_REQUIRED = 'true'
          const storeId = 'store-id'
          const token = 'token'
          await AccessControlDAO.setReadTokenRequired(storeId, true)
          await AccessControlDAO.setReadToken({ id: storeId, token })

          const res = await fetch(get(
            url(getAddress())
          , pathname(`/store/${storeId}/items`)
          ))

          expect(res.status).toBe(200)
        })
      })
    })
  })
})
