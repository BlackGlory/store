import * as DAO from '@dao/data-in-sqlite3/store/stats'
import { setRawItem } from './utils'
import { initializeDatabases, clearDatabases } from '@test/utils'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('stats(): IInfo', () => {
  describe('empty', () => {
    it('return IInfo', () => {
      const namespace = 'namespace'

      const result = DAO.stats(namespace)

      expect(result).toEqual({
        namespace
      , items: 0
      })
    })
  })

  describe('not empty', () => {
    it('return IInfo', () => {
      const namespace1 = 'namespace-1'
      const namespace2 = 'namespace-2'
      setRawItem({
        namespace: namespace1
      , id: 'item-1'
      , type: 'text/plain'
      , payload: 'payload-1'
      , revision: 'revision-1'
      })
      setRawItem({
        namespace: namespace1
      , id: 'item-2'
      , type: 'text/plain'
      , payload: 'payload-2'
      , revision: 'revision-2'
      })
      setRawItem({
        namespace: namespace2
      , id: 'item-1'
      , type: 'text/plain'
      , payload: 'payload-1'
      , revision: 'revision-1'
      })

      const result = DAO.stats(namespace1)

      expect(result).toEqual({
        namespace: namespace1
      , items: 2
      })
    })
  })
})
