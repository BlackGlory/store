import { startService, stopService, buildClient } from '@test/utils.js'
import { getErrorAsync } from 'return-style'
import { setRawItem, getRawItem } from './utils.js'
import { IncorrectRevision } from '@src/errors.js'

beforeEach(startService)
afterEach(stopService)

describe('setItem', () => {
  describe('without revision', () => {
    test('item does not exist', async () => {
      const client = await buildClient()
      const namespace = 'test'
      const id = 'id-1'
      const value = 'value'

      const result = await client.setItem(namespace, id, value)

      const item = getRawItem(namespace, id)
      expect(item).not.toBeNull()
      expect(item!.revision).toBe(result)
      expect(item!.value).toStrictEqual(value)
    })

    test('item exists', async () => {
      const client = await buildClient()
      const namespace = 'test'
      const id = 'id'
      const revision = 'revision'
      setRawItem({
        namespace
      , id
      , revision
      , value: 'value'
      })
      const newValue = 'new-value'

      const result = await client.setItem(namespace, id, newValue)

      const item = getRawItem(namespace, id)
      expect(result).not.toBe(revision)
      expect(item).toMatchObject({
        value: newValue
      , revision: result
      })
    })
  })

  describe('with revision', () => {
    test('item does not exist', async () => {
      const client = await buildClient()
      const namespace = 'test'
      const id = 'id-1'
      const value = 'value'
      const revision = 'revision'

      const err = await getErrorAsync(() => client.setItem(namespace, id, value, revision))

      expect(err).toBeInstanceOf(IncorrectRevision)
    })

    describe('item exists', () => {
      test('revision is correct', async () => {
        const client = await buildClient()
        const namespace = 'test'
        const id = 'id'
        const revision = 'revision'
        const newValue = 'new-value'
        setRawItem({
          namespace
        , id
        , revision: revision
        , value: 'value'
        })

        const result = await client.setItem(namespace, id, newValue, revision)

        const item = getRawItem(namespace, id)
        expect(result).not.toBe(revision)
        expect(item).toMatchObject({
          value: newValue
        , revision: result
        })
      })

      test('revison isnt correct', async () => {
        const client = await buildClient()
        const namespace = 'test'
        const id = 'id'
        const rawItem = {
          namespace
        , id
        , revision: 'revision'
        , value: 'value'
        }
        setRawItem(rawItem)
        const newValue = 'new-value'

        const err = await getErrorAsync(
          () => client.setItem(namespace, id, newValue, 'bad-revision')
        )

        const item = getRawItem(namespace, id)
        expect(err).toBeInstanceOf(IncorrectRevision)
        expect(item).toEqual(rawItem)
      })
    })
  })
})
