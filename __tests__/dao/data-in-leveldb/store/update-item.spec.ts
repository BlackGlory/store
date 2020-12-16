import { updateItem, updateItemWithCheck } from '@dao/data-in-leveldb/store/update-item'
import { NotFound, IncorrectRevision } from '@dao/data-in-leveldb/store/error'
import { resetDatabases, resetEnvironment } from '@test/utils'
import '@blackglory/jest-matchers'
import 'jest-extended'
import { getErrorPromise } from 'return-style'
import { get, set } from './utils'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-leveldb/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('updateItem(namespace: string, id: string, type: string, payload: string): Promise<Revision>', () => {
  describe('it exists', () => {
    it('update item and return new revision', async () => {
      const namespace = 'test'
      const id = 'id'
      const type = 'application/json'
      const item: IItem = {
        rev: 'revision'
      , type
      , payload: 'payload'
      }
      const newPayload = 'new-payload'
      set(namespace, id, item)

      const result = updateItem(namespace, id, type, newPayload)
      const proResult = await result
      const updatedItem = await get(namespace, id)

      expect(result).toBePromise()
      expect(proResult).toBeString()
      expect(proResult).not.toBe(item.rev)
      expect(updatedItem.payload).toStrictEqual(newPayload)
      expect(updatedItem.rev).toBe(proResult)
    })
  })

  describe('it does not exist', () => {
    it('throw NotFound', async () => {
      const namespace = 'test'
      const id = 'id-1'
      const type = 'application/json'
      const payload = 'payload'

      const result = updateItem(namespace, id, type, payload)
      const proResult = await getErrorPromise(result)

      expect(result).toBePromise()
      expect(proResult).toBeInstanceOf(NotFound)
    })
  })
})

describe('updateItemWithCheck(namespace: string, id: string, type: string, rev: string, payload: string): Promise<Revision>', () => {
  describe('it exists', () => {
    describe('correct revision', () => {
      it('update item and return new revision', async () => {
        const namespace = 'test'
        const id = 'id'
        const revision = 'revision'
        const type = 'application/json'
        const item: IItem = {
          rev: revision
        , type
        , payload: 'payload'
        }
        const newPayload = 'new-payload'
        set(namespace, id, item)

        const result = updateItemWithCheck(namespace, id, type, revision, newPayload)
        const proResult = await result
        const updatedItem = await get(namespace, id)

        expect(result).toBePromise()
        expect(proResult).toBeString()
        expect(proResult).not.toBe(item.rev)
        expect(updatedItem.payload).toStrictEqual(newPayload)
        expect(updatedItem.rev).toBe(proResult)
      })
    })

    describe('incorrect revision', () => {
      it('throw IncorrectRevision', async () => {
        const namespace = 'test'
        const id = 'id'
        const type = 'application/json'
        const item: IItem = {
          rev: 'revision'
        , type: 'application/json'
        , payload: 'payload'
        }
        const newPayload = 'new-payload'
        set(namespace, id, item)

        const result = updateItemWithCheck(namespace, id, type, 'bad-revision', newPayload)
        const proResult = await getErrorPromise(result)
        const existingItem = await get(namespace, id)

        expect(result).toBePromise()
        expect(proResult).toBeInstanceOf(IncorrectRevision)
        expect(existingItem).toStrictEqual(item)
      })
    })
  })

  describe('it does not exist', () => {
    it('throw NotFound', async () => {
      const namespace = 'test'
      const id = 'id-1'
      const type = 'application/json'
      const payload = 'payload'
      const revision = 'revision'

      const result = updateItemWithCheck(namespace, id, type, revision, payload)
      const proResult = await getErrorPromise(result)

      expect(result).toBePromise()
      expect(proResult).toBeInstanceOf(NotFound)
    })
  })
})
