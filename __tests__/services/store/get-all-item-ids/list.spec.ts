import { buildServer } from '@src/server'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('no access control', () => {
  it('200', async () => {
    const server = await buildServer()
    const storeId = 'store-id'

    const res = await server.inject({
      method: 'GET'
    , url: `/store/${storeId}/items`
    })

    expect(res.statusCode).toBe(200)
  })
})
