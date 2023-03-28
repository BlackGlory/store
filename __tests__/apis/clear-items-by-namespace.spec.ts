import { startService, stopService, buildClient } from '@test/utils.js'
import { hasRawItem, setRawItem } from './utils.js'

beforeEach(startService)
afterEach(stopService)

describe('clearItemsByNamespace', () => {
  test('empty', async () => {
    const client = await buildClient()
    const namesapce1 = 'namespace-1'
    const namesapce2 = 'namespace-2'
    const id = 'item-id'
    setRawItem({
      namespace: namesapce2
    , id
    , value: JSON.stringify('value')
    , revision: 'revision'
    })

    await client.clearItemsByNamespace(namesapce1)

    expect(hasRawItem(namesapce2, id)).toBe(true)
  })

  test('not empty', async () => {
    const client = await buildClient()
    const namesapce1 = 'namespace-1'
    const namesapce2 = 'namespace-2'
    const id = 'item-id'
    setRawItem({
      namespace: namesapce1
    , id
    , value: JSON.stringify('value')
    , revision: 'revision'
    })
    setRawItem({
      namespace: namesapce2
    , id
    , value: JSON.stringify('value')
    , revision: 'revision'
    })

    await client.clearItemsByNamespace(namesapce1)

    expect(hasRawItem(namesapce1, id)).toBe(false)
    expect(hasRawItem(namesapce2, id)).toBe(true)
  })
})
