import * as DAO from '@dao/data-in-sqlite3/store/info'
import { set } from './utils'
import { resetDatabases, resetEnvironment } from '@test/utils'
import '@blackglory/jest-matchers'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('info(): IInfo[]', () => {
  describe('empty', () => {
    it('return []', () => {
      const result = DAO.info()

      expect(result).toEqual([])
    })
  })

  describe('not empty', () => {
    it('return IInfo[]', () => {
      const storeId1 = 'store-1'
      const storeId2 = 'store-2'
      set(storeId1, 'item-1', { type: 'text/plain', payload: 'payload-1', rev: 'rev-1' })
      set(storeId1, 'item-2', { type: 'text/plain', payload: 'payload-2', rev: 'rev-2' })
      set(storeId2, 'item-1', { type: 'text/plain', payload: 'payload-1', rev: 'rev-1' })

      const result = DAO.info()

      expect(result).toEqual([
        { id: storeId1, items: 2 }
      , { id: storeId2, items: 1 }
      ])
    })
  })
})
