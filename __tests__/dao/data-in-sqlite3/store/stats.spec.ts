import * as DAO from '@dao/data-in-sqlite3/store/stats'
import { setRawItem } from './utils'
import { resetDatabases, resetEnvironment } from '@test/utils'
import '@blackglory/jest-matchers'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('stats(): IInfo', () => {
  describe('empty', () => {
    it('return IInfo', () => {
      const storeId = 'store-1'

      const result = DAO.stats(storeId)

      expect(result).toEqual({
        id: storeId
      , items: 0
      })
    })
  })

  describe('not empty', () => {
    it('return IInfo', () => {
      const storeId1 = 'store-1'
      const storeId2 = 'store-2'
      setRawItem({
        store_id: storeId1
      , item_id: 'item-1'
      , type: 'text/plain'
      , payload: 'payload-1'
      , revision: 'revision-1'
      })
      setRawItem({
        store_id: storeId1
      , item_id: 'item-2'
      , type: 'text/plain'
      , payload: 'payload-2'
      , revision: 'revision-2'
      })
      setRawItem({
        store_id: storeId2
      , item_id: 'item-1'
      , type: 'text/plain'
      , payload: 'payload-1'
      , revision: 'revision-1'
      })

      const result = DAO.stats(storeId1)

      expect(result).toEqual({
        id: storeId1
      , items: 2
      })
    })
  })
})
