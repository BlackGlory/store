import * as DAO from '@dao/revision-policy/revision-policy'
import { getDatabase } from '@dao/revision-policy/database'
import { resetEnvironment, resetDatabases } from '@test/utils'
import { Database } from 'better-sqlite3'
import 'jest-extended'

jest.mock('@dao/access-control/database')
jest.mock('@dao/json-schema/database')
jest.mock('@dao/store/database')
jest.mock('@dao/revision-policy/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('RevisionPolicy', () => {
  describe('getAllIdsWithRevisionPolicies(): string[]', () => {
    it('return string[]', async () => {
      const db = getDatabase()
      const id = 'id'
      insert(db, id, { updateRevisionRequired: 1, deleteRevisionRequired: 1 })

      const result = DAO.getAllIdsWithRevisionPolicies()

      expect(result).toEqual([id])
    })
  })

  describe('getRevisionPolicies(storeId: string): { updateRevisionRequired: boolean | null, deleteRevisionRequired: boolean | null', () => {
    describe('policy exists', () => {
      it('return', async () => {
        const db = getDatabase()
        const id = 'id'
        insert(db, id, { updateRevisionRequired: 1, deleteRevisionRequired: 1 })

        const result = DAO.getRevisionPolicies(id)

        expect(result).toEqual({
          updateRevisionRequired: true
        , deleteRevisionRequired: true
        })
      })
    })

    describe('policy does not exist', () => {
      it('return', async () => {
        const id = 'id'

        const result = DAO.getRevisionPolicies(id)

        expect(result).toEqual({
          updateRevisionRequired: null
        , deleteRevisionRequired: null
        })
      })
    })
  })

  describe('setUpdateRevisionRequired(storeId: string, val: boolean): void', () => {
    it('return undefined', async () => {
      const db = getDatabase()
      const id = 'id'

      const result = DAO.setUpdateRevisionRequired(id, true)
      const row = select(db, id)

      expect(result).toBeUndefined()
      expect(row['update_revision_required']).toBe(1)
    })
  })

  describe('unsetUpdateRevisionRequired(storeId: string): void', () => {
    describe('policy exists', () => {
      it('return undefined', async () => {
        const db = getDatabase()
        const id = 'id'
        insert(db, id, { updateRevisionRequired: 1, deleteRevisionRequired: 1 })

        const result = DAO.unsetUpdateRevisionRequired(id)
        const row = select(db, id)

        expect(result).toBeUndefined()
        expect(row['update_revision_required']).toBeNull()
      })
    })

    describe('policy does not exist', () => {
      it('return undefined', async () => {
        const db = getDatabase()
        const id = 'id'

        const result = DAO.unsetUpdateRevisionRequired(id)

        expect(result).toBeUndefined()
        expect(exist(db, id)).toBeFalse()
      })
    })
  })

  describe('setDeleteRevisionRequired(storeId: string, val: boolean): void', () => {
    it('return undefined', async () => {
      const db = getDatabase()
      const id = 'id'

      const result = DAO.setDeleteRevisionRequired(id, true)
      const row = select(db, id)

      expect(result).toBeUndefined()
      expect(row['delete_revision_required']).toBe(1)
    })
  })

  describe('unsetDeleteRevisionRequired(id: string): void', () => {
    describe('policy exists', () => {
      it('return undefined', async () => {
        const db = getDatabase()
        const id = 'id'
        insert(db, id, { updateRevisionRequired: 1, deleteRevisionRequired: 1 })

        const result = DAO.unsetDeleteRevisionRequired(id)
        const row = select(db, id)

        expect(result).toBeUndefined()
        expect(row['delete_revision_required']).toBeNull()
      })
    })

    describe('policy does not exist', () => {
      it('return undefined', async () => {
        const db = getDatabase()
        const id = 'id'

        const result = DAO.unsetDeleteRevisionRequired(id)

        expect(result).toBeUndefined()
        expect(exist(db, id)).toBeFalse()
      })
    })
  })
})

function exist(db: Database, id: string) {
  return !!select(db, id)
}

function select(db: Database, id: string) {
  return db.prepare(`
    SELECT *
      FROM store_revision_policy
     WHERE store_id = $id;
  `).get({ id })
}

function insert(
  db: Database
, id: string
, { updateRevisionRequired, deleteRevisionRequired }: {
    updateRevisionRequired: number | null
    deleteRevisionRequired: number | null
  }
) {
  db.prepare(`
    INSERT INTO store_revision_policy (store_id, update_revision_required, delete_revision_required)
    VALUES ($id, $updateRevisionRequired, $deleteRevisionRequired);
  `).run({
    id
  , updateRevisionRequired
  , deleteRevisionRequired
  })
}
