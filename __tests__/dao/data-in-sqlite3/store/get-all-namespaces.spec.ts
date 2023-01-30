import * as DAO from '@dao/data-in-sqlite3/store/get-all-namespaces.js'
import { toArray } from 'iterable-operator'
import { setRawItem } from './utils.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('getAllNamespaces(): Iterable<string>', () => {
  describe('empty', () => {
    it('return Iterable<string>', () => {
      const iter = DAO.getAllNamespaces()
      const result = toArray(iter)

      expect(result).toStrictEqual([])
    })
  })

  describe('not empty', () => {
    it('return Iterable<string>', () => {
      const namespace = 'namespace-'
      const id = 'item-1'
      setRawItem({
        namespace
      , id
      , type: 'text/plain'
      , payload: 'payload-1'
      , revision: 'revision-1'
      })

      const iter = DAO.getAllNamespaces()
      const result = toArray(iter)

      expect(result).toStrictEqual([namespace])
    })
  })
})
