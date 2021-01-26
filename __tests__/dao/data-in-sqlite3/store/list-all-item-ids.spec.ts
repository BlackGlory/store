import * as DAO from '@dao/data-in-sqlite3/store/list-all-item-ids'
import { toArray } from 'iterable-operator'
import { setRawItem } from './utils'
import { resetDatabases, resetEnvironment } from '@test/utils'
import '@blackglory/jest-matchers'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('listAllItemIds(storeId: string): Iterable<string>', () => {
  describe('empty', () => {
    it('return Iterable<string>', () => {
      const storeId = 'store-id'

      const iter = DAO.listAllItemIds(storeId)
      const result = toArray(iter)

      expect(iter).toBeIterable()
      expect(result).toStrictEqual([])
    })
  })

  describe('not empty', () => {
    it('return Iterable<string>', () => {
      const storeId = 'store-id'
      const itemId1 = 'item-1'
      const itemId2 = 'item-2'
      setRawItem({
        store_id: storeId
      , item_id: itemId1
      , type: 'text/plain'
      , payload: 'payload-1'
      , rev: 'rev-1'
      })
      setRawItem({
        store_id: storeId
      , item_id: itemId2
      , type: 'text/plain'
      , payload: 'payload-2'
      , rev: 'rev-2'
      })

      const iter = DAO.listAllItemIds(storeId)
      const result = toArray(iter)

      expect(iter).toBeIterable()
      expect(result).toStrictEqual([itemId1, itemId2])
    })
  })
})
