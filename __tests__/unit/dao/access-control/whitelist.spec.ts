import * as DAO from '@dao/access-control/whitelist'
import { getDatabase } from '@dao/access-control/database'
import { Database } from 'better-sqlite3'
import { resetEnvironment, resetDatabases } from '@test/utils'
import 'jest-extended'

jest.mock('@dao/access-control/database')
jest.mock('@dao/json-schema/database')
jest.mock('@dao/store/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('whitelist', () => {
  describe('getAllWhitelistItems(): string[]', () => {
    it('return string[]', async () => {
      const db = getDatabase()
      const id = 'id-1'
      insert(db, id)

      const result = DAO.getAllWhitelistItems()

      // expect.toStrictEqual is broken, I have no idea
      expect(result).toEqual([id])
    })
  })

  describe('inWhitelist(id: string): boolean', () => {
    describe('exist', () => {
      it('return true', async () => {
        const db = getDatabase()
        const id = 'id-1'
        insert(db, id)

        const result = DAO.inWhitelist(id)

        expect(result).toBeTrue()
      })
    })

    describe('not exist', () => {
      it('return false', async () => {
        const id = 'id-1'

        const result = DAO.inWhitelist(id)

        expect(result).toBeFalse()
      })
    })
  })

  describe('addWhitelistItem', () => {
    describe('exist', () => {
      it('return undefined', async () => {
        const db = getDatabase()
        const id = 'id-1'
        insert(db, id)

        const result = DAO.addWhitelistItem(id)

        expect(result).toBeUndefined()
        expect(exist(db, id)).toBeTrue()
      })
    })

    describe('not exist', () => {
      it('return undefined', async () => {
        const db = getDatabase()
        const id = 'id-1'

        const result = DAO.addWhitelistItem(id)

        expect(result).toBeUndefined()
        expect(exist(db, id)).toBeTrue()
      })
    })
  })

  describe('removeWhitelistItem', () => {
    describe('exist', () => {
      it('return undefined', async () => {
        const db = getDatabase()
        const id = 'id-1'
        insert(db, id)

        const result = DAO.removeWhitelistItem(id)

        expect(result).toBeUndefined()
        expect(exist(db, id)).toBeFalse()
      })
    })

    describe('not exist', () => {
      it('return undefined', async () => {
        const db = getDatabase()
        const id = 'id-1'

        const result = DAO.removeWhitelistItem(id)

        expect(result).toBeUndefined()
        expect(exist(db, id)).toBeFalse()
      })
    })
  })
})

function exist(db: Database, id: string) {
  return !!select(db, id)
}

function insert(db: Database, id: string) {
  db.prepare('INSERT INTO store_whitelist (store_id) VALUES ($id);').run({ id });
}

function select(db: Database, id: string) {
  return db.prepare('SELECT * FROM store_whitelist WHERE store_id = $id;').get({ id })
}
