import { startService, stopService, getAddress } from '@test/utils'
import { AccessControlDAO } from '@dao'
import { fetch } from 'extra-fetch'
import { put } from 'extra-request'
import { url, pathname, text } from 'extra-request/lib/es2018/transformers'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(startService)
afterEach(stopService)

describe('blacklist', () => {
  describe('enabled', () => {
    describe('namespace in blacklist', () => {
      it('403', async () => {
        process.env.STORE_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const namespace = 'namespace'
        const id = 'id'
        const payload = 'document'
        await AccessControlDAO.addBlacklistItem(namespace)

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/store/${namespace}/items/${id}`)
        , text(payload)
        ))

        expect(res.status).toBe(403)
      })
    })

    describe('namespace not in blacklist', () => {
      it('204', async () => {
        process.env.STORE_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const namespace = 'namespace'
        const id = 'id'
        const payload = 'document'

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/store/${namespace}/items/${id}`)
        , text(payload)
        ))

        expect(res.status).toBe(204)
      })
    })
  })

  describe('disabled', () => {
    describe('namespace in blacklist', () => {
      it('204', async () => {
        const namespace = 'namespace'
        const id = 'id'
        const payload = 'document'
        await AccessControlDAO.addBlacklistItem(namespace)

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/store/${namespace}/items/${id}`)
        , text(payload)
        ))

        expect(res.status).toBe(204)
      })
    })
  })
})
