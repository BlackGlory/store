import { StoreDAO } from '@dao/data/store/index.js'
import { NotFound, IncorrectRevision } from '@dao/data/store/error.js'
import { getError } from 'return-style'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { hasRawItem, setRawItem } from './utils.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('deleteItem(namespace: string, id: string): void', () => {
  describe('it exists', () => {
    it('return undefined', () => {
      const namespace = 'test'
      const id = 'id'
      setRawItem({
        namespace
      , id
      , payload: 'payload'
      , revision: 'revision'
      , type: 'application/json'
      })

      const result = StoreDAO.deleteItem(namespace, id)

      expect(result).toBeUndefined()
      expect(hasRawItem(namespace, id)).toBe(false)
    })
  })

  describe('it does not exist', () => {
    it('throw NotFound', () => {
      const namespace = 'test'
      const id = 'id'

      const err = getError(() => StoreDAO.deleteItem(namespace, id))

      expect(err).toBeInstanceOf(NotFound)
      expect(hasRawItem(namespace, id)).toBe(false)
    })
  })
})

describe('deleteItemWithCheck(namespace: string, id: string, revision: string): void', () => {
  describe('it exists', () => {
    describe('correct revision', () => {
      it('return undefined', () => {
        const namespace = 'test'
        const id = 'id'
        const revision = 'revision'
        setRawItem({
          namespace
        , id
        , revision
        , type: 'application/json'
        , payload: 'payload'
        })

        const result = StoreDAO.deleteItemWithCheck(namespace, id, revision)

        expect(result).toBeUndefined()
        expect(hasRawItem(namespace, id)).toBe(false)
      })
    })

    describe('incorrect revision', () => {
      it('throw IncorrectRevision', () => {
        const namespace = 'test'
        const id = 'id'
        setRawItem({
          namespace
        , id
        , revision: 'revision'
        , type: 'application/json'
        , payload: 'payload'
        })

        const result = getError(() => StoreDAO.deleteItemWithCheck(namespace, id, 'bad-revision'))

        expect(result).toBeInstanceOf(IncorrectRevision)
        expect(hasRawItem(namespace, id)).toBe(true)
      })
    })
  })

  describe('it does not exist', () => {
    it('throw NotFound', async () => {
      const namespace = 'test'
      const id = 'id'
      const revision = 'revision'

      const result = getError(() => StoreDAO.deleteItemWithCheck(namespace, id, revision))

      expect(result).toBeInstanceOf(NotFound)
      expect(hasRawItem(namespace, id)).toBe(false)
    })
  })
})
