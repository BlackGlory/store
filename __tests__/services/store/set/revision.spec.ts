import { buildServer } from '@src/server'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { RevisionPolicyDAO, StoreDAO } from '@dao'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('revision', () => {
  describe('update revision optional', () => {
    describe('correct revision', () => {
      it('204', async () => {
        const storeId = 'store-id'
        const itemId = 'item-id'
        const server = await buildServer()
        const revision = await StoreDAO.setItem(storeId, itemId, 'text/plain', 'document')

        const res = await server.inject({
          method: 'PUT'
        , url: `/store/${storeId}/items/${itemId}`
        , headers: {
            'if-match': revision
          , 'content-type': 'text/plain'
          }
        , payload: 'new document'
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('incorrect revision', () => {
      it('412', async () => {
        const storeId = 'store-id'
        const itemId = 'item-id'
        const server = await buildServer()
        await StoreDAO.setItem(storeId, itemId, 'text/plain', 'document')

        const res = await server.inject({
          method: 'PUT'
        , url: `/store/${storeId}/items/${itemId}`
        , headers: {
            'if-match': 'bad-revision'
          , 'content-type': 'text/plain'
          }
        , payload: 'new document'
        })

        expect(res.statusCode).toBe(412)
      })
    })

    describe('no revision', () => {
      it('204', async () => {
        const storeId = 'store-id'
        const itemId = 'item-id'
        const server = await buildServer()
        await StoreDAO.setItem(storeId, itemId, 'text/plain', 'document')

        const res = await server.inject({
          method: 'PUT'
        , url: `/store/${storeId}/items/${itemId}`
        , headers: { 'content-type': 'text/plain' }
        , payload: 'new document'
        })

        expect(res.statusCode).toBe(204)
      })
    })
  })

  describe('update revision required', () => {
    describe('correct revision', () => {
      it('204', async () => {
        const storeId = 'store-id'
        const itemId = 'item-id'
        const server = await buildServer()
        const revision = await StoreDAO.setItem(storeId, itemId, 'text/plain', 'document')
        await RevisionPolicyDAO.setUpdateRevisionRequired(storeId, true)

        const res = await server.inject({
          method: 'PUT'
        , url: `/store/${storeId}/items/${itemId}`
        , headers: {
            'if-match': revision
          , 'content-type': 'text/plain'
          }
        , payload: 'new document'
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('incorrect revision', () => {
      it('412', async () => {
        const storeId = 'store-id'
        const itemId = 'item-id'
        const server = await buildServer()
        await StoreDAO.setItem(storeId, itemId, 'text/plain', 'document')
        await RevisionPolicyDAO.setUpdateRevisionRequired(storeId, true)

        const res = await server.inject({
          method: 'PUT'
        , url: `/store/${storeId}/items/${itemId}`
        , headers: {
            'if-match': 'bad-revision'
          , 'content-type': 'text/plain'
          }
        , payload: 'new document'
        })

        expect(res.statusCode).toBe(412)
      })
    })

    describe('no revision', () => {
      it('412', async () => {
        const storeId = 'store-id'
        const itemId = 'item-id'
        const server = await buildServer()
        await StoreDAO.setItem(storeId, itemId, 'text/plain', 'document')
        await RevisionPolicyDAO.setUpdateRevisionRequired(storeId, true)

        const res = await server.inject({
          method: 'PUT'
        , url: `/store/${storeId}/items/${itemId}`
        , headers: { 'content-type': 'text/plain' }
        , payload: 'new document'
        })

        expect(res.statusCode).toBe(412)
      })
    })
  })
})
