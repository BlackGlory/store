import { buildServer } from '@src/server'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO, StoreDAO } from '@dao'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('whitelist', () => {
  describe('enabled', () => {
    describe('id in whitelist', () => {
      it('204', async () => {
        process.env.STORE_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const storeId = 'store-id'
        const itemId = 'item-id'
        const payload = 'document'
        const server = await buildServer()
        await AccessControlDAO.addWhitelistItem(storeId)

        const res = await server.inject({
          method: 'PUT'
        , url: `/store/${storeId}/items/${itemId}`
        , headers: { "content-type": 'text/plain' }
        , payload
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('id not in whitelist', () => {
      it('403', async () => {
        process.env.STORE_LIST_BASED_ACCESS_CONTROL = 'whitelist'
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

        expect(res.statusCode).toBe(403)
      })
    })
  })

  describe('disabled', () => {
    describe('id not in whitelist', () => {
      it('204', async () => {
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