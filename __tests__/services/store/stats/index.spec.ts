import { startService, stopService, getServer } from '@test/utils'
import { matchers } from 'jest-json-schema'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('no access control', () => {
  it('200', async () => {
    const storeId = 'store-id'
    const server = getServer()

    const res = await server.inject({
      method: 'GET'
    , url: `/store/${storeId}/stats`
    })

    expect(res.statusCode).toBe(200)
  })
})
