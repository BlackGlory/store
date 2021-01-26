import * as DAO from '@dao/data-in-sqlite3/store/has-item'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { setRawItem } from './utils'
import '@blackglory/jest-matchers'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('hasItem(storeId: string, itemId: string): boolean', () => {
  describe('it exists', () => {
    it('return true', () => {
      const storeId = 'test'
      const itemId = 'itemId-1'
      const item: IItem = {
        rev: 'rev'
      , type: 'application/json'
      , payload: 'payload'
      }
      setRawItem({
        store_id: storeId
      , item_id: itemId
      , rev: item.rev
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
