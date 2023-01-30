import * as DAO from '@dao/data-in-sqlite3/store/get-item.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { setRawItem } from './utils.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('getItem(namespace: string, id: string): IItem | null', () => {
  describe('it exists', () => {
    it('return IItem', () => {
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

      const result = DAO.getItem(namespace, id)

      expect(result).toStrictEqual(item)
    })
  })

  describe('it does not exist', () => {
    it('return null', () => {
      const namespace = 'test'
      const id = 'id-1'

      const result = DAO.getItem(namespace, id)

      expect(result).toBeNull()
    })
  })
})
