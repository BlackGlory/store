import { updateItem, updateItemWithCheck } from '@dao/store/update-item'
import { NotFound, IncorrectHash } from '@dao/store/error'
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

describe('updateItem(namespace: string, id: string, doc: string): Promise<Hash>', () => {
  describe('it exists', () => {
    it('update item and return new hash', async () => {
      const namespace = 'test'
      const id = 'id'
      const item: IItem = {
        meta: { hash: 'hash' }
      , doc: { message: 'message' }
      }
      const newDoc: IDocument = { message: 'updated' }
      set(namespace, id, item)

      const result = updateItem(namespace, id, newDoc)
      const proResult = await result
      const updatedItem = await get(namespace, id)

      expect(result).toBePromise()
      expect(proResult).toBeString()
      expect(proResult).not.toBe(item.meta.hash)
      expect(updatedItem.doc).toStrictEqual(newDoc)
      expect(updatedItem.meta.hash).toBe(proResult)
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

describe('updateItemWithCheck(namespace: string, id: string, hash: string, doc: string): Promise<Hash>', () => {
  describe('it exists', () => {
    describe('correct hash', () => {
      it('update item and return new hash', async () => {
        const namespace = 'test'
        const id = 'id'
        const hash = 'hash'
        const item: IItem = {
          meta: { hash }
        , doc: { message: 'message' }
        }
        const newDoc: IDocument = { message: 'updated' }
        set(namespace, id, item)

        const result = updateItemWithCheck(namespace, id, hash, newDoc)
        const proResult = await result
        const updatedItem = await get(namespace, id)

        expect(result).toBePromise()
        expect(proResult).toBeString()
        expect(proResult).not.toBe(item.meta.hash)
        expect(updatedItem.doc).toStrictEqual(newDoc)
        expect(updatedItem.meta.hash).toBe(proResult)
      })
    })

    describe('incorrect hash', () => {
      it('throw IncorrectHash', async () => {
        const namespace = 'test'
        const id = 'id'
        const item: IItem = {
          meta: { hash: 'hash' }
        , doc: { message: 'message' }
        }
        const newDoc: IDocument = { message: 'updated' }
        set(namespace, id, item)

        const result = updateItemWithCheck(namespace, id, 'bad-hash', newDoc)
        const proResult = await getErrorPromise(result)
        const existingItem = await get(namespace, id)

        expect(result).toBePromise()
        expect(proResult).toBeInstanceOf(IncorrectHash)
        expect(existingItem).toStrictEqual(item)
      })
    })
  })

  describe('it does not exist', () => {
    it('throw NotFound', async () => {
      const namespace = 'test'
      const id = 'id-1'
      const doc: IDocument = { message: 'updated' }
      const hash = 'hash'

      const result = updateItemWithCheck(namespace, id, hash, doc)
      const proResult = await getErrorPromise(result)

      expect(result).toBePromise()
      expect(proResult).toBeInstanceOf(NotFound)
    })
  })
})
