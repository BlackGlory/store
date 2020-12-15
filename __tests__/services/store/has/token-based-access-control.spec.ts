import { buildServer } from '@src/server'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO, StoreDAO } from '@dao'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-leveldb/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('token-based access control', () => {
  describe('enabled', () => {
    describe('id need delete tokens', () => {
      describe('token matched', () => {
        it('204', async () => {
          process.env.STORTOKEN_BASED_ACCESS_CONTROL = 'true'
          const storeId = 'store-id'
          const itemId = 'item-id'
          const token = 'token'
          const server = await buildServer()
          await StoreDAO.setItem(storeId, itemId, 'text/plain', 'document')
          await AccessControlDAO.setReadTokenRequired(storeId, true)
          await AccessControlDAO.setReadToken({ id: storeId, token })

          const res = await server.inject({
            method: 'HEAD'
          , url: `/store/${storeId}/items/${itemId}`
          , query: { token }
          })

          expect(res.statusCode).toBe(204)
        })
      })

      describe('token does not matched', () => {
        it('401', async () => {
          process.env.STORE_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const storeId = 'store-id'
          const itemId = 'item-id'
          const token = 'token'
          const server = await buildServer()
          await StoreDAO.setItem(storeId, itemId, 'text/plain', 'document')
          await AccessControlDAO.setReadTokenRequired(storeId, true)
          await AccessControlDAO.setReadToken({ id: storeId, token })

          const res = await server.inject({
            method: 'HEAD'
          , url: `/store/${storeId}/items/${itemId}`
          })

          expect(res.statusCode).toBe(401)
        })
      })

      describe('no token', () => {
        it('401', async () => {
          process.env.STORE_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const storeId = 'store-id'
          const itemId = 'item-id'
          const token = 'token'
          const server = await buildServer()
          await StoreDAO.setItem(storeId, itemId, 'text/plain', 'document')
          await AccessControlDAO.setReadTokenRequired(storeId, true)
          await AccessControlDAO.setReadToken({ id: storeId, token })

          const res = await server.inject({
            method: 'HEAD'
          , url: `/store/${storeId}/items/${itemId}`
          })

          expect(res.statusCode).toBe(401)
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
          const server = await buildServer()
          await StoreDAO.setItem(storeId, itemId, 'text/plain', 'document')

          const res = await server.inject({
            method: 'HEAD'
          , url: `/store/${storeId}/items/${itemId}`
          })

          expect(res.statusCode).toBe(401)
        })
      })

      describe('READ_TOKEN_REQUIRED=false', () => {
        it('204', async () => {
          process.env.STORE_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const storeId = 'store-id'
          const itemId = 'item-id'
          const server = await buildServer()
          await StoreDAO.setItem(storeId, itemId, 'text/plain', 'document')

          const res = await server.inject({
            method: 'HEAD'
          , url: `/store/${storeId}/items/${itemId}`
          })

          expect(res.statusCode).toBe(204)
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
          const server = await buildServer()
          await StoreDAO.setItem(storeId, itemId, 'text/plain', 'document')
          await AccessControlDAO.setReadTokenRequired(storeId, true)
          await AccessControlDAO.setReadToken({ id: storeId, token })

          const res = await server.inject({
            method: 'HEAD'
          , url: `/store/${storeId}/items/${itemId}`
          })

          expect(res.statusCode).toBe(204)
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
          const server = await buildServer()
          await StoreDAO.setItem(storeId, itemId, 'text/plain', 'document')
          await AccessControlDAO.setReadTokenRequired(storeId, true)
          await AccessControlDAO.setReadToken({ id: storeId, token })

          const res = await server.inject({
            method: 'HEAD'
          , url: `/store/${storeId}/items/${itemId}`
          })

          expect(res.statusCode).toBe(204)
        })
      })
    })
  })
})
