import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO, StoreDAO } from '@dao'
import { fetch } from 'extra-fetch'
import { get, put, del } from 'extra-request'
import { url, pathname, headers } from 'extra-request/lib/es2018/transformers'
import { toJSON } from 'extra-response'

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
        await StoreDAO.setItem(storeId, itemId, 'text/plain', 'document')
        await AccessControlDAO.addBlacklistItem(storeId)

        const res = await fetch(get(
          url(getAddress())
        , pathname(`/store/${storeId}/items/${itemId}`)
        ))

        expect(res.status).toBe(403)
      })
    })

    describe('id not in blacklist', () => {
      it('200', async () => {
        process.env.STORE_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const storeId = 'store-id'
        const itemId = 'item-id'
        await StoreDAO.setItem(storeId, itemId, 'text/plain', 'document')

        const res = await fetch(get(
          url(getAddress())
        , pathname(`/store/${storeId}/items/${itemId}`)
        ))

        expect(res.status).toBe(200)
      })
    })
  })

  describe('disabled', () => {
    describe('id in blacklist', () => {
      it('200', async () => {
        const storeId = 'store-id'
        const itemId = 'item-id'
        await StoreDAO.setItem(storeId, itemId, 'text/plain', 'document')
        await AccessControlDAO.addBlacklistItem(storeId)

        const res = await fetch(get(
          url(getAddress())
        , pathname(`/store/${storeId}/items/${itemId}`)
        ))

        expect(res.status).toBe(200)
      })
    })
  })
})
