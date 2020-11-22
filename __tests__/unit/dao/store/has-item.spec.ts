import { hasItem } from '@dao/store/has-item'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { set } from './utils'
import '@blackglory/jest-matchers'
import 'jest-extended'

jest.mock('@dao/store/database')
jest.mock('@dao/json-schema/database')
jest.mock('@dao/access-control/database')

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
        meta: { rev: 'hash' }
      , doc: { message: 'message' }
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
