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
        const server = getServer()
        await StoreDAO.setItem(storeId, itemId, 'text/plain', 'document')
        await AccessControlDAO.addBlacklistItem(storeId)

        const res = await server.inject({
          method: 'GET'
        , url: `/store/${storeId}/items/${itemId}`
        })

        expect(res.statusCode).toBe(403)
      })
    })

    describe('id not in blacklist', () => {
      it('200', async () => {
        process.env.STORE_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const storeId = 'store-id'
        const itemId = 'item-id'
        const server = getServer()
        await StoreDAO.setItem(storeId, itemId, 'text/plain', 'document')

        const res = await server.inject({
          method: 'GET'
        , url: `/store/${storeId}/items/${itemId}`
        })

        expect(res.statusCode).toBe(200)
      })
    })
  })

  describe('disabled', () => {
    describe('id in blacklist', () => {
      it('200', async () => {
        const storeId = 'store-id'
        const itemId = 'item-id'
        const server = getServer()
        await StoreDAO.setItem(storeId, itemId, 'text/plain', 'document')
        await AccessControlDAO.addBlacklistItem(storeId)

        const res = await server.inject({
          method: 'GET'
        , url: `/store/${storeId}/items/${itemId}`
        })

        expect(res.statusCode).toBe(200)
      })
    })
  })
})
