import * as DAO from '@dao/data-in-sqlite3/store/set-item'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { get } from './utils'
import '@blackglory/jest-matchers'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('setItem(storeId: string, itemId: string, type: string, payload: string): IRevision', () => {
  it('set doc and return hash', () => {
    const storeId = 'test'
    const itemId = 'itemId-1'
    const type = 'application/json'
    const payload = 'payload'

    const result = DAO.setItem(storeId, itemId, type, payload)
    const item = get(storeId, itemId)

    expect(result).toBeString()
    expect(result).toBe(item.rev)
    expect(item.payload).toStrictEqual(payload)
  })
})