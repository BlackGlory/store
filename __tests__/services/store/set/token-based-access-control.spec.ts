import { buildServer } from '@src/server'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO, StoreDAO } from '@dao'
import 'jest-extended'

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
          const payload = 'document'
          const server = await buildServer()
          await AccessControlDAO.setWriteTokenRequired(storeId, true)
          await AccessControlDAO.setWriteToken({ id: storeId, token })

          const res = await server.inject({
            method: 'PUT'
          , url: `/store/${storeId}/items/${itemId}`
          , query: { token }
          , headers: { "content-type": 'text/plain' }
          , payload
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
          const payload = 'document'
          const server = await buildServer()
          await AccessControlDAO.setWriteTokenRequired(storeId, true)
          await AccessControlDAO.setWriteToken({ id: storeId, token })

          const res = await server.inject({
            method: 'PUT'
          , url: `/store/${storeId}/items/${itemId}`
          , headers: { "content-type": 'text/plain' }
          , payload
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
          const payload = 'document'
          const server = await buildServer()
          await AccessControlDAO.setWriteTokenRequired(storeId, true)
          await AccessControlDAO.setWriteToken({ id: storeId, token })

          const res = await server.inject({
            method: 'PUT'
          , url: `/store/${storeId}/items/${itemId}`
          , headers: { "content-type": 'text/plain' }
          , payload
          })

          expect(res.statusCode).toBe(401)
        })
      })
    })

    describe('id does not need delete tokens', () => {
      describe('WRITE_TOKEN_REQUIRED=true', () => {
        it('401', async () => {
          process.env.STORE_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.STORE_WRITE_TOKEN_REQUIRED = 'true'
          const storeId = 'store-id'
          const itemId = 'item-id'
          const payload = 'document'
          const server = await buildServer()

          const res = await server.inject({
            method: 'PUT'
          , url: `/store/${storeId}/items/${itemId}`
          , headers: { "content-type": 'text/plain' }
          , payload
          })

          expect(res.statusCode).toBe(401)
        })
      })

      describe('WRITE_TOKEN_REQUIRED=false', () => {
        it('204', async () => {
          process.env.STORE_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const storeId = 'store-id'
          const itemId = 'item-id'
          const payload = 'document'
          const server = await buildServer()

          const res = await server.inject({
            method: 'PUT'
          , url: `/store/${storeId}/items/${itemId}`
          , headers: { "content-type": 'text/plain' }
          , payload
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
          const payload = 'document'
          const server = await buildServer()
          await AccessControlDAO.setWriteTokenRequired(storeId, true)
          await AccessControlDAO.setWriteToken({ id: storeId, token })

          const res = await server.inject({
            method: 'PUT'
          , url: `/store/${storeId}/items/${itemId}`
          , headers: { "content-type": 'text/plain' }
          , payload
          })

          expect(res.statusCode).toBe(204)
        })
      })
    })

    describe('id does not need delete tokens', () => {
      describe('WRITE_TOKEN_REQUIRED=true', () => {
        it('204', async () => {
          process.env.STORE_WRITE_TOKEN_REQUIRED = 'true'
          const storeId = 'store-id'
          const itemId = 'item-id'
          const token = 'token'
          const payload = 'document'
          const server = await buildServer()
          await AccessControlDAO.setWriteTokenRequired(storeId, true)
          await AccessControlDAO.setWriteToken({ id: storeId, token })

          const res = await server.inject({
            method: 'PUT'
          , url: `/store/${storeId}/items/${itemId}`
          , headers: { "content-type": 'text/plain' }
          , payload
          })

          expect(res.statusCode).toBe(204)
        })
      })
    })
  })
})
