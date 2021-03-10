import { startService, stopService, getServer } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { RevisionPolicyDAO, StoreDAO } from '@dao'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('revision', () => {
  describe('delete revision optional', () => {
    describe('correct revision', () => {
      it('204', async () => {
        const storeId = 'store-id'
        const itemId = 'item-id'
        const server = getServer()
        const revision = await StoreDAO.setItem(storeId, itemId, 'text/plain', 'document')

        const res = await server.inject({
          method: 'DELETE'
        , url: `/store/${storeId}/items/${itemId}`
        , headers: { 'if-match': revision }
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('incorrect revision', () => {
      it('412', async () => {
        const storeId = 'store-id'
        const itemId = 'item-id'
        const server = getServer()
        await StoreDAO.setItem(storeId, itemId, 'text/plain', 'document')

        const res = await server.inject({
          method: 'DELETE'
        , url: `/store/${storeId}/items/${itemId}`
        , headers: { 'if-match': 'bad-revision' }
        })

        expect(res.statusCode).toBe(412)
      })
    })

    describe('no revision', () => {
      it('204', async () => {
        const storeId = 'store-id'
        const itemId = 'item-id'
        const server = getServer()
        await StoreDAO.setItem(storeId, itemId, 'text/plain', 'document')

        const res = await server.inject({
          method: 'DELETE'
        , url: `/store/${storeId}/items/${itemId}`
        })

        expect(res.statusCode).toBe(204)
      })
    })
  })

  describe('delete revision required', () => {
    describe('correct revision', () => {
      it('204', async () => {
        const storeId = 'store-id'
        const itemId = 'item-id'
        const server = getServer()
        const revision = await StoreDAO.setItem(storeId, itemId, 'text/plain', 'document')
        await RevisionPolicyDAO.setDeleteRevisionRequired(storeId, true)

        const res = await server.inject({
          method: 'DELETE'
        , url: `/store/${storeId}/items/${itemId}`
        , headers: { 'if-match': revision }
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('incorrect revision', () => {
      it('412', async () => {
        const storeId = 'store-id'
        const itemId = 'item-id'
        const server = getServer()
        await StoreDAO.setItem(storeId, itemId, 'text/plain', 'document')
        await RevisionPolicyDAO.setDeleteRevisionRequired(storeId, true)

        const res = await server.inject({
          method: 'DELETE'
        , url: `/store/${storeId}/items/${itemId}`
        , headers: { 'if-match': 'bad-revision' }
        })

        expect(res.statusCode).toBe(412)
      })
    })

    describe('no revision', () => {
      it('412', async () => {
        const storeId = 'store-id'
        const itemId = 'item-id'
        const server = getServer()
        await StoreDAO.setItem(storeId, itemId, 'text/plain', 'document')
        await RevisionPolicyDAO.setDeleteRevisionRequired(storeId, true)

        const res = await server.inject({
          method: 'DELETE'
        , url: `/store/${storeId}/items/${itemId}`
        })

        expect(res.statusCode).toBe(412)
      })
    })
  })
})
