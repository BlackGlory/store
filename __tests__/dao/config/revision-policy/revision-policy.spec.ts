import { RevisionPolicyDAO } from '@dao/config/revision-policy/index.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { getRawRevisionPolicy, hasRawRevisionPolicy, setRawRevisionPolicy } from './utils.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('RevisionPolicy', () => {
  describe('getAllNamespacesWithRevisionPolicies(): string[]', () => {
    it('return string[]', async () => {
      const namespace = 'namespace'
      setRawRevisionPolicy({
        namespace
      , update_revision_required: 1
      , delete_revision_required: 1
      })

      const result = RevisionPolicyDAO.getAllNamespacesWithRevisionPolicies()

      expect(result).toEqual([namespace])
    })
  })

  describe('getRevisionPolicies(namespace: string): { updateRevisionRequired: boolean | null, deleteRevisionRequired: boolean | null', () => {
    describe('policy exists', () => {
      it('return', async () => {
        const namespace = 'namespace'
        setRawRevisionPolicy({
          namespace
        , update_revision_required: 1
        , delete_revision_required: 1
        })

        const result = RevisionPolicyDAO.getRevisionPolicies(namespace)

        expect(result).toEqual({
          updateRevisionRequired: true
        , deleteRevisionRequired: true
        })
      })
    })

    describe('policy does not exist', () => {
      it('return', async () => {
        const namespace = 'namespace'

        const result = RevisionPolicyDAO.getRevisionPolicies(namespace)

        expect(result).toEqual({
          updateRevisionRequired: null
        , deleteRevisionRequired: null
        })
      })
    })
  })

  describe('setUpdateRevisionRequired(namespace: string, val: boolean): void', () => {
    it('return undefined', async () => {
      const namespace = 'namespace'

      const result = RevisionPolicyDAO.setUpdateRevisionRequired(namespace, true)
      const row = getRawRevisionPolicy(namespace)

      expect(result).toBeUndefined()
      expect(row).not.toBeNull()
      expect(row!['update_revision_required']).toBe(1)
    })
  })

  describe('unsetUpdateRevisionRequired(namespace: string): void', () => {
    describe('policy exists', () => {
      it('return undefined', async () => {
        const namespace = 'namespace'
        setRawRevisionPolicy({
          namespace
        , update_revision_required: 1
        , delete_revision_required: 1
        })

        const result = RevisionPolicyDAO.unsetUpdateRevisionRequired(namespace)
        const row = getRawRevisionPolicy(namespace)

        expect(result).toBeUndefined()
        expect(row).not.toBeNull()
        expect(row!['update_revision_required']).toBeNull()
      })
    })

    describe('policy does not exist', () => {
      it('return undefined', async () => {
        const namespace = 'namespace'

        const result = RevisionPolicyDAO.unsetUpdateRevisionRequired(namespace)

        expect(result).toBeUndefined()
        expect(hasRawRevisionPolicy(namespace)).toBe(false)
      })
    })
  })

  describe('setDeleteRevisionRequired(namespace: string, val: boolean): void', () => {
    it('return undefined', async () => {
      const namespace = 'namespace'

      const result = RevisionPolicyDAO.setDeleteRevisionRequired(namespace, true)
      const row = getRawRevisionPolicy(namespace)

      expect(result).toBeUndefined()
      expect(row).not.toBeNull()
      expect(row!['delete_revision_required']).toBe(1)
    })
  })

  describe('unsetDeleteRevisionRequired(namespace: string): void', () => {
    describe('policy exists', () => {
      it('return undefined', async () => {
        const namespace = 'namespace'
        setRawRevisionPolicy({
          namespace
        , update_revision_required: 1
        , delete_revision_required: 1
        })

        const result = RevisionPolicyDAO.unsetDeleteRevisionRequired(namespace)
        const row = getRawRevisionPolicy(namespace)

        expect(result).toBeUndefined()
        expect(row).not.toBeNull()
        expect(row!['delete_revision_required']).toBeNull()
      })
    })

    describe('policy does not exist', () => {
      it('return undefined', async () => {
        const namespace = 'namespace'

        const result = RevisionPolicyDAO.unsetDeleteRevisionRequired(namespace)

        expect(result).toBeUndefined()
        expect(hasRawRevisionPolicy(namespace)).toBe(false)
      })
    })
  })
})
