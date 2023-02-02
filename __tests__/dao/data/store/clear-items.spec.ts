import { StoreDAO } from '@dao/data/store/index.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { hasRawItem, setRawItem } from './utils.js'

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

      const result = StoreDAO.clearItems(namesapce1)

      expect(result).toBeUndefined()
      expect(hasRawItem(namesapce2, id)).toBe(true)
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

      const result = StoreDAO.clearItems(namesapce1)

      expect(result).toBeUndefined()
      expect(hasRawItem(namesapce1, id)).toBe(false)
      expect(hasRawItem(namesapce2, id)).toBe(true)
    })
  })
})
