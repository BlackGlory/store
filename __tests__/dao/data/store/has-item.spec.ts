import { StoreDAO } from '@dao/data/store/index.js'
import { IItem } from '@api/contract.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { setRawItem } from './utils.js'

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

      const result = StoreDAO.hasItem(namespace, id)

      expect(result).toBe(true)
    })
  })

  describe('it does not exist', () => {
    it('return false', () => {
      const namespace = 'test'
      const id = 'id-1'

      const result = StoreDAO.hasItem(namespace, id)

      expect(result).toBe(false)
    })
  })
})
