import { startService, stopService, getServer } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { prepareStores } from './utils'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('no access control', () => {
  it('200', async () => {
    const storeIds = ['store-id']
    const server = getServer()
    await prepareStores(storeIds)

    const res = await server.inject({
      method: 'GET'
    , url: '/store'
    })

    expect(res.statusCode).toBe(200)
    expect(res.json()).toStrictEqual(storeIds)
  })
})
