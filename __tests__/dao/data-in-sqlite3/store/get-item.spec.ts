import * as DAO from '@dao/data-in-sqlite3/store/get-item'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { set } from './utils'
import '@blackglory/jest-matchers'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('getItem(storeId: string, itemId: string): IItem | null', () => {
  describe('it exists', () => {
    it('return IItem', () => {
      const storeId = 'test'
      const itemId = 'itemId-1'
      const item: IItem = {
        rev: 'rev'
      , type: 'application/json'
      , payload: 'payload'
      }
      set(storeId, itemId, item)

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
