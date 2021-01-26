import * as DAO from '@dao/data-in-sqlite3/store/update-item'
import { NotFound, IncorrectRevision } from '@dao/data-in-sqlite3/store/error'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { getError } from 'return-style'
import { getRawItem, setRawItem } from './utils'
import '@blackglory/jest-matchers'
import 'jest-extended'

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
      const rev = 'revision'
      setRawItem({
        store_id: storeId
      , item_id: itemId
      , rev
      , type
      , payload: 'payload'
      })
      const newPayload = 'new-payload'

      const result = DAO.updateItem(storeId, itemId, type, newPayload)
      const updatedItem = getRawItem(storeId, itemId)

      expect(result).toBeString()
      expect(result).not.toBe(rev)
      expect(updatedItem).not.toBeNull()
      expect(updatedItem!.payload).toBe(newPayload)
      expect(updatedItem!.rev).toBe(result)
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
        const newPayload = 'new-payload'
        setRawItem({
          store_id: storeId
        , item_id: itemId
        , rev: revision
        , type
        , payload: 'payload'
        })

        const result = DAO.updateItemWithCheck(storeId, itemId, type, revision, newPayload)
        const updatedItem = getRawItem(storeId, itemId)

        expect(result).toBeString()
        expect(result).not.toBe(revision)
        expect(updatedItem).not.toBeNull()
        expect(updatedItem!.payload).toBe(newPayload)
        expect(updatedItem!.rev).toBe(result)
      })
    })

    describe('incorrect revision', () => {
      it('throw IncorrectRevision', () => {
        const storeId = 'test'
        const itemId = 'itemId'
        const type = 'application/json'
        const rawItem = {
          store_id: storeId
        , item_id: itemId
        , rev: 'revision'
        , type
        , payload: 'payload'
        }
        setRawItem(rawItem)
        const newPayload = 'new-payload'

        const result = getError(
          () => DAO.updateItemWithCheck(storeId, itemId, type, 'bad-revision', newPayload)
        )
        const existingItem = getRawItem(storeId, itemId)

        expect(result).toBeInstanceOf(IncorrectRevision)
        expect(existingItem).toEqual(rawItem)
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
