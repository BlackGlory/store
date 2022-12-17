import * as DAO from '@dao/data-in-sqlite3/store/has-item'
import { initializeDatabases, clearDatabases } from '@test/utils'
import { setRawItem } from './utils'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('hasItem(namespace: string, id: string): boolean', () => {
  describe('it exists', () => {
    it('return true', () => {
      const namespace = 'test'
      const id = 'id-1'
      const item: IItem = {
        revision: 'revision'
      , type: 'application/json'
      , payload: 'payload'
      }
      setRawItem({
        namespace
      , id
      , revision: item.revision
      , type: item.type
      , payload: item.payload
      })

      const result = DAO.hasItem(namespace, id)

      expect(result).toBe(true)
    })
  })

  describe('it does not exist', () => {
    it('return false', () => {
      const namespace = 'test'
      const id = 'id-1'

      const result = DAO.hasItem(namespace, id)

      expect(result).toBe(false)
    })
  })
})
