import { removeItem, removeItemWithCheck } from '@dao/store/remove-item'
import { NotFound, IncorrectHash } from '@dao/store/error'
import { getErrorPromise } from 'return-style'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { set, has } from './utils'
import '@blackglory/jest-matchers'
import 'jest-extended'

jest.mock('@dao/store/database')
jest.mock('@dao/json-schema/database')
jest.mock('@dao/access-control/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('removeItem(namespace: string, id: string): Promise<void>', () => {
  describe('it exists', () => {
    it('return undefined', async () => {
      const namespace = 'test'
      const id = 'id'
      const item: IItem = {
        meta: { hash: 'hash' }
      , doc: { message: 'message' }
      }
      await set(namespace, id, item)

      const result = removeItem(namespace, id)
      const proResult = await result
      const isExist = await has(namespace, id)

      expect(result).toBePromise()
      expect(proResult).toBeUndefined()
      expect(isExist).toBeFalsy()
    })
  })

  describe('it does not exist', () => {
    it('throw NotFound', async () => {
      const namespace = 'test'
      const id = 'id'

      const result = removeItem(namespace, id)
      const proResult = await getErrorPromise(result)
      const isExist = await has(namespace, id)

      expect(result).toBePromise()
      expect(proResult).toBeInstanceOf(NotFound)
      expect(isExist).toBeFalsy()
    })
  })
})

describe('removeItemWithCheck(namespace: string, id: string, hash: string): Promise<void>', () => {
  describe('it exists', () => {
    describe('correct hash', () => {
      it('return undefined', async () => {
        const namespace = 'test'
        const id = 'id'
        const item: IItem = {
          meta: { hash: 'hash' }
        , doc: { message: 'message' }
        }
        await set(namespace, id, item)

        const result = removeItemWithCheck(namespace, id, item.meta.hash)
        const proResult = await result
        const isExist = await has(namespace, id)

        expect(result).toBePromise()
        expect(proResult).toBeUndefined()
        expect(isExist).toBeFalsy()
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
        await set(namespace, id, item)

        const result = removeItemWithCheck(namespace, id, 'bad-hash')
        const proResult = await getErrorPromise(result)
        const isExist = await has(namespace, id)

        expect(result).toBePromise()
        expect(proResult).toBeInstanceOf(IncorrectHash)
        expect(isExist).toBeTruthy()
      })
    })
  })

  describe('it does not exist', () => {
    it('throw NotFound', async () => {
      const namespace = 'test'
      const id = 'id'
      const hash = 'hash'

      const result = removeItemWithCheck(namespace, id, hash)
      const proResult = await getErrorPromise(result)
      const isExist = await has(namespace, id)

      expect(result).toBePromise()
      expect(proResult).toBeInstanceOf(NotFound)
      expect(isExist).toBeFalsy()
    })
  })
})
