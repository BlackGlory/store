import { setRawItem } from './utils.js'
import { startService, stopService, buildClient } from '@test/utils.js'

beforeEach(startService)
afterEach(stopService)

describe('getAllItemIds', () => {
  test('empty', async () => {
    const client = await buildClient()
    const namespace = 'namespace'

    const result = await client.getAllItemIds(namespace)

    expect(result).toStrictEqual([])
  })

  test('not empty', async () => {
    const client = await buildClient()
    const namespace = 'namespace'
    const itemId1 = 'item-1'
    const itemId2 = 'item-2'
    setRawItem({
      namespace
    , id: itemId1
    , value: JSON.stringify('value-1')
    , revision: 'revision-1'
    })
    setRawItem({
      namespace
    , id: itemId2
    , value: JSON.stringify('value-2')
    , revision: 'revision-2'
    })

    const result = await client.getAllItemIds(namespace)

    expect(result).toStrictEqual([itemId1, itemId2])
  })
})
