import { startService, stopService, getAddress } from '@test/utils'
import { AccessControlDAO, StoreDAO } from '@dao'
import { fetch } from 'extra-fetch'
import { get } from 'extra-request'
import { url, pathname } from 'extra-request/lib/es2018/transformers'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(startService)
afterEach(stopService)

describe('whitelist', () => {
  describe('enabled', () => {
    describe('namespace in whitelist', () => {
      it('200', async () => {
        process.env.STORE_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const namespace = 'namespace'
        const id = 'id'
        await StoreDAO.setItem(namespace, id, 'text/plain', 'document')
        await AccessControlDAO.addWhitelistItem(namespace)

        const res = await fetch(get(
          url(getAddress())
        , pathname(`/store/${namespace}/items/${id}`)
        ))

        expect(res.status).toBe(200)
      })
    })

    describe('namespace not in whitelist', () => {
      it('403', async () => {
        process.env.STORE_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const namespace = 'namespace'
        const id = 'id'
        await StoreDAO.setItem(namespace, id, 'text/plain', 'document')

        const res = await fetch(get(
          url(getAddress())
        , pathname(`/store/${namespace}/items/${id}`)
        ))

        expect(res.status).toBe(403)
      })
    })
  })

  describe('disabled', () => {
    describe('namespace not in whitelist', () => {
      it('200', async () => {
        const namespace = 'namespace'
        const id = 'id'
        await StoreDAO.setItem(namespace, id, 'text/plain', 'document')

        const res = await fetch(get(
          url(getAddress())
        , pathname(`/store/${namespace}/items/${id}`)
        ))

        expect(res.status).toBe(200)
      })
    })
  })
})
