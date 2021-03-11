import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO, StoreDAO } from '@dao'
import { fetch } from 'extra-fetch'
import { head } from 'extra-request'
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
        it('204', async () => {
          process.env.STORTOKEN_BASED_ACCESS_CONTROL = 'true'
          const storeId = 'store-id'
          const itemId = 'item-id'
          const token = 'token'
          await StoreDAO.setItem(storeId, itemId, 'text/plain', 'document')
          await AccessControlDAO.setReadTokenRequired(storeId, true)
          await AccessControlDAO.setReadToken({ id: storeId, token })

          const res = await fetch(head(
            url(getAddress())
          , pathname(`/store/${storeId}/items/${itemId}`)
          , searchParam('token', token)
          ))

          expect(res.status).toBe(204)
        })
      })

      describe('token does not matched', () => {
        it('401', async () => {
          process.env.STORE_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const storeId = 'store-id'
          const itemId = 'item-id'
          const token = 'token'
          await StoreDAO.setItem(storeId, itemId, 'text/plain', 'document')
          await AccessControlDAO.setReadTokenRequired(storeId, true)
          await AccessControlDAO.setReadToken({ id: storeId, token })

          const res = await fetch(head(
            url(getAddress())
          , pathname(`/store/${storeId}/items/${itemId}`)
          ))

          expect(res.status).toBe(401)
        })
      })

      describe('no token', () => {
        it('401', async () => {
          process.env.STORE_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const storeId = 'store-id'
          const itemId = 'item-id'
          const token = 'token'
          await StoreDAO.setItem(storeId, itemId, 'text/plain', 'document')
          await AccessControlDAO.setReadTokenRequired(storeId, true)
          await AccessControlDAO.setReadToken({ id: storeId, token })

          const res = await fetch(head(
            url(getAddress())
          , pathname(`/store/${storeId}/items/${itemId}`)
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
          const itemId = 'item-id'
          await StoreDAO.setItem(storeId, itemId, 'text/plain', 'document')

          const res = await fetch(head(
            url(getAddress())
          , pathname(`/store/${storeId}/items/${itemId}`)
          ))

          expect(res.status).toBe(401)
        })
      })

      describe('READ_TOKEN_REQUIRED=false', () => {
        it('204', async () => {
          process.env.STORE_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const storeId = 'store-id'
          const itemId = 'item-id'
          await StoreDAO.setItem(storeId, itemId, 'text/plain', 'document')

          const res = await fetch(head(
            url(getAddress())
          , pathname(`/store/${storeId}/items/${itemId}`)
          ))

          expect(res.status).toBe(204)
        })
      })
    })
  })

  describe('disabled', () => {
    describe('id need delete tokens', () => {
      describe('no token', () => {
        it('204', async () => {
          const storeId = 'store-id'
          const itemId = 'item-id'
          const token = 'token'
          await StoreDAO.setItem(storeId, itemId, 'text/plain', 'document')
          await AccessControlDAO.setReadTokenRequired(storeId, true)
          await AccessControlDAO.setReadToken({ id: storeId, token })

          const res = await fetch(head(
            url(getAddress())
          , pathname(`/store/${storeId}/items/${itemId}`)
          ))

          expect(res.status).toBe(204)
        })
      })
    })

    describe('id does not need delete tokens', () => {
      describe('READ_TOKEN_REQUIRED=true', () => {
        it('204', async () => {
          process.env.STORE_READ_TOKEN_REQUIRED = 'true'
          const storeId = 'store-id'
          const itemId = 'item-id'
          const token = 'token'
          await StoreDAO.setItem(storeId, itemId, 'text/plain', 'document')
          await AccessControlDAO.setReadTokenRequired(storeId, true)
          await AccessControlDAO.setReadToken({ id: storeId, token })

          const res = await fetch(head(
            url(getAddress())
          , pathname(`/store/${storeId}/items/${itemId}`)
          ))

          expect(res.status).toBe(204)
        })
      })
    })
  })
})
