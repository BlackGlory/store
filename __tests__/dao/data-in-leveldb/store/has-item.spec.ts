import { hasItem } from '@dao/data-in-leveldb/store/has-item'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { set } from './utils'
import '@blackglory/jest-matchers'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-leveldb/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('hasItem(namespace: string, id: string): Promise<boolean>', () => {
  describe('it exists', () => {
    it('return true', async () => {
      const namespace = 'test'
      const id = 'id-1'
      const item: IItem = {
        rev: 'rev'
      , type: 'application/json'
      , payload: 'payload'
      }
      await set(namespace, id, item)

      const result = hasItem(namespace, id)
      const proResult = await result

      expect(result).toBePromise()
      expect(proResult).toBeTrue()
    })
  })

  describe('it does not exist', () => {
    it('return false', async () => {
      const namespace = 'test'
      const id = 'id-1'

      const result = hasItem(namespace, id)
      const proResult = await result

      expect(result).toBePromise()
      expect(proResult).toBeFalse()
    })
  })
})
