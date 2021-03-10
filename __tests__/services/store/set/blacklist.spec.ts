import { startService, stopService, getServer } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO, StoreDAO } from '@dao'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('blacklist', () => {
  describe('enabled', () => {
    describe('id in blacklist', () => {
      it('403', async () => {
        process.env.STORE_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const storeId = 'store-id'
        const itemId = 'item-id'
        const payload = 'document'
        const server = getServer()
        await AccessControlDAO.addBlacklistItem(storeId)

        const res = await server.inject({
          method: 'PUT'
        , url: `/store/${storeId}/items/${itemId}`
        , headers: { "content-type": 'text/plain' }
        , payload
        })

        expect(res.statusCode).toBe(403)
      })
    })

    describe('id not in blacklist', () => {
      it('204', async () => {
        process.env.STORE_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const storeId = 'store-id'
        const itemId = 'item-id'
        const payload = 'document'
        const server = getServer()

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

  describe('disabled', () => {
    describe('id in blacklist', () => {
      it('204', async () => {
        const storeId = 'store-id'
        const itemId = 'item-id'
        const server = getServer()
        await AccessControlDAO.addBlacklistItem(storeId)

        const res = await server.inject({
          method: 'PUT'
        , url: `/store/${storeId}/items/${itemId}`
        , headers: { "content-type": 'text/plain' }
        })

        expect(res.statusCode).toBe(204)
      })
    })
  })
})
