import * as DAO from '@dao/data-in-sqlite3/store/set-item'
import { initializeDatabases, clearDatabases } from '@test/utils'
import { getRawItem } from './utils'
import '@blackglory/jest-matchers'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('setItem(storeId: string, itemId: string, type: string, payload: string): IRevision', () => {
  it('set doc and return hash', () => {
    const storeId = 'test'
    const itemId = 'itemId-1'
    const type = 'application/json'
    const payload = 'payload'

    const result = DAO.setItem(storeId, itemId, type, payload)
    const item = getRawItem(storeId, itemId)

    expect(result).toBeString()
    expect(item).not.toBeNull()
    expect(item!.revision).toBe(result)
    expect(item!.payload).toStrictEqual(payload)
  })
})
