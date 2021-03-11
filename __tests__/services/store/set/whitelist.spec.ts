import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'
import { fetch } from 'extra-fetch'
import { put } from 'extra-request'
import { url, pathname, text } from 'extra-request/lib/es2018/transformers'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('whitelist', () => {
  describe('enabled', () => {
    describe('id in whitelist', () => {
      it('204', async () => {
        process.env.STORE_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const storeId = 'store-id'
        const itemId = 'item-id'
        const payload = 'document'
        await AccessControlDAO.addWhitelistItem(storeId)

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/store/${storeId}/items/${itemId}`)
        , text(payload)
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('id not in whitelist', () => {
      it('403', async () => {
        process.env.STORE_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const storeId = 'store-id'
        const itemId = 'item-id'
        const payload = 'document'

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/store/${storeId}/items/${itemId}`)
        , text(payload)
        ))

        expect(res.status).toBe(403)
      })
    })
  })

  describe('disabled', () => {
    describe('id not in whitelist', () => {
      it('204', async () => {
        const storeId = 'store-id'
        const itemId = 'item-id'
        const payload = 'document'

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/store/${storeId}/items/${itemId}`)
        , text(payload)
        ))

        expect(res.status).toBe(204)
      })
    })
  })
})
