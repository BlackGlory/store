import * as DAO from '@dao/data-in-sqlite3/store/get-all-store-ids'
import { toArray } from 'iterable-operator'
import { setRawItem } from './utils'
import { initializeDatabases, clearDatabases } from '@test/utils'
import '@blackglory/jest-matchers'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('getAllStoreIds(): Iterable<string>', () => {
  describe('empty', () => {
    it('return Iterable<string>', () => {
      const iter = DAO.getAllStoreIds()
      const result = toArray(iter)

      expect(iter).toBeIterable()
      expect(result).toStrictEqual([])
    })
  })

  describe('not empty', () => {
    it('return Iterable<string>', () => {
      const storeId = 'store-id'
      const itemId = 'item-1'
      setRawItem({
        store_id: storeId
      , item_id: itemId
      , type: 'text/plain'
      , payload: 'payload-1'
      , revision: 'revision-1'
      })

      const iter = DAO.getAllStoreIds()
      const result = toArray(iter)

      expect(iter).toBeIterable()
      expect(result).toStrictEqual([storeId])
    })
  })
})
