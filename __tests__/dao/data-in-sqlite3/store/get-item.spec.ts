import * as DAO from '@dao/data-in-sqlite3/store/get-item'
import { initializeDatabases, clearDatabases } from '@test/utils'
import { setRawItem } from './utils'
import '@blackglory/jest-matchers'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('getItem(storeId: string, itemId: string): IItem | null', () => {
  describe('it exists', () => {
    it('return IItem', () => {
      const storeId = 'test'
      const itemId = 'itemId-1'
      const item: IItem = {
        revision: 'revision'
      , type: 'application/json'
      , payload: 'payload'
      }
      setRawItem({
        store_id: storeId
      , item_id: itemId
      , revision: item.revision
      , type: item.type
      , payload: item.payload
      })

      const result = DAO.getItem(storeId, itemId)

      expect(result).toStrictEqual(item)
    })
  })

  describe('it does not exist', () => {
    it('return null', () => {
      const storeId = 'test'
      const itemId = 'itemId-1'

      const result = DAO.getItem(storeId, itemId)

      expect(result).toBeNull()
    })
  })
})
