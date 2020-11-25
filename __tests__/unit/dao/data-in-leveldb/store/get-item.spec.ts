import { getItem } from '@dao/data-in-leveldb/store/get-item'
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

describe('getItem(namespace: string, id: string): Promise<IItem | null>', () => {
  describe('it exists', () => {
    it('return IItem', async () => {
      const namespace = 'test'
      const id = 'id-1'
      const doc = { message: 'message' }
      await set(namespace, id, doc)

      const result = getItem(namespace, id)
      const proResult = await result

      expect(result).toBePromise()
      expect(proResult).toStrictEqual(doc)
    })
  })

  describe('it does not exist', () => {
    it('return null', async () => {
      const namespace = 'test'
      const id = 'id-1'

      const result = getItem(namespace, id)
      const proResult = await result

      expect(result).toBePromise()
      expect(proResult).toBeNull()
    })
  })
})