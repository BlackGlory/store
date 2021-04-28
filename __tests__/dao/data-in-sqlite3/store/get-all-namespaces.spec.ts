import * as DAO from '@dao/data-in-sqlite3/store/get-all-namespaces'
import { toArray } from 'iterable-operator'
import { setRawItem } from './utils'
import { initializeDatabases, clearDatabases } from '@test/utils'
import '@blackglory/jest-matchers'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('getAllNamespaces(): Iterable<string>', () => {
  describe('empty', () => {
    it('return Iterable<string>', () => {
      const iter = DAO.getAllNamespaces()
      const result = toArray(iter)

      expect(iter).toBeIterable()
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

      expect(iter).toBeIterable()
      expect(result).toStrictEqual([namespace])
    })
  })
})
