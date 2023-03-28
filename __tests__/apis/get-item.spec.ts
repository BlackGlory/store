import { IItem } from '@src/contract.js'
import { startService, stopService, buildClient } from '@test/utils.js'
import { setRawItem } from './utils.js'

beforeEach(startService)
afterEach(stopService)

describe('getItem', () => {
  test('item exists', async () => {
    const client = await buildClient()
    const namespace = 'test'
    const id = 'id-1'
    const item: IItem = {
      value: 'value'
    , revision: 'revision'
    }
    setRawItem({
      namespace
    , id
    , value: JSON.stringify(item.value)
    , revision: item.revision
    })

    const result = await client.getItem(namespace, id)

    expect(result).toStrictEqual(item)
  })

  test('item does not exist', async () => {
    const client = await buildClient()
    const namespace = 'test'
    const id = 'id-1'

    const result = await client.getItem(namespace, id)

    expect(result).toBeNull()
  })
})
