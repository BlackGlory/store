import { StoreDAO } from '@dao/data/store/index.js'
import { setRawItem } from './utils.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('stats(): IInfo', () => {
  describe('empty', () => {
    it('return IInfo', () => {
      const namespace = 'namespace'

      const result = StoreDAO.stats(namespace)

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

      const result = StoreDAO.stats(namespace1)

      expect(result).toEqual({
        namespace: namespace1
      , items: 2
      })
    })
  })
})
