import * as DAO from '@dao/config-in-sqlite3/revision-policy/revision-policy'
import { resetEnvironment, resetDatabases } from '@test/utils'
import { getRawRevisionPolicy, hasRawRevisionPolicy, setRawRevisionPolicy } from './utils'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('RevisionPolicy', () => {
  describe('getAllIdsWithRevisionPolicies(): string[]', () => {
    it('return string[]', async () => {
      const id = 'id'
      setRawRevisionPolicy({
        store_id: id
      , update_revision_required: 1
      , delete_revision_required: 1
      })

      const result = DAO.getAllIdsWithRevisionPolicies()

      expect(result).toEqual([id])
    })
  })

  describe('getRevisionPolicies(storeId: string): { updateRevisionRequired: boolean | null, deleteRevisionRequired: boolean | null', () => {
    describe('policy exists', () => {
      it('return', async () => {
        const id = 'id'
        setRawRevisionPolicy({
          store_id: id
        , update_revision_required: 1
        , delete_revision_required: 1
        })

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
      const id = 'id'

      const result = DAO.setUpdateRevisionRequired(id, true)
      const row = getRawRevisionPolicy(id)

      expect(result).toBeUndefined()
      expect(row).not.toBeNull()
      expect(row!['update_revision_required']).toBe(1)
    })
  })

  describe('unsetUpdateRevisionRequired(storeId: string): void', () => {
    describe('policy exists', () => {
      it('return undefined', async () => {
        const id = 'id'
        setRawRevisionPolicy({
          store_id: id
        , update_revision_required: 1
        , delete_revision_required: 1
        })

        const result = DAO.unsetUpdateRevisionRequired(id)
        const row = getRawRevisionPolicy(id)

        expect(result).toBeUndefined()
        expect(row).not.toBeNull()
        expect(row!['update_revision_required']).toBeNull()
      })
    })

    describe('policy does not exist', () => {
      it('return undefined', async () => {
        const id = 'id'

        const result = DAO.unsetUpdateRevisionRequired(id)

        expect(result).toBeUndefined()
        expect(hasRawRevisionPolicy(id)).toBeFalse()
      })
    })
  })

  describe('setDeleteRevisionRequired(storeId: string, val: boolean): void', () => {
    it('return undefined', async () => {
      const id = 'id'

      const result = DAO.setDeleteRevisionRequired(id, true)
      const row = getRawRevisionPolicy(id)

      expect(result).toBeUndefined()
      expect(row).not.toBeNull()
      expect(row!['delete_revision_required']).toBe(1)
    })
  })

  describe('unsetDeleteRevisionRequired(id: string): void', () => {
    describe('policy exists', () => {
      it('return undefined', async () => {
        const id = 'id'
        setRawRevisionPolicy({
          store_id: id
        , update_revision_required: 1
        , delete_revision_required: 1
        })

        const result = DAO.unsetDeleteRevisionRequired(id)
        const row = getRawRevisionPolicy(id)

        expect(result).toBeUndefined()
        expect(row).not.toBeNull()
        expect(row!['delete_revision_required']).toBeNull()
      })
    })

    describe('policy does not exist', () => {
      it('return undefined', async () => {
        const id = 'id'

        const result = DAO.unsetDeleteRevisionRequired(id)

        expect(result).toBeUndefined()
        expect(hasRawRevisionPolicy(id)).toBeFalse()
      })
    })
  })
})
