import * as DAO from '@dao/data-in-sqlite3/store/clear-items'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { set, has } from './utils'
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
      const storeId = 'test'

      const result = DAO.clearItems(storeId)

      expect(result).toBeUndefined()
    })
  })

  describe('not empty', () => {
    it('return undefined', () => {
      const storeId = 'test'
      const itemId = 'itemId'
      const item: IItem = {
        rev: 'rev'
      , type: 'application/json'
      , payload: 'payload'
      }
      set(storeId, itemId, item)

      const result = DAO.clearItems(storeId)
      const isExist = has(storeId, itemId)

      expect(result).toBeUndefined()
      expect(isExist).toBeFalsy()
    })
  })
})
