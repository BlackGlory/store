import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { RevisionPolicyDAO, StoreDAO } from '@dao'
import { fetch } from 'extra-fetch'
import { put } from 'extra-request'
import { url, pathname, header, text } from 'extra-request/lib/es2018/transformers'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('revision', () => {
  describe('update revision optional', () => {
    describe('correct revision', () => {
      it('204', async () => {
        const storeId = 'store-id'
        const itemId = 'item-id'
        const revision = await StoreDAO.setItem(storeId, itemId, 'text/plain', 'document')

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/store/${storeId}/items/${itemId}`)
        , header('If-Match', revision)
        , text('new document')
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('incorrect revision', () => {
      it('412', async () => {
        const storeId = 'store-id'
        const itemId = 'item-id'
        await StoreDAO.setItem(storeId, itemId, 'text/plain', 'document')

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/store/${storeId}/items/${itemId}`)
        , header('If-Match', 'bad-revision')
        , text('new document')
        ))

        expect(res.status).toBe(412)
      })
    })

    describe('no revision', () => {
      it('204', async () => {
        const storeId = 'store-id'
        const itemId = 'item-id'
        await StoreDAO.setItem(storeId, itemId, 'text/plain', 'document')

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/store/${storeId}/items/${itemId}`)
        , text('new document')
        ))

        expect(res.status).toBe(204)
      })
    })
  })

  describe('update revision required', () => {
    describe('correct revision', () => {
      it('204', async () => {
        const storeId = 'store-id'
        const itemId = 'item-id'
        const revision = await StoreDAO.setItem(storeId, itemId, 'text/plain', 'document')
        await RevisionPolicyDAO.setUpdateRevisionRequired(storeId, true)

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/store/${storeId}/items/${itemId}`)
        , header('If-Match', revision)
        , text('new document')
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('incorrect revision', () => {
      it('412', async () => {
        const storeId = 'store-id'
        const itemId = 'item-id'
        await StoreDAO.setItem(storeId, itemId, 'text/plain', 'document')
        await RevisionPolicyDAO.setUpdateRevisionRequired(storeId, true)

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/store/${storeId}/items/${itemId}`)
        , header('If-Match', 'bad-revision')
        , text('new document')
        ))

        expect(res.status).toBe(412)
      })
    })

    describe('no revision', () => {
      it('412', async () => {
        const storeId = 'store-id'
        const itemId = 'item-id'
        await StoreDAO.setItem(storeId, itemId, 'text/plain', 'document')
        await RevisionPolicyDAO.setUpdateRevisionRequired(storeId, true)

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/store/${storeId}/items/${itemId}`)
        , text('new document')
        ))

        expect(res.status).toBe(412)
      })
    })
  })
})
