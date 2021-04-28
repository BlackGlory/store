import * as DAO from '@dao/data-in-sqlite3/store/clear-items'
import { initializeDatabases, clearDatabases } from '@test/utils'
import { hasRawItem, setRawItem } from './utils'
import '@blackglory/jest-matchers'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('clearItems(namespace: string): void', () => {
  describe('empty', () => {
    it('return undefined', () => {
      const namesapce1 = 'namespace-1'
      const namesapce2 = 'namespace-2'
      const id = 'item-id'
      setRawItem({
        namespace: namesapce2
      , id
      , payload: 'payload'
      , revision: 'revision'
      , type: 'text/plain'
      })

      const result = DAO.clearItems(namesapce1)

      expect(result).toBeUndefined()
      expect(hasRawItem(namesapce2, id)).toBeTrue()
    })
  })

  describe('not empty', () => {
    it('return undefined', () => {
      const namesapce1 = 'namespace-1'
      const namesapce2 = 'namespace-2'
      const id = 'item-id'
      setRawItem({
        namespace: namesapce1
      , id
      , payload: 'payload'
      , revision: 'revision'
      , type: 'text/plain'
      })
      setRawItem({
        namespace: namesapce2
      , id
      , payload: 'payload'
      , revision: 'revision'
      , type: 'text/plain'
      })

      const result = DAO.clearItems(namesapce1)

      expect(result).toBeUndefined()
      expect(hasRawItem(namesapce1, id)).toBeFalse()
      expect(hasRawItem(namesapce2, id)).toBeTrue()
    })
  })
})
