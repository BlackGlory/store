import * as DAO from '@dao/data-in-sqlite3/store/delete-item'
import { NotFound, IncorrectRevision } from '@dao/data-in-sqlite3/store/error'
import { getError } from 'return-style'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { hasRawItem, setRawItem } from './utils'
import '@blackglory/jest-matchers'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('deleteItem(storeId: string, itemId: string): void', () => {
  describe('it exists', () => {
    it('return undefined', () => {
      const storeId = 'test'
      const itemId = 'itemId'
      setRawItem({
        store_id: storeId
      , item_id: itemId
      , payload: 'payload'
      , revision: 'revision'
      , type: 'application/json'
      })

      const result = DAO.deleteItem(storeId, itemId)

      expect(result).toBeUndefined()
      expect(hasRawItem(storeId, itemId)).toBeFalse()
    })
  })

  describe('it does not exist', () => {
    it('throw NotFound', () => {
      const storeId = 'test'
      const itemId = 'itemId'

      const err = getError(() => DAO.deleteItem(storeId, itemId))

      expect(err).toBeInstanceOf(NotFound)
      expect(hasRawItem(storeId, itemId)).toBeFalse()
    })
  })
})

describe('deleteItemWithCheck(storeId: string, itemId: string, revision: string): void', () => {
  describe('it exists', () => {
    describe('correct revision', () => {
      it('return undefined', () => {
        const storeId = 'test'
        const itemId = 'itemId'
        const revision = 'revision'
        setRawItem({
          store_id: storeId
        , item_id: itemId
        , revision
        , type: 'application/json'
        , payload: 'payload'
        })

        const result = DAO.deleteItemWithCheck(storeId, itemId, revision)

        expect(result).toBeUndefined()
        expect(hasRawItem(storeId, itemId)).toBeFalse()
      })
    })

    describe('incorrect revision', () => {
      it('throw IncorrectRevision', () => {
        const storeId = 'test'
        const itemId = 'itemId'
        setRawItem({
          store_id: storeId
        , item_id: itemId
        , revision: 'revision'
        , type: 'application/json'
        , payload: 'payload'
        })

        const result = getError(() => DAO.deleteItemWithCheck(storeId, itemId, 'bad-revision'))

        expect(result).toBeInstanceOf(IncorrectRevision)
        expect(hasRawItem(storeId, itemId)).toBeTrue()
      })
    })
  })

  describe('it does not exist', () => {
    it('throw NotFound', async () => {
      const storeId = 'test'
      const itemId = 'itemId'
      const revision = 'revision'

      const result = getError(() => DAO.deleteItemWithCheck(storeId, itemId, revision))

      expect(result).toBeInstanceOf(NotFound)
      expect(hasRawItem(storeId, itemId)).toBeFalse()
    })
  })
})
