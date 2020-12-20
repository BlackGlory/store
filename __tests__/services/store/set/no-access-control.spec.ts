import { buildServer } from '@src/server'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { StoreDAO } from '@dao'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('no access control', () => {
  it('204', async () => {
    const server = await buildServer()
    const storeId = 'store-id'
    const itemId = 'item-id'
    const payload = 'document'
    await StoreDAO.setItem(storeId, itemId, 'text/plain', 'document')

    const res = await server.inject({
      method: 'PUT'
    , url: `/store/${storeId}/items/${itemId}`
    , headers: { "content-type": 'text/plain' }
    , payload
    })

    expect(res.statusCode).toBe(204)
  })
})
