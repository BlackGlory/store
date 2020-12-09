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

describe('setItem(namespace: string, id: string, type: string, doc: IDocument): Promise<Revision>', () => {
  it('set doc and return hash', async () => {
    const namespace = 'test'
    const id = 'id-1'
    const type = 'application/json'
    const doc = { message: 'message' }

    const result = setItem(namespace, id, type, doc)
    const proResult = await result
    const item = await get(namespace, id)

    expect(result).toBePromise()
    expect(proResult).toBeString()
    expect(proResult).toBe(item.meta.rev)
    expect(item.doc).toStrictEqual(doc)
  })
})
