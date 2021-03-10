import * as DAO from '@dao/config-in-sqlite3/access-control/blacklist'
import { initializeDatabases, clearDatabases } from '@test/utils'
import { hasRawBlacklist, setRawBlacklist } from './utils'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('blacklist', () => {
  describe('getAllBlacklistItems(): string[]', () => {
    it('return string[]', async () => {
      const id = 'id-1'
      setRawBlacklist({ store_id: id })

      const result = DAO.getAllBlacklistItems()

      expect(result).toEqual([id])
    })
  })

  describe('inBlacklist(id: string): boolean', () => {
    describe('exist', () => {
      it('return true', async () => {
        const id = 'id-1'
        setRawBlacklist({ store_id: id })

        const result = DAO.inBlacklist(id)

        expect(result).toBeTrue()
      })
    })

    describe('not exist', () => {
      it('return false', () => {
        const id = 'id-1'

        const result = DAO.inBlacklist(id)

        expect(result).toBeFalse()
      })
    })
  })

  describe('addBlacklistItem', () => {
    describe('exist', () => {
      it('return undefined', () => {
        const id = 'id-1'
        setRawBlacklist({ store_id: id })

        const result = DAO.addBlacklistItem(id)

        expect(result).toBeUndefined()
        expect(hasRawBlacklist(id)).toBeTrue()
      })
    })

    describe('not exist', () => {
      it('return undefined', () => {
        const id = 'id-1'

        const result = DAO.addBlacklistItem(id)

        expect(result).toBeUndefined()
        expect(hasRawBlacklist(id)).toBeTrue()
      })
    })
  })

  describe('removeBlacklistItem', () => {
    describe('exist', () => {
      it('return undefined', () => {
        const id = 'id-1'
        setRawBlacklist({ store_id: id })

        const result = DAO.removeBlacklistItem(id)

        expect(result).toBeUndefined()
        expect(hasRawBlacklist(id)).toBeFalse()
      })
    })

    describe('not exist', () => {
      it('return undefined', () => {
        const id = 'id-1'

        const result = DAO.removeBlacklistItem(id)

        expect(result).toBeUndefined()
        expect(hasRawBlacklist(id)).toBeFalse()
      })
    })
  })
})
