import { updateItem, updateItemWithCheck } from '@dao/store/update-item'
import { NotFound, IncorrectRevision } from '@dao/store/error'
import { resetDatabases, resetEnvironment } from '@test/utils'
import '@blackglory/jest-matchers'
import 'jest-extended'
import { getErrorPromise } from 'return-style'
import { get, set } from './utils'

jest.mock('@dao/store/database')
jest.mock('@dao/json-schema/database')
jest.mock('@dao/access-control/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('updateItem(namespace: string, id: string, doc: string): Promise<Revision>', () => {
  describe('it exists', () => {
    it('update item and return new revision', async () => {
      const namespace = 'test'
      const id = 'id'
      const item: IItem = {
        meta: { rev: 'revision' }
      , doc: { message: 'message' }
      }
      const newDoc: IDocument = { message: 'updated' }
      set(namespace, id, item)

      const result = updateItem(namespace, id, newDoc)
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
      const doc: IDocument = { message: 'updated' }

      const result = updateItem(namespace, id, doc)
      const proResult = await getErrorPromise(result)

      expect(result).toBePromise()
      expect(proResult).toBeInstanceOf(NotFound)
    })
  })
})

describe('updateItemWithCheck(namespace: string, id: string, rev: string, doc: string): Promise<Revision>', () => {
  describe('it exists', () => {
    describe('correct revision', () => {
      it('update item and return new revision', async () => {
        const namespace = 'test'
        const id = 'id'
        const revision = 'revision'
        const item: IItem = {
          meta: { rev: revision }
        , doc: { message: 'message' }
        }
        const newDoc: IDocument = { message: 'updated' }
        set(namespace, id, item)

        const result = updateItemWithCheck(namespace, id, revision, newDoc)
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
        const item: IItem = {
          meta: { rev: 'revision' }
        , doc: { message: 'message' }
        }
        const newDoc: IDocument = { message: 'updated' }
        set(namespace, id, item)

        const result = updateItemWithCheck(namespace, id, 'bad-revision', newDoc)
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
      const doc: IDocument = { message: 'updated' }
      const revision = 'revision'

      const result = updateItemWithCheck(namespace, id, revision, doc)
      const proResult = await getErrorPromise(result)

      expect(result).toBePromise()
      expect(proResult).toBeInstanceOf(NotFound)
    })
  })
})
