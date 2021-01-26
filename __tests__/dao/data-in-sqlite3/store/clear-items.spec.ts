import * as DAO from '@dao/data-in-sqlite3/store/clear-items'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { hasRawItem, setRawItem } from './utils'
import '@blackglory/jest-matchers'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('clearItems(storeId: string): void', () => {
  describe('empty', () => {
    it('return undefined', () => {
      const storeId1 = 'store-id1'
      const storeId2 = 'store-id2'
      const itemId = 'item-id'
      setRawItem({
        store_id: storeId2
      , item_id: itemId
      , payload: 'payload'
      , rev: 'rev'
      , type: 'text/plain'
      })

      const result = DAO.clearItems(storeId1)

      expect(result).toBeUndefined()
      expect(hasRawItem(storeId2, itemId)).toBeTrue()
    })
  })

  describe('not empty', () => {
    it('return undefined', () => {
      const storeId1 = 'store-id1'
      const storeId2 = 'store-id2'
      const itemId = 'item-id'
      setRawItem({
        store_id: storeId1
      , item_id: itemId
      , payload: 'payload'
      , rev: 'rev'
      , type: 'text/plain'
      })
      setRawItem({
        store_id: storeId2
      , item_id: itemId
      , payload: 'payload'
      , rev: 'rev'
      , type: 'text/plain'
      })

      const result = DAO.clearItems(storeId1)

      expect(result).toBeUndefined()
      expect(hasRawItem(storeId1, itemId)).toBeFalse()
      expect(hasRawItem(storeId2, itemId)).toBeTrue()
    })
  })
})
