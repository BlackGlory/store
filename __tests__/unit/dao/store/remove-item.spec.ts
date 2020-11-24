import { removeItem, removeItemWithCheck } from '@dao/store/remove-item'
import { NotFound, IncorrectRevision } from '@dao/store/error'
import { getErrorPromise } from 'return-style'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { set, has } from './utils'
import '@blackglory/jest-matchers'
import 'jest-extended'

jest.mock('@dao/store/database')
jest.mock('@dao/json-schema/database')
jest.mock('@dao/access-control/database')
jest.mock('@dao/revision-policy/database')

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
        meta: { rev: 'rev' }
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

describe('removeItemWithCheck(namespace: string, id: string, rev: string): Promise<void>', () => {
  describe('it exists', () => {
    describe('correct rev', () => {
      it('return undefined', async () => {
        const namespace = 'test'
        const id = 'id'
        const item: IItem = {
          meta: { rev: 'rev' }
        , doc: { message: 'message' }
        }
        await set(namespace, id, item)

        const result = removeItemWithCheck(namespace, id, item.meta.rev)
        const proResult = await result
        const isExist = await has(namespace, id)

        expect(result).toBePromise()
        expect(proResult).toBeUndefined()
        expect(isExist).toBeFalsy()
      })
    })

    describe('incorrect rev', () => {
      it('throw IncorrectRevision', async () => {
        const namespace = 'test'
        const id = 'id'
        const item: IItem = {
          meta: { rev: 'rev' }
        , doc: { message: 'message' }
        }
        await set(namespace, id, item)

        const result = removeItemWithCheck(namespace, id, 'bad-rev')
        const proResult = await getErrorPromise(result)
        const isExist = await has(namespace, id)

        expect(result).toBePromise()
        expect(proResult).toBeInstanceOf(IncorrectRevision)
        expect(isExist).toBeTruthy()
      })
    })
  })

  describe('it does not exist', () => {
    it('throw NotFound', async () => {
      const namespace = 'test'
      const id = 'id'
      const rev = 'hash'

      const result = removeItemWithCheck(namespace, id, rev)
      const proResult = await getErrorPromise(result)
      const isExist = await has(namespace, id)

      expect(result).toBePromise()
      expect(proResult).toBeInstanceOf(NotFound)
      expect(isExist).toBeFalsy()
    })
  })
})
