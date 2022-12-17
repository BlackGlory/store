import * as DAO from '@dao/data-in-sqlite3/store/delete-item'
import { NotFound, IncorrectRevision } from '@dao/data-in-sqlite3/store/error'
import { getError } from 'return-style'
import { initializeDatabases, clearDatabases } from '@test/utils'
import { hasRawItem, setRawItem } from './utils'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

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

      const result = DAO.deleteItem(namespace, id)

      expect(result).toBeUndefined()
      expect(hasRawItem(namespace, id)).toBe(false)
    })
  })

  describe('it does not exist', () => {
    it('throw NotFound', () => {
      const namespace = 'test'
      const id = 'id'

      const err = getError(() => DAO.deleteItem(namespace, id))

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

        const result = DAO.deleteItemWithCheck(namespace, id, revision)

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

        const result = getError(() => DAO.deleteItemWithCheck(namespace, id, 'bad-revision'))

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

      const result = getError(() => DAO.deleteItemWithCheck(namespace, id, revision))

      expect(result).toBeInstanceOf(NotFound)
      expect(hasRawItem(namespace, id)).toBe(false)
    })
  })
})
