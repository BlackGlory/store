import * as DAO from '@dao/data-in-sqlite3/store/update-item'
import { NotFound, IncorrectRevision } from '@dao/data-in-sqlite3/store/error'
import { initializeDatabases, clearDatabases } from '@test/utils'
import { getError } from 'return-style'
import { getRawItem, setRawItem } from './utils'
import '@blackglory/jest-matchers'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('updateItem(namespace: string, id: string, type: string, payload: string): IRevision', () => {
  describe('it exists', () => {
    it('update item and return new revision', () => {
      const namespace = 'test'
      const id = 'id'
      const type = 'application/json'
      const revision = 'revision'
      setRawItem({
        namespace
      , id
      , revision
      , type
      , payload: 'payload'
      })
      const newPayload = 'new-payload'

      const result = DAO.updateItem(namespace, id, type, newPayload)
      const updatedItem = getRawItem(namespace, id)

      expect(result).toBeString()
      expect(result).not.toBe(revision)
      expect(updatedItem).toMatchObject({
        payload: newPayload
      , revision: result
      })
    })
  })

  describe('it does not exist', () => {
    it('throw NotFound', () => {
      const namespace = 'test'
      const id = 'id-1'
      const type = 'application/json'
      const payload = 'payload'

      const err = getError(() => DAO.updateItem(namespace, id, type, payload))

      expect(err).toBeInstanceOf(NotFound)
    })
  })
})

describe(`
  updateItemWithCheck(
    namespace: string
  , id: string
  , type: string
  , revision: string
  , payload: string
  ): IRevision
`, () => {
  describe('it exists', () => {
    describe('correct revision', () => {
      it('update item and return new revision', () => {
        const namespace = 'test'
        const id = 'id'
        const revision = 'revision'
        const type = 'application/json'
        const newPayload = 'new-payload'
        setRawItem({
          namespace
        , id
        , revision: revision
        , type
        , payload: 'payload'
        })

        const result = DAO.updateItemWithCheck(namespace, id, type, revision, newPayload)
        const updatedItem = getRawItem(namespace, id)

        expect(result).toBeString()
        expect(result).not.toBe(revision)
        expect(updatedItem).toMatchObject({
          payload: newPayload
        , revision: result
        })
      })
    })

    describe('incorrect revision', () => {
      it('throw IncorrectRevision', () => {
        const namespace = 'test'
        const id = 'id'
        const type = 'application/json'
        const rawItem = {
          namespace
        , id
        , revision: 'revision'
        , type
        , payload: 'payload'
        }
        setRawItem(rawItem)
        const newPayload = 'new-payload'

        const result = getError(
          () => DAO.updateItemWithCheck(namespace, id, type, 'bad-revision', newPayload)
        )
        const existingItem = getRawItem(namespace, id)

        expect(result).toBeInstanceOf(IncorrectRevision)
        expect(existingItem).toEqual(rawItem)
      })
    })
  })

  describe('it does not exist', () => {
    it('throw NotFound', () => {
      const namespace = 'test'
      const id = 'id-1'
      const type = 'application/json'
      const payload = 'payload'
      const revision = 'revision'

      const result = getError(() => DAO.updateItemWithCheck(namespace, id, type, revision, payload))

      expect(result).toBeInstanceOf(NotFound)
    })
  })
})
