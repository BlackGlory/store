import { setRawItem } from './utils.js'
import { startService, stopService, buildClient } from '@test/utils.js'

beforeEach(startService)
afterEach(stopService)

describe('stats', () => {
  test('empty', async () => {
    const client = await buildClient()
    const namespace = 'namespace'

    const result = await client.stats(namespace)

    expect(result).toEqual({
      namespace
    , items: 0
    })
  })

  test('not empty', async () => {
    const client = await buildClient()
    const namespace1 = 'namespace-1'
    const namespace2 = 'namespace-2'
    setRawItem({
      namespace: namespace1
    , id: 'item-1'
    , value: 'value-1'
    , revision: 'revision-1'
    })
    setRawItem({
      namespace: namespace1
    , id: 'item-2'
    , value: 'value-2'
    , revision: 'revision-2'
    })
    setRawItem({
      namespace: namespace2
    , id: 'item-1'
    , value: 'value-1'
    , revision: 'revision-1'
    })

    const result = await client.stats(namespace1)

    expect(result).toEqual({
      namespace: namespace1
    , items: 2
    })
  })
})
