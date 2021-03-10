import * as DAO from '@dao/data-in-sqlite3/store/has-item'
import { initializeDatabases, clearDatabases } from '@test/utils'
import { setRawItem } from './utils'
import '@blackglory/jest-matchers'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('hasItem(storeId: string, itemId: string): boolean', () => {
  describe('it exists', () => {
    it('return true', () => {
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

      const result = DAO.hasItem(storeId, itemId)

      expect(result).toBeTrue()
    })
  })

  describe('it does not exist', () => {
    it('return false', () => {
      const storeId = 'test'
      const itemId = 'itemId-1'

      const result = DAO.hasItem(storeId, itemId)

      expect(result).toBeFalse()
    })
  })
})
