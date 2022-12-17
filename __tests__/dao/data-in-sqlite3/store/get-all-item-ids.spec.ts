import * as DAO from '@dao/data-in-sqlite3/store/get-all-item-ids'
import { toArray } from 'iterable-operator'
import { setRawItem } from './utils'
import { initializeDatabases, clearDatabases } from '@test/utils'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('getAllItemNamespaces(namespace: string): Iterable<string>', () => {
  describe('empty', () => {
    it('return Iterable<string>', () => {
      const namespace = 'namespace-'

      const iter = DAO.getAllItemIds(namespace)
      const result = toArray(iter)

      expect(result).toStrictEqual([])
    })
  })

  describe('not empty', () => {
    it('return Iterable<string>', () => {
      const namespace = 'namespace-'
      const itemId1 = 'item-1'
      const itemId2 = 'item-2'
      setRawItem({
        namespace
      , id: itemId1
      , type: 'text/plain'
      , payload: 'payload-1'
      , revision: 'revision-1'
      })
      setRawItem({
        namespace
      , id: itemId2
      , type: 'text/plain'
      , payload: 'payload-2'
      , revision: 'revision-2'
      })

      const iter = DAO.getAllItemIds(namespace)
      const result = toArray(iter)

      expect(result).toStrictEqual([itemId1, itemId2])
    })
  })
})
