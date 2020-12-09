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

describe('updateItem(namespace: string, id: string, type: string, doc: string): Promise<Revision>', () => {
  describe('it exists', () => {
    it('update item and return new revision', async () => {
      const namespace = 'test'
      const id = 'id'
      const type = 'application/json'
      const item: IItem = {
        meta: {
          rev: 'revision'
        , type
        }
      , doc: { message: 'message' }
      }
      const newDoc: IDocument = { message: 'updated' }
      set(namespace, id, item)

      const result = updateItem(namespace, id, type, newDoc)
      const proResult = await result
      const updatedItem = await get(namespace, id)

      expect(result).toBePromise()
      expect(proResult).toBeString()
      expect(proResult).not.toBe(item.meta.rev)
      expect(updatedItem.doc).toStrictEqual(newDoc)
      expect(updatedItem.meta.rev).toBe(proResult)
    })
  })

  describe('it does not exist', () => {
    it('throw NotFound', async () => {
      const namespace = 'test'
      const id = 'id-1'
      const type = 'application/json'
      const doc: IDocument = { message: 'updated' }

      const result = updateItem(namespace, id, type, doc)
      const proResult = await getErrorPromise(result)

      expect(result).toBePromise()
      expect(proResult).toBeInstanceOf(NotFound)
    })
  })
})

describe('updateItemWithCheck(namespace: string, id: string, type: string, rev: string, doc: string): Promise<Revision>', () => {
  describe('it exists', () => {
    describe('correct revision', () => {
      it('update item and return new revision', async () => {
        const namespace = 'test'
        const id = 'id'
        const revision = 'revision'
        const type = 'application/json'
        const item: IItem = {
          meta: {
            rev: revision
          , type
          }
        , doc: { message: 'message' }
        }
        const newDoc: IDocument = { message: 'updated' }
        set(namespace, id, item)

        const result = updateItemWithCheck(namespace, id, type, revision, newDoc)
        const proResult = await result
        const updatedItem = await get(namespace, id)

        expect(result).toBePromise()
        expect(proResult).toBeString()
        expect(proResult).not.toBe(item.meta.rev)
        expect(updatedItem.doc).toStrictEqual(newDoc)
        expect(updatedItem.meta.rev).toBe(proResult)
      })
    })

    describe('incorrect revision', () => {
      it('throw IncorrectRevision', async () => {
        const namespace = 'test'
        const id = 'id'
        const type = 'application/json'
        const item: IItem = {
          meta: {
            rev: 'revision'
          , type: 'application/json'
          }
        , doc: { message: 'message' }
        }
        const newDoc: IDocument = { message: 'updated' }
        set(namespace, id, item)

        const result = updateItemWithCheck(namespace, id, type, 'bad-revision', newDoc)
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
      const doc: IDocument = { message: 'updated' }
      const revision = 'revision'

      const result = updateItemWithCheck(namespace, id, type, revision, doc)
      const proResult = await getErrorPromise(result)

      expect(result).toBePromise()
      expect(proResult).toBeInstanceOf(NotFound)
    })
  })
})
