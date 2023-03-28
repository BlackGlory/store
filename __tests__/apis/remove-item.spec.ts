import { getErrorAsync } from 'return-style'
import { startService, stopService, buildClient } from '@test/utils.js'
import { hasRawItem, setRawItem } from './utils.js'
import { IncorrectRevision } from '@src/contract.js'

beforeEach(startService)
afterEach(stopService)

describe('deleteItem', () => {
  describe('without revision', () => {
    test('item exists', async () => {
      const client = await buildClient()
      const namespace = 'test'
      const id = 'id'
      setRawItem({
        namespace
      , id
      , value: JSON.stringify('value')
      , revision: 'revision'
      })

      await client.removeItem(namespace, id)

      expect(hasRawItem(namespace, id)).toBe(false)
    })

    test('item does not exist', async () => {
      const client = await buildClient()
      const namespace = 'test'
      const id = 'id'

      await client.removeItem(namespace, id)

      expect(hasRawItem(namespace, id)).toBe(false)
    })
  })

  describe('with revision', () => {
    describe('item exists', () => {
      test('revision is correct', async () => {
        const client = await buildClient()
        const namespace = 'test'
        const id = 'id'
        const revision = 'revision'
        setRawItem({
          namespace
        , id
        , revision
        , value: JSON.stringify('value')
        })

        await client.removeItem(namespace, id, revision)

        expect(hasRawItem(namespace, id)).toBe(false)
      })

      test('revision isnt correct', async () => {
        const client = await buildClient()
        const namespace = 'test'
        const id = 'id'
        setRawItem({
          namespace
        , id
        , revision: 'revision'
        , value: JSON.stringify('value')
        })

        const err = await getErrorAsync(
          () => client.removeItem(namespace, id, 'bad-revision')
        )

        expect(err).toBeInstanceOf(IncorrectRevision)
        expect(hasRawItem(namespace, id)).toBe(true)
      })
    })

    test('item does not exist', async () => {
      const client = await buildClient()
      const namespace = 'test'
      const id = 'id'
      const revision = 'revision'

      const err = await getErrorAsync(() => client.removeItem(
        namespace
      , id
      , revision
      ))

      expect(err).toBeInstanceOf(IncorrectRevision)
      expect(hasRawItem(namespace, id)).toBe(false)
    })
  })
})
