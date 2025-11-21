import { startService, stopService, buildClient } from '@test/utils.js'
import { getErrorAsync } from 'return-style'
import { setRawItem, getRawItem } from './utils.js'
import { IncorrectRevision } from '@src/contract.js'

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

      const rawItem = getRawItem(namespace, id)
      expect(rawItem).not.toBeNull()
      expect(rawItem!.revision).toBe(result)
      expect(rawItem!.value).toStrictEqual(JSON.stringify(value))
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
      , value: JSON.stringify('value')
      })
      const newValue = 'new-value'

      const result = await client.setItem(namespace, id, newValue)

      expect(result).not.toBe(revision)
      const rawItem = getRawItem(namespace, id)
      expect(rawItem).toMatchObject({
        value: JSON.stringify(newValue)
      , revision: result
      })
    })
  })

  describe('with revision', () => {
    describe('item does not exist', () => {
      test('revision isnt null', async () => {
        const client = await buildClient()
        const namespace = 'test'
        const id = 'id-1'
        const value = 'value'
        const revision = 'revision'

        const err = await getErrorAsync(() => client.setItem(
          namespace
        , id
        , value
        , revision
        ))

        expect(err).toBeInstanceOf(IncorrectRevision)
      })

      test('revision is null', async () => {
        const client = await buildClient()
        const namespace = 'test'
        const id = 'id-1'
        const value = 'value'
        const revision = null

        const newRevision = await client.setItem(
          namespace
        , id
        , value
        , revision
        )

        expect(newRevision).not.toBe(revision)
        const rawItem = getRawItem(namespace, id)
        expect(rawItem).toMatchObject({
          value: JSON.stringify(value)
        , revision: newRevision
        })
      })
    })

    describe('item exists', () => {
      test('revision is null', async () => {
        const client = await buildClient()
        const namespace = 'test'
        const id = 'id'
        setRawItem({
          namespace
        , id
        , revision: 'revision'
        , value: JSON.stringify('value')
        })
        const newValue = 'new-value'

        const err = await getErrorAsync(
          () => client.setItem(namespace, id, newValue, null)
        )

        expect(err).toBeInstanceOf(IncorrectRevision)
        const rawItem = getRawItem(namespace, id)
        expect(rawItem).toEqual({
          namespace
        , id
        , revision: 'revision'
        , value: JSON.stringify('value')
        })
      })

      describe('revision isnt null', () => {
        describe('revision is correct', () => {
          test('general', async () => {
            const client = await buildClient()
            const namespace = 'test'
            const id = 'id'
            const revision = 'revision'
            const newValue = 'new-value'
            setRawItem({
              namespace
            , id
            , revision: revision
            , value: JSON.stringify('value')
            })

            const newRevision = await client.setItem(namespace, id, newValue, revision)

            expect(newRevision).not.toBe(revision)
            const rawItem = getRawItem(namespace, id)
            expect(rawItem).toMatchObject({
              value: JSON.stringify(newValue)
            , revision: newRevision
            })
          })

          test('edge: same value', async () => {
            const client = await buildClient()
            const namespace = 'test'
            const id = 'id'
            const revision = 'revision'
            const value = 'value'
            setRawItem({
              namespace
            , id
            , revision: revision
            , value: JSON.stringify(value)
            })

            const newRevision = await client.setItem(namespace, id, value, revision)

            expect(newRevision).not.toBe(revision)
            const rawItem = getRawItem(namespace, id)
            expect(rawItem).toMatchObject({
              value: JSON.stringify(value)
            , revision: newRevision
            })
          })
        })

        test('revison isnt correct', async () => {
          const client = await buildClient()
          const namespace = 'test'
          const id = 'id'
          setRawItem({
            namespace
          , id
          , revision: 'revision'
          , value: JSON.stringify('value')
          })
          const newValue = 'new-value'

          const err = await getErrorAsync(
            () => client.setItem(namespace, id, newValue, 'bad-revision')
          )

          expect(err).toBeInstanceOf(IncorrectRevision)
          const rawItem = getRawItem(namespace, id)
          expect(rawItem).toEqual({
            namespace
          , id
          , revision: 'revision'
          , value: JSON.stringify('value')
          })
        })
      })
    })
  })
})
