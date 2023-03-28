import { IItem } from '@src/contract.js'
import { startService, stopService, buildClient } from '@test/utils.js'
import { setRawItem } from './utils.js'

beforeEach(startService)
afterEach(stopService)

describe('hasItem', () => {
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

    const result = await client.hasItem(namespace, id)

    expect(result).toBe(true)
  })

  test('it does not exist', async () => {
    const client = await buildClient()
    const namespace = 'test'
    const id = 'id-1'

    const result = await client.hasItem(namespace, id)

    expect(result).toBe(false)
  })
})
