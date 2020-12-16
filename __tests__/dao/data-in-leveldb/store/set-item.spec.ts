import { setItem } from '@dao/data-in-leveldb/store/set-item'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { get } from './utils'
import '@blackglory/jest-matchers'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-leveldb/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('setItem(namespace: string, id: string, type: string, payload: string): Promise<Revision>', () => {
  it('set doc and return hash', async () => {
    const namespace = 'test'
    const id = 'id-1'
    const type = 'application/json'
    const payload = 'payload'

    const result = setItem(namespace, id, type, payload)
    const proResult = await result
    const item = await get(namespace, id)

    expect(result).toBePromise()
    expect(proResult).toBeString()
    expect(proResult).toBe(item.rev)
    expect(item.payload).toStrictEqual(payload)
  })
})
