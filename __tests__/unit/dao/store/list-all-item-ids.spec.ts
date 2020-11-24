import { listAllItemIds } from '@dao/store/list-all-item-ids'
import { toArrayAsync } from 'iterable-operator'
import { set } from './utils'
import { resetDatabases, resetEnvironment } from '@test/utils'
import '@blackglory/jest-matchers'

jest.mock('@dao/store/database')
jest.mock('@dao/json-schema/database')
jest.mock('@dao/access-control/database')
jest.mock('@dao/revision-policy/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('listAllItemIds(namespace: string): NodeJS.ReadableStream', () => {
  describe('empty', () => {
    it('return NodeJS.ReadableStream', async () => {
      const namespace = 'namespace'

      const stream = listAllItemIds(namespace)
      const result = await toArrayAsync(stream)

      expect(stream).toBeNodeJSReadableStream()
      expect(result).toStrictEqual([])
    })
  })

  describe('not empty', () => {
    it('return NodeJS.ReadableStream', async () => {
      const namespace = 'namespace'
      const id1 = 'id-1'
      const id2 = 'id-2'
      set(namespace, id1, {})
      set(namespace, id2, {})

      const stream = listAllItemIds(namespace)
      const result = await toArrayAsync(stream)

      expect(stream).toBeNodeJSReadableStream()
      expect(result).toStrictEqual([id1, id2])
    })
  })
})
