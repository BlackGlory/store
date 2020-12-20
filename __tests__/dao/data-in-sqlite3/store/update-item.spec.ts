import * as DAO from '@dao/data-in-sqlite3/store/update-item'
import { NotFound, IncorrectRevision } from '@dao/data-in-sqlite3/store/error'
import { resetDatabases, resetEnvironment } from '@test/utils'
import '@blackglory/jest-matchers'
import 'jest-extended'
import { getError } from 'return-style'
import { get, set } from './utils'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('updateItem(storeId: string, itemId: string, type: string, payload: string): IRevision', () => {
  describe('it exists', () => {
    it('update item and return new revision', () => {
      const storeId = 'test'
      const itemId = 'itemId'
      const type = 'application/json'
      const item: IItem = {
        rev: 'revision'
      , type
      , payload: 'payload'
      }
      const newPayload = 'new-payload'
      set(storeId, itemId, item)

      const result = DAO.updateItem(storeId, itemId, type, newPayload)
      const updatedItem = get(storeId, itemId)

      expect(result).toBeString()
      expect(result).not.toBe(item.rev)
      expect(updatedItem.payload).toStrictEqual(newPayload)
      expect(updatedItem.rev).toBe(result)
    })
  })

  describe('it does not exist', () => {
    it('throw NotFound', () => {
      const storeId = 'test'
      const itemId = 'itemId-1'
      const type = 'application/json'
      const payload = 'payload'

      const err = getError(() => DAO.updateItem(storeId, itemId, type, payload))

      expect(err).toBeInstanceOf(NotFound)
    })
  })
})

describe('updateItemWithCheck(storeId: string, itemId: string, type: string, rev: string, payload: string): IRevision', () => {
  describe('it exists', () => {
    describe('correct revision', () => {
      it('update item and return new revision', () => {
        const storeId = 'test'
        const itemId = 'itemId'
        const revision = 'revision'
        const type = 'application/json'
        const item: IItem = {
          rev: revision
        , type
        , payload: 'payload'
        }
        const newPayload = 'new-payload'
        set(storeId, itemId, item)

        const result = DAO.updateItemWithCheck(storeId, itemId, type, revision, newPayload)
        const updatedItem = get(storeId, itemId)

        expect(result).toBeString()
        expect(result).not.toBe(item.rev)
        expect(updatedItem.payload).toStrictEqual(newPayload)
        expect(updatedItem.rev).toBe(result)
      })
    })

    describe('incorrect revision', () => {
      it('throw IncorrectRevision', () => {
        const storeId = 'test'
        const itemId = 'itemId'
        const type = 'application/json'
        const item: IItem = {
          rev: 'revision'
        , type: 'application/json'
        , payload: 'payload'
        }
        const newPayload = 'new-payload'
        set(storeId, itemId, item)

        const result = getError(() => DAO.updateItemWithCheck(storeId, itemId, type, 'bad-revision', newPayload))
        const existingItem = get(storeId, itemId)

        expect(result).toBeInstanceOf(IncorrectRevision)
        expect(existingItem).toStrictEqual(item)
      })
    })
  })

  describe('it does not exist', () => {
    it('throw NotFound', () => {
      const storeId = 'test'
      const itemId = 'itemId-1'
      const type = 'application/json'
      const payload = 'payload'
      const revision = 'revision'

      const result = getError(() => DAO.updateItemWithCheck(storeId, itemId, type, revision, payload))

      expect(result).toBeInstanceOf(NotFound)
    })
  })
})
