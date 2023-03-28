import { setRawItem } from './utils.js'
import { startService, stopService, buildClient } from '@test/utils.js'

beforeEach(startService)
afterEach(stopService)

describe('getAllNamespaces', () => {
  test('empty', async () => {
    const client = await buildClient()

    const result = await client.getAllNamespaces()

    expect(result).toStrictEqual([])
  })

  test('not empty', async () => {
    const client = await buildClient()
    const namespace = 'namespace'
    const id = 'item-1'
    setRawItem({
      namespace
    , id
    , value: JSON.stringify('value-1')
    , revision: 'revision-1'
    })

    const result = await client.getAllNamespaces()

    expect(result).toStrictEqual([namespace])
  })
})
