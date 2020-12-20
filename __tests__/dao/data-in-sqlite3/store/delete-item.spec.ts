import * as DAO from '@dao/data-in-sqlite3/store/delete-item'
import { NotFound, IncorrectRevision } from '@dao/data-in-sqlite3/store/error'
import { getError } from 'return-style'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { set, has } from './utils'
import '@blackglory/jest-matchers'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('deleteItem(storeId: string, itemId: string): void', () => {
  describe('it exists', () => {
    it('return undefined', () => {
      const storeId = 'test'
      const itemId = 'itemId'
      const item: IItem = {
        rev: 'rev'
      , type: 'application/json'
      , payload: 'payload'
      }
      set(storeId, itemId, item)

      const result = DAO.deleteItem(storeId, itemId)
      const isExist = has(storeId, itemId)

      expect(result).toBeUndefined()
      expect(isExist).toBeFalsy()
    })
  })

  describe('it does not exist', () => {
    it('throw NotFound', () => {
      const storeId = 'test'
      const itemId = 'itemId'

      const err = getError(() => DAO.deleteItem(storeId, itemId))
      const isExist = has(storeId, itemId)

      expect(err).toBeInstanceOf(NotFound)
      expect(isExist).toBeFalsy()
    })
  })
})

describe('deleteItemWithCheck(storeId: string, itemId: string, rev: string): void', () => {
  describe('it exists', () => {
    describe('correct rev', () => {
      it('return undefined', () => {
        const storeId = 'test'
        const itemId = 'itemId'
        const item: IItem = {
          rev: 'rev'
        , type: 'application/json'
        , payload: 'payload'
        }
        set(storeId, itemId, item)

        const result = DAO.deleteItemWithCheck(storeId, itemId, item.rev)
        const isExist = has(storeId, itemId)

        expect(result).toBeUndefined()
        expect(isExist).toBeFalsy()
      })
    })

    describe('incorrect rev', () => {
      it('throw IncorrectRevision', () => {
        const storeId = 'test'
        const itemId = 'itemId'
        const item: IItem = {
          rev: 'rev'
        , type: 'application/json'
        , payload: 'payload'
        }
        set(storeId, itemId, item)

        const result = getError(() => DAO.deleteItemWithCheck(storeId, itemId, 'bad-rev'))
        const isExist = has(storeId, itemId)

        expect(result).toBeInstanceOf(IncorrectRevision)
        expect(isExist).toBeTruthy()
      })
    })
  })

  describe('it does not exist', () => {
    it('throw NotFound', async () => {
      const storeId = 'test'
      const itemId = 'itemId'
      const rev = 'rev'

      const result = getError(() => DAO.deleteItemWithCheck(storeId, itemId, rev))
      const isExist = has(storeId, itemId)

      expect(result).toBeInstanceOf(NotFound)
      expect(isExist).toBeFalsy()
    })
  })
})
