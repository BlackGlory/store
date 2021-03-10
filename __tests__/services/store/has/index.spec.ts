import { startService, stopService, getServer } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { StoreDAO } from '@dao'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('no access control', () => {
  it('204', async () => {
    const server = getServer()
    const storeId = 'store-id'
    const itemId = 'item-id'
    await StoreDAO.setItem(storeId, itemId, 'text/plain', 'document')

    const res = await server.inject({
      method: 'HEAD'
    , url: `/store/${storeId}/items/${itemId}`
    })

    expect(res.statusCode).toBe(204)
  })
})
