import { StoreDAO } from '@dao/data/store/index.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { getRawItem } from './utils.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('setItem(namespace: string, id: string, type: string, payload: string): IRevision', () => {
  it('set doc and return hash', () => {
    const namespace = 'test'
    const id = 'id-1'
    const type = 'application/json'
    const payload = 'payload'

    const result = StoreDAO.setItem(namespace, id, type, payload)
    const item = getRawItem(namespace, id)

    expect(item).not.toBeNull()
    expect(item!.revision).toBe(result)
    expect(item!.payload).toStrictEqual(payload)
  })
})
