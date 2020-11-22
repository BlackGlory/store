import { setItem } from '@dao/store/set-item'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { get } from './utils'
import '@blackglory/jest-matchers'
import 'jest-extended'

jest.mock('@dao/store/database')
jest.mock('@dao/json-schema/database')
jest.mock('@dao/access-control/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('setItem(namespace: string, id: string, doc: IDocument): Promise<Revision>', () => {
  it('set doc and return hash', async () => {
    const namespace = 'test'
    const id = 'id-1'
    const doc = { message: 'message' }

    const result = setItem(namespace, id, doc)
    const proResult = await result
    const item = await get(namespace, id)

    expect(result).toBePromise()
    expect(proResult).toBeString()
    expect(proResult).toBe(item.meta.rev)
    expect(item.doc).toStrictEqual(doc)
  })
})
