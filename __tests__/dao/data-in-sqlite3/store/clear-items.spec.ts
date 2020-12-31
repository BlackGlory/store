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
      const storeId1 = 'store-id1'
      const storeId2 = 'store-id2'
      set(storeId2, 'item-id', { payload: 'payload', rev: 'rev', type: 'text/plain' })

      const result = DAO.clearItems(storeId1)

      expect(result).toBeUndefined()
    })
  })

  describe('not empty', () => {
    it('return undefined', () => {
      const storeId1 = 'store-id1'
      const storeId2 = 'store-id2'
      const itemId = 'item-id'
      set(storeId1, 'item-id', { payload: 'payload', rev: 'rev', type: 'text/plain' })
      set(storeId2, 'item-id', { payload: 'payload', rev: 'rev', type: 'text/plain' })

      const result = DAO.clearItems(storeId1)
      const isExist1 = has(storeId1, itemId)
      const isExist2 = has(storeId2, itemId)

      expect(result).toBeUndefined()
      expect(isExist1).toBeFalsy()
      expect(isExist2).toBeTruthy()
    })
  })
})
